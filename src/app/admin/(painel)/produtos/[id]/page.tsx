import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { deleteProduct } from "../../../actions";
import ProductForm from "../product-form";
import ConfirmButton from "../../confirm-button";

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { categories: { select: { id: true } } } }),
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">← Produtos</Link>
      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Editar produto</h1>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <ConfirmButton message={`Excluir "${product.name}"? Isso não pode ser desfeito.`}>
            Excluir produto
          </ConfirmButton>
        </form>
      </div>
      <ProductForm
        product={product}
        categories={categories}
        uploadsEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      />
    </div>
  );
}
