import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/store";
import { ProductImage } from "./ProductImage";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sand transition hover:shadow-md">
      <Link href={`/produto/${product.slug}`} className="block aspect-square overflow-hidden">
        <ProductImage
          name={product.name}
          image={product.image}
          categories={product.categories}
          className="transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/produto/${product.slug}`} className="font-serif text-lg leading-snug text-cocoa hover:text-terracotta">
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-cocoa/70">{product.description}</p>
        <div className="mt-auto pt-4">
          <p className="text-xl font-semibold text-terracotta">{formatPrice(product.price)}</p>
          <AddToCartButton product={product} className="mt-3 w-full" />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
