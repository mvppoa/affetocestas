import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import { matchesQuery } from "./search";
import type { Category, Product } from "./types";

// Catálogo de exemplo da primeira versão da loja (15 produtos fixos), usado
// pela prévia em /preview. Não acessa o banco de dados.

const categories = categoriesData as Category[];
const products = (productsData as Product[]).filter((p) => p.active !== false);

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return products.filter((p) => p.categories.includes(slug));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((p) => p.featured);
}

export async function searchProducts(query: string): Promise<Product[]> {
  return products.filter((p) => matchesQuery(p, query));
}
