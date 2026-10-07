import type { Category, Product } from "./types";

/** O que as páginas da loja precisam do catálogo: o banco (catalog.ts) ou o exemplo (sample-catalog.ts). */
export type Catalog = {
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | undefined>;
  getProducts(): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | undefined>;
  getProductsByCategory(slug: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
};
