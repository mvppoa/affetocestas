import { StoreLink } from "@/components/StoreLink";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductGrid } from "@/components/ProductCard";
import type { Catalog } from "@/lib/catalog-types";
import { store, whatsappLink } from "@/lib/store";

export async function HomeView({ catalog }: { catalog: Catalog }) {
  const [categories, featured, breakfast, boards] = await Promise.all([
    catalog.getCategories(),
    catalog.getFeaturedProducts(),
    catalog.getProductsByCategory("cafe-da-manha"),
    catalog.getProductsByCategory("tabuas"),
  ]);

  return (
    <>
      <HeroCarousel />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <ul className="grid gap-4 text-center text-sm sm:grid-cols-3">
          <li className="rounded-2xl bg-white p-4 ring-1 ring-sand">🧺 <strong>Montadas à mão</strong> com produtos selecionados</li>
          <li className="rounded-2xl bg-white p-4 ring-1 ring-sand">🚚 <strong>Entrega combinada</strong> na data que você escolher</li>
          <li className="rounded-2xl bg-white p-4 ring-1 ring-sand">💌 <strong>Cartão personalizado</strong> com a sua mensagem</li>
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <SectionTitle title="Presentes por ocasião" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <StoreLink
              key={c.slug}
              href={`/categoria/${c.slug}`}
              className="group flex flex-col items-center rounded-2xl p-5 text-center text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: c.color }}
            >
              <span className="text-4xl" aria-hidden="true">{c.emoji}</span>
              <span className="mt-2 font-serif text-lg">{c.name}</span>
            </StoreLink>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <SectionTitle title="Destaques" href="/categoria/pronta-entrega" />
        <ProductGrid products={featured} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <SectionTitle title="Café da manhã" href="/categoria/cafe-da-manha" />
        <ProductGrid products={breakfast.slice(0, 4)} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <SectionTitle title="Tábuas" href="/categoria/tabuas" />
        <ProductGrid products={boards.slice(0, 4)} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-sand/70 px-6 py-10 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl">Quer montar uma cesta do seu jeito?</h2>
          <p className="max-w-xl text-cocoa/80">
            Conte para a gente a ocasião, o orçamento e o gosto de quem vai receber. A {store.owner} monta uma cesta exclusiva para você.
          </p>
          <a
            href={whatsappLink("Olá! Gostaria de montar uma cesta personalizada.")}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-whatsapp px-6 py-3 font-semibold text-white hover:brightness-95"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-serif text-2xl sm:text-3xl">{title}</h2>
      {href && (
        <StoreLink href={href} className="text-sm font-semibold text-terracotta hover:underline">
          Ver todos
        </StoreLink>
      )}
    </div>
  );
}
