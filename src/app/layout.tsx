import type { Metadata } from "next";
import { Dancing_Script, Lora, Nunito } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { getCategories } from "@/lib/catalog";
import { store } from "@/lib/store";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });

export const metadata: Metadata = {
  title: { default: `${store.name} | Cestas de presente em Porto Alegre`, template: `%s | ${store.shortName}` },
  description: `${store.tagline}. Cestas de café da manhã, aniversário, maternidade, tábuas de frios e presentes corporativos.`,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  return (
    <html lang="pt-BR" className={`${lora.variable} ${nunito.variable} ${dancing.variable}`}>
      <body className="min-h-screen antialiased">
        <CartProvider>
          <Header categories={categories} />
          <main>{children}</main>
          <Footer categories={categories} />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
