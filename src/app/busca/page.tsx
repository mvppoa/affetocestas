import type { Metadata } from "next";
import { ProductGrid } from "@/components/ProductCard";
import { searchProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Busca" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const q = (await searchParams).q ?? "";
  const results = await searchProducts(q);

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
