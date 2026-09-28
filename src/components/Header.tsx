"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/types";
import { store, whatsappLink } from "@/lib/store";
import { useCart } from "./CartProvider";
import { Logo } from "./Logo";
import { CartIcon, CloseIcon, InstagramIcon, MailIcon, MenuIcon, SearchIcon, WhatsAppIcon } from "./Icons";

export function Header({ categories }: { categories: Category[] }) {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-sand">
      <div className="bg-cocoa text-cream text-xs sm:text-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <p className="truncate">Entregas em Porto Alegre e região. Encomende pelo site ou WhatsApp.</p>
          <div className="hidden items-center gap-4 md:flex">
            <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-white">
              <WhatsAppIcon className="h-4 w-4" /> {store.phoneDisplay}
            </a>
            <a href={`mailto:${store.email}`} className="flex items-center gap-1 hover:text-white">
              <MailIcon className="h-4 w-4" /> {store.email}
            </a>
            <a href={store.instagramUrl} target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-white">
              <InstagramIcon className="h-4 w-4" /> {store.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <button className="p-2 text-cocoa lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Logo />

        <form onSubmit={onSearch} className="hidden flex-1 max-w-md lg:flex" role="search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cestas, tábuas, presentes..."
            className="w-full rounded-l-full border border-sand bg-white px-4 py-2 text-sm outline-none focus:border-terracotta"
            aria-label="Buscar produtos"
          />
          <button className="rounded-r-full bg-terracotta px-4 text-white hover:bg-terracotta-dark" aria-label="Buscar">
            <SearchIcon />
          </button>
        </form>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink("Olá! Gostaria de fazer uma encomenda.")}
            target="_blank"
            rel="noopener"
            className="hidden items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white hover:brightness-95 sm:flex"
          >
            <WhatsAppIcon className="h-5 w-5" /> Peça pelo WhatsApp
          </a>
          <Link href="/carrinho" className="relative p-2 text-cocoa hover:text-terracotta" aria-label={`Carrinho, ${count} itens`}>
            <CartIcon className="h-7 w-7" />
            {ready && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className={`${open ? "block" : "hidden"} border-t border-sand lg:block`} aria-label="Categorias">
        <form onSubmit={onSearch} className="flex px-4 pt-3 lg:hidden" role="search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar..."
            className="w-full rounded-l-full border border-sand bg-white px-4 py-2 text-sm outline-none"
            aria-label="Buscar produtos"
          />
          <button className="rounded-r-full bg-terracotta px-4 text-white" aria-label="Buscar">
            <SearchIcon />
          </button>
        </form>
        <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2 lg:flex-row lg:flex-wrap lg:justify-center">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/categoria/${c.slug}`}
                onClick={() => setOpen(false)}
                className="block rounded-full px-3 py-2 text-sm font-medium uppercase tracking-wide lg:px-2.5 lg:text-[0.8rem] text-cocoa hover:bg-sand/60 hover:text-terracotta"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
