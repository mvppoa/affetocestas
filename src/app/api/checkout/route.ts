import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { getStripe, paymentMethodTypes, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutBody = { items?: { id?: unknown; quantity?: unknown }[] };

const MAX_QUANTITY = 20;

// Cria o pedido pendente e a sessão do Stripe Checkout a partir do carrinho.
// Preços sempre vêm do catálogo no servidor, nunca do navegador.
export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  const products = new Map((await getProducts()).map((p) => [p.id, p]));
  const lines = [];
  for (const item of body.items ?? []) {
    const product = typeof item.id === "string" ? products.get(item.id) : undefined;
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return NextResponse.json(
        { error: "Um item do carrinho não está mais disponível. Atualize o carrinho e tente de novo." },
        { status: 400 },
      );
    }
    lines.push({ product, quantity });
  }
  if (lines.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      totalCents: lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
      items: {
        create: lines.map((l) => ({
          productId: l.product.id,
          name: l.product.name,
          unitPriceCents: l.product.price,
          quantity: l.quantity,
        })),
      },
    },
  });

  const base = siteUrl(req.nextUrl.origin);
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      locale: "pt-BR",
      currency: "brl",
      payment_method_types: paymentMethodTypes(),
      payment_method_options: { pix: { expires_after_seconds: 60 * 60 } },
      line_items: lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: "brl",
          unit_amount: l.product.price,
          product_data: {
            name: l.product.name,
            ...(l.product.image?.startsWith("https://") ? { images: [l.product.image] } : {}),
          },
        },
      })),
      client_reference_id: order.id,
      metadata: { orderId: order.id },
      payment_intent_data: { metadata: { orderId: order.id } },
      shipping_address_collection: { allowed_countries: ["BR"] },
      phone_number_collection: { enabled: true },
      custom_fields: [
        {
          key: "data_entrega",
          label: { type: "custom", custom: "Data e horário da entrega" },
          type: "text",
          text: { maximum_length: 100 },
        },
        {
          key: "mensagem_cartao",
          label: { type: "custom", custom: "Mensagem do cartão" },
          type: "text",
          optional: true,
          text: { maximum_length: 255 },
        },
      ],
      success_url: `${base}/pedido/confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/carrinho`,
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão do Stripe", error);
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELED" } });
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento. Tente de novo ou finalize pelo WhatsApp." },
      { status: 502 },
    );
  }
}
