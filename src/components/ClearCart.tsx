"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

// Esvazia o carrinho depois que o cliente volta do pagamento.
export function ClearCart() {
  const { ready, clear } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
