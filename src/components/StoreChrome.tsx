"use client";

import { usePathname } from "next/navigation";

// Esconde cabeçalho, rodapé e botão do WhatsApp da loja dentro do painel /admin.
export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
