// Popula o banco com as categorias e produtos de exemplo de src/data.
// Só cria o que ainda não existe; não sobrescreve edições feitas no painel.
import { PrismaClient } from "@prisma/client";
import categories from "../src/data/categories.json";
import products from "../src/data/products.json";

const prisma = new PrismaClient();

async function main() {
  for (const [i, c] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, name: c.name, description: c.description, color: c.color, emoji: c.emoji, sortOrder: i },
    });
  }
  for (const p of products as Array<(typeof products)[number] & { image?: string }>) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        priceCents: p.price,
        items: p.items,
        images: p.image ? [p.image] : [],
        badges: p.categories.includes("pronta-entrega") ? ["Pronta entrega"] : [],
        stock: 10,
        featured: p.featured ?? false,
        active: p.active ?? true,
        categories: { connect: p.categories.map((slug) => ({ slug })) },
      },
    });
  }
  console.log(`Seed: ${categories.length} categorias, ${products.length} produtos.`);
}

main().finally(() => prisma.$disconnect());
