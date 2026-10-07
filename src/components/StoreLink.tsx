"use client";

import Link from "next/link";
import { createContext, useContext } from "react";

// A loja roda em dois endereços: a loja de verdade ("/") e a prévia com
// produtos de exemplo ("/preview"). Os links internos da loja usam este
// prefixo para continuar dentro da versão em que o visitante está.
const BasePathContext = createContext("");

export function BasePathProvider({ basePath, children }: { basePath: string; children: React.ReactNode }) {
  return <BasePathContext.Provider value={basePath}>{children}</BasePathContext.Provider>;
}

export function useStoreHref() {
  const basePath = useContext(BasePathContext);
  return (href: string) => (basePath ? (href === "/" ? basePath : `${basePath}${href}`) : href);
}

export function StoreLink({ href, ...props }: React.ComponentProps<typeof Link> & { href: string }) {
  const toHref = useStoreHref();
  return <Link href={toHref(href)} {...props} />;
}
