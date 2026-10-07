import type { Metadata } from "next";
import { ProductView } from "@/components/pages/ProductView";
import * as catalog from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await catalog.getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await catalog.getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: Props) {
  return <ProductView catalog={catalog} slug={(await params).slug} />;
}
