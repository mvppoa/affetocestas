export const store = {
  name: "Afetto Cestas e Tábuas",
  shortName: "Afetto",
  tagline: "Cestas e tábuas feitas com carinho para cada momento especial",
  owner: "Patricia Pesenti",
  phoneDisplay: "(51) 9197-4031",
  whatsappNumber: "555191974031",
  email: "patriciapesenti@hotmail.com",
  instagramHandle: "@afetto_cestasetabuas",
  instagramUrl: "https://www.instagram.com/afetto_cestasetabuas",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${store.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Link de WhatsApp para um telefone de cliente (ex.: +5551999998888). */
export function whatsappLinkTo(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
