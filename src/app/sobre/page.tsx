import type { Metadata } from "next";
import { store, whatsappLink } from "@/lib/store";

export const metadata: Metadata = { title: "Sobre a Afetto" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl">Sobre a Afetto</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-cocoa/85">
        <p>
          A {store.name} nasceu da vontade de transformar presentes em momentos. Cada cesta e cada tábua é
          montada à mão pela {store.owner}, com produtos escolhidos um a um e muito cuidado nos detalhes.
        </p>
        <p>
          Seja para um aniversário, um café da manhã surpresa, a chegada de um bebê ou um agradecimento à sua
          equipe, a gente ajuda você a dizer o que sente com um presente que tem a sua cara.
        </p>
        <p>
          Quer algo sob medida? <a href={whatsappLink()} target="_blank" rel="noopener" className="font-semibold text-terracotta underline">Chame no WhatsApp</a> ou
          siga <a href={store.instagramUrl} target="_blank" rel="noopener" className="font-semibold text-terracotta underline">{store.instagramHandle}</a> no Instagram.
        </p>
      </div>
    </div>
  );
}
