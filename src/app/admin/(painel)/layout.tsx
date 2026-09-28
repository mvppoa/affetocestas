import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

export const metadata = { title: "Painel Afetto", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/admin" className="font-semibold">Painel Afetto</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin/pedidos" className="hover:underline">Pedidos</Link>
            <Link href="/admin" className="hover:underline">Produtos</Link>
            <Link href="/admin/categorias" className="hover:underline">Categorias</Link>
            <Link href="/" target="_blank" className="hover:underline">Ver loja ↗</Link>
          </nav>
          <form action={logout} className="ml-auto">
            <button className="text-sm text-stone-500 hover:text-stone-800">Sair</button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
