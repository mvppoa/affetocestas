import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-6xl" aria-hidden="true">🧺</p>
      <h1 className="mt-4 font-serif text-3xl">Página não encontrada</h1>
      <p className="mt-2 text-cocoa/70">O que você procura não está aqui, mas temos muitos outros presentes.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-terracotta px-6 py-3 font-semibold text-white">Voltar ao início</Link>
    </div>
  );
}
