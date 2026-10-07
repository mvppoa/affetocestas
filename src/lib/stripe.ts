import Stripe from "stripe";

// Cliente do Stripe criado só quando usado, para o build não exigir a chave.
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.affetocestas_STRIPE_SECRET_KEY;
    if (!key) throw new Error("affetocestas_STRIPE_SECRET_KEY não está configurada");
    client = new Stripe(key);
  }
  return client;
}

/** Formas de pagamento oferecidas no Checkout (padrão: cartão e Pix). */
export function paymentMethodTypes() {
  const raw = process.env.affetocestas_STRIPE_PAYMENT_METHODS ?? "card,pix";
  return raw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean) as Stripe.Checkout.SessionCreateParams.PaymentMethodType[];
}

/** Endereço público do site, usado nos links de volta do Checkout. */
export function siteUrl(fallbackOrigin: string) {
  return (process.env.affetocestas_SITE_URL || fallbackOrigin).replace(/\/$/, "");
}
