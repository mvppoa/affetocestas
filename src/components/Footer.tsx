import Link from "next/link";
import type { Category } from "@/lib/types";
import { store, whatsappLink } from "@/lib/store";
import { Logo } from "./Logo";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "./Icons";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-16 bg-cocoa text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-cream/80">{store.tagline}.</p>
        </div>

        <div>
          <h3 className="font-serif text-lg">Ocasiões</h3>
          <ul className="mt-3 space-y-1 text-sm text-cream/80">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categoria/${c.slug}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg">Institucional</h3>
          <ul className="mt-3 space-y-1 text-sm text-cream/80">
            <li><Link href="/sobre" className="hover:text-white">Sobre a Afetto</Link></li>
            <li><Link href="/como-comprar" className="hover:text-white">Como comprar</Link></li>
            <li><Link href="/carrinho" className="hover:text-white">Meu carrinho</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg">Fale com a gente</h3>
          <ul className="mt-3 space-y-3 text-sm text-cream/80">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white">
                <WhatsAppIcon className="h-5 w-5" /> {store.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${store.email}`} className="flex items-center gap-2 break-all hover:text-white">
                <MailIcon /> {store.email}
              </a>
            </li>
            <li>
              <a href={store.instagramUrl} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white">
                <InstagramIcon className="h-5 w-5" /> {store.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} {store.name} · {store.owner}
      </div>
    </footer>
  );
}
