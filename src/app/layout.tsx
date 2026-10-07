import type { Metadata } from "next";
import { Dancing_Script, Lora, Nunito } from "next/font/google";
import { store } from "@/lib/store";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });

export const metadata: Metadata = {
  title: { default: `${store.name} | Cestas de presente em Porto Alegre`, template: `%s | ${store.shortName}` },
  description: `${store.tagline}. Cestas de café da manhã, aniversário, maternidade, tábuas de frios e presentes corporativos.`,
};

// O cabeçalho e o rodapé da loja ficam em (loja)/layout.tsx e preview/layout.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${lora.variable} ${nunito.variable} ${dancing.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
