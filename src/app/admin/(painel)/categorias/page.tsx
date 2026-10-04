import { prisma } from "@/lib/db";
import { deleteCategory } from "../../actions";
import CategoryForm from "./category-form";
import ConfirmButton from "../confirm-button";

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Categorias e ocasiões</h1>
        <p className="mt-1 text-sm text-stone-500">
          Aparecem no menu da loja, na ordem abaixo. Ex.: Pronta Entrega, Aniversário, Café da Manhã, Tábuas.
        </p>
      </div>
      <section className="admin-card">
        <h2 className="admin-label">Nova categoria</h2>
        <CategoryForm />
      </section>
      {categories.length === 0 ? (
        <p className="text-sm text-stone-500">Nenhuma ainda.</p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-xl bg-white ring-1 ring-stone-200">
          {categories.map((c) => (
            <li key={c.id} className="p-4">
              <CategoryForm category={c} />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-stone-500">
                  {c._count.products} produto(s) · /categoria/{c.slug}
                </span>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton message={`Excluir "${c.name}"? Os produtos continuam cadastrados.`}>Excluir</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
