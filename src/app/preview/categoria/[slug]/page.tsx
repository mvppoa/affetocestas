import type { Metadata } from "next";
import { CategoryView } from "@/components/pages/CategoryView";
import * as catalog from "@/lib/sample-catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await catalog.getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await catalog.getCategory((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: Props) {
  return <CategoryView catalog={catalog} slug={(await params).slug} />;
}
