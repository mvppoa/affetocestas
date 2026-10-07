import type { Product } from "./types";

export function matchesQuery(product: Product, query: string): boolean {
  const q = normalize(query);
  if (!q) return false;
  return normalize(`${product.name} ${product.description} ${product.items.join(" ")}`).includes(q);
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}
