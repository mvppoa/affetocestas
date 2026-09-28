"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

type Props = { product: Product; quantity?: number; className?: string };

export function AddToCartButton({ product, quantity = 1, className = "" }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        add(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
      className={`rounded-full px-4 py-2.5 text-sm font-semibold text-white transition ${
        added ? "bg-sage" : "bg-terracotta hover:bg-terracotta-dark"
      } ${className}`}
    >
      {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
    </button>
  );
}
