import { notFound } from "next/navigation";
import { StoreLink } from "@/components/StoreLink";
import { ProductGrid } from "@/components/ProductCard";
import type { Catalog } from "@/lib/catalog-types";

export async function CategoryView({ catalog, slug }: { catalog: Catalog; slug: string }) {
  const category = await catalog.getCategory(slug);
  if (!category) notFound();
  const products = await catalog.getProductsByCategory(slug);

  return (
    <div>
      <div className="py-10 text-center text-white" style={{ backgroundColor: category.color }}>
        <p className="text-5xl" aria-hidden="true">{category.emoji}</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{category.name}</h1>
        <p className="mt-2 text-white/90">{category.description}</p>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-6 text-sm text-cocoa/60" aria-label="Você está em">
          <StoreLink href="/" className="hover:text-terracotta">Início</StoreLink> / <span>{category.name}</span>
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
