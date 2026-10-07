import { ProductGrid } from "@/components/ProductCard";
import type { Catalog } from "@/lib/catalog-types";

export async function SearchView({ catalog, q }: { catalog: Catalog; q: string }) {
  const results = await catalog.searchProducts(q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl">
        {q ? <>Resultados para &ldquo;{q}&rdquo;</> : "Buscar produtos"}
      </h1>
      {results.length ? (
        <ProductGrid products={results} />
      ) : (
        <p className="py-12 text-center text-cocoa/70">
          {q ? "Nenhum produto encontrado. Tente outra palavra ou fale com a gente pelo WhatsApp." : "Digite o que você procura na busca acima."}
        </p>
      )}
    </div>
  );
}
