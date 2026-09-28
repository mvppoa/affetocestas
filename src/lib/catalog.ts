import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import type { Category, Product } from "./types";

// Fonte de dados do catálogo. Hoje lê de arquivos JSON em src/data;
// o painel de admin pode trocar estas funções por um banco de dados
// sem mudar as páginas, que só usam as funções abaixo.

const categories = categoriesData as Category[];
const products = productsData as Product[];

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}

export async function getProducts(): Promise<Product[]> {
  return products.filter((p) => p.active !== false);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.categories.includes(slug));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.featured);
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
