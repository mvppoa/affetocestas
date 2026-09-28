import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { syncOrderFromSession } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Recebe os avisos do Stripe e atualiza o pedido.
// Cartão: checkout.session.completed já chega pago.
// Pix: completed chega "unpaid" e depois vem async_payment_succeeded (ou _failed).
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook não configurado" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await req.text(), signature, secret);
  } catch (error) {
    console.error("Assinatura do webhook do Stripe inválida", error);
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      await syncOrderFromSession(session.id, session.payment_status === "unpaid" ? "AWAITING_PAYMENT" : "PAID");
      break;
    }
    case "checkout.session.async_payment_succeeded":
      await syncOrderFromSession(event.data.object.id, "PAID");
      break;
    case "checkout.session.async_payment_failed":
      await syncOrderFromSession(event.data.object.id, "FAILED");
      break;
    case "checkout.session.expired":
      await syncOrderFromSession(event.data.object.id, "CANCELED");
      break;
  }

  return NextResponse.json({ received: true });
}
