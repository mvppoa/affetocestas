import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/ClearCart";
import { formatPrice, store, whatsappLink } from "@/lib/store";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Pedido recebido" };
export const dynamic = "force-dynamic";

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = session_id?.startsWith("cs_")
    ? await getStripe().checkout.sessions.retrieve(session_id).catch(() => null)
    : null;

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl">Pedido não encontrado</h1>
        <p className="mt-4 text-cocoa/70">Se você já pagou, fale com a gente pelo WhatsApp que confirmamos na hora.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-terracotta px-6 py-3 font-semibold text-white hover:bg-terracotta-dark">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const paid = session.payment_status !== "unpaid";
  const name = session.customer_details?.name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <ClearCart />
      <p className="text-5xl" aria-hidden="true">{paid ? "💝" : "⏳"}</p>
      <h1 className="mt-4 font-serif text-3xl">
        {paid ? `Obrigada${name ? `, ${name}` : ""}! Pedido confirmado.` : "Pedido recebido, aguardando o Pix"}
      </h1>
      <p className="mt-4 text-cocoa/80">
        {paid
          ? `Recebemos o pagamento de ${formatPrice(session.amount_total ?? 0)}. Vamos preparar tudo com muito carinho e entrar em contato para combinar a entrega.`
          : "Assim que o Pix for pago, o pedido é confirmado automaticamente e você recebe o comprovante por e-mail."}
      </p>
      {session.customer_details?.email && (
        <p className="mt-2 text-sm text-cocoa/60">O comprovante vai para {session.customer_details.email}.</p>
      )}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/" className="rounded-full bg-terracotta px-6 py-3 font-semibold text-white hover:bg-terracotta-dark">
          Voltar para a loja
        </Link>
        <a href={whatsappLink("Olá! Acabei de fazer um pedido pelo site.")} target="_blank" rel="noopener" className="rounded-full px-6 py-3 font-semibold ring-1 ring-sand hover:text-terracotta">
          Falar com a {store.shortName}
        </a>
      </div>
    </div>
  );
}
