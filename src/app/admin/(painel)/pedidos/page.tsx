import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { orderStatusLabel, orderStatusClass } from "@/lib/orders";
import { formatPrice } from "@/lib/store";

const VISIBLE_BY_DEFAULT: OrderStatus[] = ["PAID", "AWAITING_PAYMENT"];

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ todos?: string }>;
}) {
  const { todos } = await searchParams;
  const showAll = Boolean(todos);
  const orders = await prisma.order.findMany({
    where: showAll ? undefined : { status: { in: VISIBLE_BY_DEFAULT } },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <Link href={showAll ? "/admin/pedidos" : "/admin/pedidos?todos=1"} className="admin-btn-secondary">
          {showAll ? "Só pagos e aguardando Pix" : "Mostrar todos (inclui não finalizados)"}
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 text-center text-stone-500">Nenhum pedido pago pelo site ainda.</p>
      ) : (
        <ul className="mt-6 divide-y divide-stone-200 rounded-xl bg-white ring-1 ring-stone-200">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/admin/pedidos/${o.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-3 hover:bg-stone-50">
                <span className="w-14 font-mono text-sm text-stone-500">#{o.number}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{o.customerName ?? "Cliente não informado"}</p>
                  <p className="truncate text-sm text-stone-500">
                    {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </p>
                  {o.deliveryDate && <p className="text-sm text-stone-600">Entrega: {o.deliveryDate}</p>}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(o.totalCents)}</p>
                  <p className="text-xs text-stone-500">{o.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatusClass[o.status]}`}>
                  {orderStatusLabel[o.status]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
