import type { Category } from "@/lib/types";
import { CartProvider } from "./CartProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { BasePathProvider } from "./StoreLink";
import { WhatsAppFloat } from "./WhatsAppFloat";

// Cabeçalho, rodapé e carrinho da loja, usados pela loja e pela prévia.
export function StoreShell({
  categories,
  basePath = "",
  cartKey,
  banner,
  children,
}: {
  categories: Category[];
  basePath?: string;
  cartKey?: string;
  banner?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <BasePathProvider basePath={basePath}>
      <CartProvider storageKey={cartKey}>
        {banner}
        <Header categories={categories} />
        <main>{children}</main>
        <Footer categories={categories} />
        <WhatsAppFloat />
      </CartProvider>
    </BasePathProvider>
  );
}
