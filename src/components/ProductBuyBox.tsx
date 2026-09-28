"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice, whatsappLink } from "@/lib/store";
import { useCart } from "./CartProvider";
import { WhatsAppIcon } from "./Icons";

export function ProductBuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-sand">
      <p className="text-3xl font-semibold text-terracotta">{formatPrice(product.price)}</p>

      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm font-medium">Quantidade</span>
        <div className="flex items-center rounded-full ring-1 ring-sand">
          <button className="px-3 py-1.5 text-lg" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">−</button>
          <span className="w-8 text-center" aria-live="polite">{quantity}</span>
          <button className="px-3 py-1.5 text-lg" onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar quantidade">+</button>
        </div>
      </div>

      <button
        onClick={() => {
          add(product, quantity);
          setAdded(true);
        }}
        className="mt-5 w-full rounded-full bg-terracotta py-3 font-semibold text-white hover:bg-terracotta-dark"
      >
        Adicionar ao carrinho
      </button>
      {added && (
        <p className="mt-3 text-center text-sm text-sage">
          Adicionado! <Link href="/carrinho" className="font-semibold underline">Ver carrinho</Link>
        </p>
      )}

      <a
        href={whatsappLink(`Olá! Tenho interesse na ${product.name} (${formatPrice(product.price)}).`)}
        target="_blank"
        rel="noopener"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-whatsapp py-2.5 font-semibold text-[#128c4a] hover:bg-whatsapp/10"
      >
        <WhatsAppIcon className="h-5 w-5" /> Encomendar pelo WhatsApp
      </a>
    </div>
  );
}
