import { notFound } from "next/navigation";
import { StoreLink } from "@/components/StoreLink";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { ProductGrid } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import type { Catalog } from "@/lib/catalog-types";

export async function ProductView({ catalog, slug }: { catalog: Catalog; slug: string }) {
  const product = await catalog.getProduct(slug);
  if (!product) notFound();

  const category = await catalog.getCategory(product.categories[0]);
  const related = (await catalog.getProductsByCategory(product.categories[0]))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const extras = (await catalog.getProductsByCategory("adicionais")).filter((p) => p.id !== product.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-cocoa/60" aria-label="Você está em">
        <StoreLink href="/" className="hover:text-terracotta">Início</StoreLink>
        {category && (
          <>
            {" / "}
            <StoreLink href={`/categoria/${category.slug}`} className="hover:text-terracotta">{category.name}</StoreLink>
          </>
        )}
        {" / "}
        <span>{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-3xl ring-1 ring-sand">
          <ProductImage name={product.name} image={product.image} categories={product.categories} />
        </div>

        <div>
          <h1 className="font-serif text-3xl sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-cocoa/80">{product.description}</p>

          <div className="mt-6">
            <ProductBuyBox product={product} />
          </div>

          {product.items.length > 0 && (
            <div className="mt-8">
              <h2 className="font-serif text-xl">O que vem na cesta</h2>
              <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
                {product.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-terracotta">✿</span> {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-cocoa/60">
                Alguns itens podem ser substituídos por outros de igual ou maior valor, conforme a disponibilidade.
              </p>
            </div>
          )}
        </div>
      </div>

      {extras.length > 0 && !product.categories.includes("adicionais") && (
        <section className="mt-14">
          <h2 className="mb-6 font-serif text-2xl">Deixe o presente ainda mais especial</h2>
          <ProductGrid products={extras.slice(0, 4)} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-serif text-2xl">Você também pode gostar</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
