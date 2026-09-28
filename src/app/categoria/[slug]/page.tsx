import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductCard";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const products = await getProductsByCategory(slug);

  return (
    <div>
      <div className="py-10 text-center text-white" style={{ backgroundColor: category.color }}>
        <p className="text-5xl" aria-hidden="true">{category.emoji}</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{category.name}</h1>
        <p className="mt-2 text-white/90">{category.description}</p>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-6 text-sm text-cocoa/60" aria-label="Você está em">
          <Link href="/" className="hover:text-terracotta">Início</Link> / <span>{category.name}</span>
        </nav>
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <p className="py-12 text-center text-cocoa/70">Em breve teremos produtos nesta categoria.</p>
        )}
      </div>
    </div>
  );
}
