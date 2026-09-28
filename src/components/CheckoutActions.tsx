"use client";

import { formatPrice, whatsappLink } from "@/lib/store";
import { useCart } from "./CartProvider";
import { WhatsAppIcon } from "./Icons";

// Botões de finalização do pedido. O pagamento online (Stripe) entra aqui.
export function CheckoutActions() {
  const { items, subtotal } = useCart();

  const summary = [
    "Olá! Gostaria de fazer este pedido:",
    ...items.map((i) => `• ${i.quantity}x ${i.name} (${formatPrice(i.price * i.quantity)})`),
    `Total: ${formatPrice(subtotal)}`,
  ].join("\n");

  return (
    <div className="mt-5 space-y-3">
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
