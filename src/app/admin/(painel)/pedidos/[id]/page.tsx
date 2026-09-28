import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { orderStatusClass, orderStatusLabel } from "@/lib/orders";
import { formatPrice, whatsappLinkTo } from "@/lib/store";

type Address = { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string };

const paymentMethodLabel: Record<string, string> = { card: "Cartão", pix: "Pix" };

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const address = order.shippingAddress as Address | null;
  const dateTime = (d: Date) => d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  return (
    <div className="space-y-6">
      <Link href="/admin/pedidos" className="text-sm text-stone-500 hover:underline">← Pedidos</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Pedido #{order.number}</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatusClass[order.status]}`}>
          {orderStatusLabel[order.status]}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="admin-card space-y-1 text-sm">
          <h2 className="mb-2 font-semibold">Cliente</h2>
          <p>{order.customerName ?? "Não informado"}</p>
          {order.customerEmail && <p><a href={`mailto:${order.customerEmail}`} className="hover:underline">{order.customerEmail}</a></p>}
          {order.customerPhone && (
            <p>
              {order.customerPhone}{" "}
              <a href={whatsappLinkTo(order.customerPhone)} target="_blank" rel="noopener" className="text-green-700 hover:underline">
                (WhatsApp)
              </a>
            </p>
          )}
        </section>

        <section className="admin-card space-y-1 text-sm">
          <h2 className="mb-2 font-semibold">Entrega</h2>
          {order.deliveryDate && <p><strong>Quando:</strong> {order.deliveryDate}</p>}
          {order.shippingName && <p><strong>Para:</strong> {order.shippingName}</p>}
          {address && (
            <p>
              {[address.line1, address.line2].filter(Boolean).join(", ")}
              <br />
              {[address.city, address.state, address.postal_code].filter(Boolean).join(" · ")}
            </p>
          )}
          {order.giftMessage && (
            <p className="mt-2 rounded-lg bg-amber-50 p-2 italic">“{order.giftMessage}”</p>
          )}
        </section>
      </div>

      <section className="admin-card">
        <h2 className="mb-3 font-semibold">Itens</h2>
        <ul className="divide-y divide-stone-100 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between py-2">
              <span>{i.quantity}x {i.name}</span>
              <span>{formatPrice(i.unitPriceCents * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t border-stone-200 pt-3 font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.totalCents)}</span>
        </p>
      </section>

      <section className="admin-card space-y-1 text-sm text-stone-600">
        <h2 className="mb-2 font-semibold text-stone-800">Pagamento</h2>
        {order.paymentMethod && <p>Forma: {paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}</p>}
        <p>Criado em {dateTime(order.createdAt)}</p>
        {order.paidAt && <p>Pago em {dateTime(order.paidAt)}</p>}
        {order.stripePaymentIntentId && (
          <p>
            <a
              href={`https://dashboard.stripe.com/payments/${order.stripePaymentIntentId}`}
              target="_blank"
              rel="noopener"
              className="hover:underline"
            >
              Ver no Stripe ↗
            </a>
          </p>
        )}
      </section>
    </div>
  );
}
