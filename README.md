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
- `src/components/CheckoutActions.tsx` — botões de finalizar pedido (hoje: WhatsApp)

## Painel de administração

Acesse `/admin` e entre com a senha de `affetocestas_ADMIN_PASSWORD`. No painel dá para:

- cadastrar, editar, ocultar e excluir produtos (nome, descrição, itens da cesta, preço, preço "de",
  estoque, fotos, categorias, selos como "Pronta entrega" e destaque na página inicial);
- criar e editar as categorias e ocasiões do menu (nome, emoji, cor, descrição e ordem).

As alterações aparecem na loja na hora. Produtos sem foto mostram uma ilustração na cor da categoria.

## Variáveis de ambiente

| Variável | Para quê |
| --- | --- |
| `affetocestas_POSTGRES_URL` | Conexão com o Postgres usada pelo site (criada pela integração Neon da Vercel) |
| `affetocestas_POSTGRES_URL_NON_POOLING` | Conexão direta com o Postgres, usada para aplicar as migrações (também criada pelo Neon) |
| `affetocestas_ADMIN_PASSWORD` | Senha de acesso ao painel `/admin` |
| `affetocestas_ADMIN_SESSION_SECRET` | Texto aleatório de 32+ caracteres para assinar o login (`openssl rand -base64 32`) |
| `affetocestas_BLOB_READ_WRITE_TOKEN` | Opcional. Token do Vercel Blob para enviar fotos pelo painel; sem ele, o painel aceita links de fotos |

Todas as variáveis usam o prefixo `affetocestas_`, o mesmo que a integração Neon da Vercel cria. Na Vercel, o comando `vercel-build` aplica as migrações do banco antes de gerar o site.
