# Afetto Cestas e Tábuas

Loja online da Afetto (Patricia Pesenti): cestas de presente e tábuas para cada ocasião.

Feita com Next.js 16 (App Router), TypeScript e Tailwind CSS 4.

## Rodar localmente

Precisa de um banco Postgres. Copie `.env.example` para `.env` e preencha.

```bash
npm install
npm run db:migrate   # cria as tabelas
npm run db:seed      # importa as categorias e produtos de exemplo de src/data
npm run dev          # http://localhost:3000
```

Para a versão de produção: `npm run build && npm start`.

## Onde fica cada coisa

- `src/lib/store.ts` — nome, WhatsApp, e-mail e Instagram da loja
- `src/app/admin` — painel de administração (produtos e categorias)
- `prisma/schema` — tabelas do banco (`catalog.prisma`: produtos e categorias)
- `src/data/*.json` — produtos e categorias de exemplo, usados só pelo `npm run db:seed`
- `src/lib/catalog.ts` — funções que as páginas usam para ler o catálogo do banco
- `src/components/CartProvider.tsx` — carrinho (salvo no navegador)
- `src/components/CheckoutActions.tsx` — botões de finalizar pedido (cartão/Pix pelo Stripe ou WhatsApp)
- `src/app/api/checkout` e `src/app/api/webhooks/stripe` — pagamento e confirmação dos pedidos
- `prisma/schema/orders.prisma` — pedidos

## Painel de administração

Acesse `/admin` e entre com a senha de `ADMIN_PASSWORD`. No painel dá para:

- cadastrar, editar, ocultar e excluir produtos (nome, descrição, itens da cesta, preço, preço "de",
  estoque, fotos, categorias, selos como "Pronta entrega" e destaque na página inicial);
- criar e editar as categorias e ocasiões do menu (nome, emoji, cor, descrição e ordem);
- ver os pedidos pagos pelo site em `/admin/pedidos`, com cliente, endereço, data de entrega e mensagem do cartão.

As alterações aparecem na loja na hora. Produtos sem foto mostram uma ilustração na cor da categoria.

## Variáveis de ambiente

| Variável | Para quê |
| --- | --- |
| `DATABASE_URL` | Conexão com o Postgres (Neon, Supabase, Vercel Postgres...) |
| `ADMIN_PASSWORD` | Senha de acesso ao painel `/admin` |
| `ADMIN_SESSION_SECRET` | Texto aleatório de 32+ caracteres para assinar o login (`openssl rand -base64 32`) |
| `affetocestas_STRIPE_SECRET_KEY` | Chave secreta do Stripe (`sk_test_...` para testes) |
| `affetocestas_STRIPE_WEBHOOK_SECRET` | Segredo do webhook do Stripe (`whsec_...`) |
| `affetocestas_STRIPE_PAYMENT_METHODS` | Opcional. Formas de pagamento, padrão `card,pix` |
| `affetocestas_SITE_URL` | Opcional. Endereço público do site, ex.: `https://afetto.com.br` |
| `BLOB_READ_WRITE_TOKEN` | Opcional. Token do Vercel Blob para enviar fotos pelo painel; sem ele, o painel aceita links de fotos |

Na Vercel, o comando `vercel-build` aplica as migrações do banco antes de gerar o site.

## Pagamentos com Stripe

No carrinho, o botão **Pagar com cartão ou Pix** leva o cliente ao Stripe Checkout, em português e em reais.
Lá ele informa o endereço de entrega, telefone, data e horário da entrega e a mensagem do cartão. O botão do
WhatsApp continua disponível.

Como funciona:

1. `POST /api/checkout` confere os preços no banco (nunca confia no navegador), cria o pedido como
   "Aguardando checkout" e abre a sessão do Stripe.
2. O Stripe avisa o site em `POST /api/webhooks/stripe`. Pago no cartão, o pedido vira **Pago** na hora.
   No Pix, fica **Aguardando Pix** (o código vale 1 hora) e vira **Pago** quando o Pix cai.
   Ao ficar pago, o estoque dos produtos é baixado (sem ficar negativo).
3. O pedido aparece em `/admin/pedidos`. Pedidos abandonados ficam escondidos (botão "Mostrar todos").

### Configurar (modo de teste)

1. Crie a conta em https://dashboard.stripe.com e deixe o botão **Modo de teste** ligado.
2. Em **Configurações > Formas de pagamento**, ative **Pix** (exige conta brasileira). Sem Pix, use
   `affetocestas_STRIPE_PAYMENT_METHODS="card"`.
3. Copie a **chave secreta de teste** (`sk_test_...`) de **Desenvolvedores > Chaves de API** para
   `affetocestas_STRIPE_SECRET_KEY`, direto nas variáveis de ambiente da hospedagem. Nunca envie chaves por chat ou e-mail.
4. Em **Desenvolvedores > Webhooks**, adicione o endpoint `https://SEU-SITE/api/webhooks/stripe` com os eventos
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed` e `checkout.session.expired`. Copie o segredo (`whsec_...`) para
   `affetocestas_STRIPE_WEBHOOK_SECRET`.
5. Rode `npm run db:deploy` (ou faça o deploy na Vercel) para criar a tabela de pedidos.

Para testar no computador, com a [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # mostra o whsec_ para o .env
```

Cartão de teste: `4242 4242 4242 4242`, qualquer validade futura e qualquer CVC. No modo de teste, o Pix mostra
um botão para simular o pagamento.

Para vender de verdade, troque as duas variáveis pelas chaves de produção (`sk_live_...` e o `whsec_` de um
webhook criado com o modo de teste desligado).
