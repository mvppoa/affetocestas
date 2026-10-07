import type { Metadata } from "next";
import { StoreShell } from "@/components/StoreShell";
import { getCategories } from "@/lib/sample-catalog";

// Prévia da loja como na primeira versão: 15 produtos de exemplo, sem banco de dados.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreShell
      categories={await getCategories()}
      basePath="/preview"
      cartKey="afetto-cart-preview"
      banner={
        <p className="bg-sage px-4 py-1.5 text-center text-xs font-semibold text-white sm:text-sm">
          Prévia da loja com produtos de exemplo
        </p>
      }
    >
      {children}
    </StoreShell>
  );
}
