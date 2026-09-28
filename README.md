# Afetto Cestas e Tábuas

Loja online da Afetto (Patricia Pesenti): cestas de presente e tábuas para cada ocasião.

Feita com Next.js 16 (App Router), TypeScript e Tailwind CSS 4.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

Para a versão de produção: `npm run build && npm start`.

## Onde fica cada coisa

- `src/lib/store.ts` — nome, WhatsApp, e-mail e Instagram da loja
- `src/data/categories.json` — ocasiões do menu (pronta entrega, aniversário, café da manhã...)
- `src/data/products.json` — produtos de exemplo (preço em centavos)
- `src/lib/catalog.ts` — funções que as páginas usam para ler o catálogo
- `src/components/CartProvider.tsx` — carrinho (salvo no navegador)
- `src/components/CheckoutActions.tsx` — botões de finalizar pedido (hoje: WhatsApp)

Produtos sem `image` mostram uma ilustração na cor da categoria. Para usar fotos, coloque o arquivo em
`public/images/` e preencha `"image": "/images/nome-da-foto.jpg"` no produto.
