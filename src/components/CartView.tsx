"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/store";
import { useCart } from "./CartProvider";
import { CheckoutActions } from "./CheckoutActions";
import { ProductImage } from "./ProductImage";

export function CartView() {
  const { items, subtotal, ready, setQuantity, remove } = useCart();

  if (!ready) return <p className="py-12 text-center text-cocoa/60">Carregando carrinho...</p>;

  if (items.length === 0) {
    return (
      <div className="rounded-3xl bg-white py-16 text-center ring-1 ring-sand">
        <p className="text-5xl" aria-hidden="true">🧺</p>
        <p className="mt-4 text-lg">Seu carrinho está vazio.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-terracotta px-6 py-3 font-semibold text-white hover:bg-terracotta-dark">
          Escolher um presente
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-sand rounded-2xl bg-white ring-1 ring-sand">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 p-4">
            <Link href={`/produto/${item.slug}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <ProductImage name={item.name} image={item.image} />
            </Link>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href={`/produto/${item.slug}`} className="font-serif text-lg hover:text-terracotta">{item.name}</Link>
                <p className="text-sm text-cocoa/70">{formatPrice(item.price)} cada</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-full ring-1 ring-sand">
                  <button className="px-3 py-1" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label={`Diminuir ${item.name}`}>−</button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button className="px-3 py-1" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label={`Aumentar ${item.name}`}>+</button>
                </div>
                <p className="w-24 text-right font-semibold">{formatPrice(item.price * item.quantity)}</p>
                <button onClick={() => remove(item.id)} className="text-sm text-cocoa/50 hover:text-terracotta" aria-label={`Remover ${item.name}`}>
                  Remover
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-sand">
        <h2 className="font-serif text-xl">Resumo</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="font-semibold">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-cocoa/70">
            <dt>Entrega</dt>
            <dd>combinada no pedido</dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-between border-t border-sand pt-4 text-lg font-semibold">
          <span>Total</span>
          <span className="text-terracotta">{formatPrice(subtotal)}</span>
        </div>
        <CheckoutActions />
        <Link href="/" className="mt-4 block text-center text-sm text-cocoa/70 hover:text-terracotta">
          Continuar comprando
        </Link>
      </aside>
    </div>
  );
}
