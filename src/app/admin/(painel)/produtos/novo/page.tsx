import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductForm from "../product-form";

export default async function NovoProdutoPage() {
  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return (
    <div>
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">← Produtos</Link>
      <h1 className="mt-2 text-2xl font-semibold">Novo produto</h1>
      <ProductForm categories={categories} uploadsEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
    </div>
  );
}
