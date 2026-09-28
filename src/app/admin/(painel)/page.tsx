import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/store";
import { toggleProductActive } from "../actions";

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; excluido?: string }>;
}) {
  const sp = await searchParams;
  const products = await prisma.product.findMany({
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <Link href="/admin/produtos/novo" className="admin-btn-primary">+ Novo produto</Link>
      </div>

      {sp.salvo && <p className="admin-notice mt-4">Produto salvo.</p>}
      {sp.excluido && <p className="admin-notice mt-4">Produto excluído.</p>}

      {products.length === 0 ? (
        <p className="mt-10 text-center text-stone-500">
          Nenhum produto ainda. Clique em <strong>Novo produto</strong> para cadastrar o primeiro.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-stone-200 rounded-xl bg-white ring-1 ring-stone-200">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-4 p-3">
              {p.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0]} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-stone-100" />
              )}
              <div className="min-w-0 flex-1">
                <Link href={`/admin/produtos/${p.id}`} className="font-medium hover:underline">
                  {p.name}
                </Link>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-stone-500">
                  <span>{formatPrice(p.priceCents)}</span>
                  <span className={p.stock === 0 ? "text-red-600" : ""}>Estoque: {p.stock}</span>
                  {p.categories.length > 0 && <span>{p.categories.map((c) => c.name).join(", ")}</span>}
                </div>
                {p.badges.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.badges.map((b) => (
                      <span key={b} className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">{b}</span>
                    ))}
                  </div>
                )}
              </div>
              <form action={toggleProductActive}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    p.active ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-600"
                  }`}
                  title="Clique para mostrar/ocultar na loja"
                >
                  {p.active ? "Visível" : "Oculto"}
                </button>
              </form>
              <Link href={`/admin/produtos/${p.id}`} className="text-sm text-stone-600 hover:underline">
                Editar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
