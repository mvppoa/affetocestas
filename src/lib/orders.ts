import type Stripe from "stripe";
import type { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export const orderStatusLabel: Record<OrderStatus, string> = {
  PENDING: "Aguardando checkout",
  AWAITING_PAYMENT: "Aguardando Pix",
  PAID: "Pago",
  FAILED: "Pagamento falhou",
  CANCELED: "Cancelado",
};

export const orderStatusClass: Record<OrderStatus, string> = {
  PENDING: "bg-stone-100 text-stone-600",
  AWAITING_PAYMENT: "bg-amber-100 text-amber-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-700",
  CANCELED: "bg-stone-200 text-stone-600",
};

function customField(session: Stripe.Checkout.Session, key: string) {
  return session.custom_fields?.find((f) => f.key === key)?.text?.value ?? null;
}

/**
 * Copia para o pedido os dados que o cliente preencheu no Checkout e muda o status.
 * Um pedido já pago nunca volta para outro status, mesmo se os eventos chegarem fora de ordem.
 * Retorna true quando o pedido acabou de virar PAID.
 */
export async function syncOrderFromSession(sessionId: string, status: OrderStatus) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent.payment_method"],
  });
  const orderId = session.metadata?.orderId ?? session.client_reference_id;
  if (!orderId) return false;

  const intent = session.payment_intent as Stripe.PaymentIntent | null;
  const method = intent?.payment_method as Stripe.PaymentMethod | null | undefined;
  const shipping = session.collected_information?.shipping_details;
  const customer = session.customer_details;

  const data: Prisma.OrderUpdateManyMutationInput = {
    status,
    stripeSessionId: session.id,
    stripePaymentIntentId: intent?.id ?? null,
    paymentMethod: method?.type ?? null,
    customerName: customer?.name ?? null,
    customerEmail: customer?.email ?? null,
    customerPhone: customer?.phone ?? null,
    shippingName: shipping?.name ?? null,
    shippingAddress: (shipping?.address as Prisma.InputJsonValue | undefined) ?? undefined,
    deliveryDate: customField(session, "data_entrega"),
    giftMessage: customField(session, "mensagem_cartao"),
    ...(status === "PAID" ? { paidAt: new Date() } : {}),
  };

  const result = await prisma.order.updateMany({
    where: { id: orderId, status: { not: "PAID" } },
    data,
  });
  const justPaid = status === "PAID" && result.count === 1;
  if (justPaid) await decrementStock(orderId);
  return justPaid;
}

// Baixa o estoque dos produtos vendidos, sem deixar ficar negativo
// (cestas feitas por encomenda podem ser vendidas com estoque 0).
async function decrementStock(orderId: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    await prisma.$executeRaw`UPDATE "Product" SET stock = GREATEST(stock - ${item.quantity}, 0) WHERE id = ${item.productId}`;
  }
}
