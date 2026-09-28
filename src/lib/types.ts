export type Category = {
  slug: string;
  name: string;
  description: string;
  /** Cor de destaque usada nos cartões e imagens de exemplo */
  color: string;
  emoji: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Preço em centavos (R$ 189,90 = 18990) */
  price: number;
  /** Categorias às quais o produto pertence (slugs) */
  categories: string[];
  /** Itens que acompanham a cesta ou tábua */
  items: string[];
  /** Caminho ou URL da imagem. Sem imagem, a loja mostra uma ilustração. */
  image?: string;
  /** Todas as fotos (a primeira é a mesma de `image`) */
  images?: string[];
  /** Preço "de" riscado, em centavos */
  compareAtPrice?: number;
  /** Selos, ex.: "Pronta entrega", "Mais vendido" */
  badges?: string[];
  stock?: number;
  featured?: boolean;
  active?: boolean;
};
