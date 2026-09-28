import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { Category, Product } from "./types";

// Fonte de dados do catálogo: banco Postgres (via Prisma), editado pelo
// painel em /admin. As páginas só usam as funções abaixo.

const productInclude = { categories: { select: { slug: true } } } satisfies Prisma.ProductInclude;
type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function toProduct(p: ProductRow): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.priceCents,
    compareAtPrice: p.compareAtCents ?? undefined,
    categories: p.categories.map((c) => c.slug),
    items: p.items,
    image: p.images[0],
    images: p.images,
    badges: p.badges,
    stock: p.stock,
    featured: p.featured,
    active: p.active,
  };
}

const productOrder = [{ featured: "desc" }, { createdAt: "desc" }] satisfies Prisma.ProductOrderByWithRelationInput[];

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  return rows.map(({ slug, name, description, color, emoji }) => ({ slug, name, description, color, emoji }));
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    include: productInclude,
    orderBy: productOrder,
  });
  return rows.map(toProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const row = await prisma.product.findFirst({ where: { slug, active: true }, include: productInclude });
  return row ? toProduct(row) : undefined;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, categories: { some: { slug } } },
    include: productInclude,
    orderBy: productOrder,
  });
  return rows.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: productInclude,
    orderBy: productOrder,
  });
  return rows.map(toProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = normalize(query);
  if (!q) return [];
  return (await getProducts()).filter((p) =>
    normalize(`${p.name} ${p.description} ${p.items.join(" ")}`).includes(q),
  );
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}
