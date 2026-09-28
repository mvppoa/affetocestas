import type { Metadata } from "next";
import { store, whatsappLink } from "@/lib/store";

export const metadata: Metadata = { title: "Como comprar" };

const steps = [
  { title: "Escolha o presente", text: "Navegue pelas ocasiões e adicione ao carrinho as cestas, tábuas e adicionais que quiser." },
  { title: "Finalize o pedido", text: "No carrinho, envie o pedido pelo WhatsApp. Lá combinamos a data, o horário e o endereço de entrega." },
  { title: "Escreva o cartão", text: "Mande a mensagem que vai no cartão personalizado. A gente capricha na letra." },
  { title: "Receba com afeto", text: "Montamos tudo no dia e entregamos com cuidado na data combinada." },
];

export default function HowToBuyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl">Como comprar</h1>
      <ol className="mt-8 space-y-6">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta font-semibold text-white">{i + 1}</span>
            <div>
              <h2 className="font-serif text-xl">{s.title}</h2>
              <p className="mt-1 text-cocoa/80">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-10 text-cocoa/80">
        Dúvidas? Fale com a gente pelo <a href={whatsappLink()} target="_blank" rel="noopener" className="font-semibold text-terracotta underline">WhatsApp {store.phoneDisplay}</a> ou
        pelo e-mail <a href={`mailto:${store.email}`} className="font-semibold text-terracotta underline">{store.email}</a>.
      </p>
    </div>
  );
}
