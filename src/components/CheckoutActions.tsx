"use client";

import { useState } from "react";
import { formatPrice, whatsappLink } from "@/lib/store";
import { useCart } from "./CartProvider";
import { WhatsAppIcon } from "./Icons";

// Botões de finalização do pedido: pagamento online (Stripe) ou WhatsApp.
export function CheckoutActions() {
  const { items, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = [
    "Olá! Gostaria de fazer este pedido:",
    ...items.map((i) => `• ${i.quantity}x ${i.name} (${formatPrice(i.price * i.quantity)})`),
    `Total: ${formatPrice(subtotal)}`,
  ].join("\n");

  async function payOnline() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ id: i.id, quantity: i.quantity })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Não foi possível iniciar o pagamento.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível iniciar o pagamento.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 space-y-3">
      <button
        type="button"
        onClick={payOnline}
        disabled={loading || items.length === 0}
        className="w-full rounded-full bg-terracotta py-3 font-semibold text-white hover:bg-terracotta-dark disabled:opacity-60"
      >
        {loading ? "Abrindo pagamento..." : "Pagar com cartão ou Pix"}
      </button>
      {error && (
        <p role="alert" className="text-center text-sm text-terracotta">
          {error}
        </p>
      )}
      <a
        href={whatsappLink(summary)}
        target="_blank"
        rel="noopener"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp py-3 font-semibold text-white hover:brightness-95"
      >
        <WhatsAppIcon className="h-5 w-5" /> Finalizar pelo WhatsApp
      </a>
    </div>
  );
}
