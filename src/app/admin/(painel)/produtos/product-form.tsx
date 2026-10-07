"use client";

import { useActionState, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { Category, Product } from "@prisma/client";
import { saveProduct } from "../../actions";
import { slugify } from "@/lib/format";

const PRESET_BADGES = ["Pronta entrega", "Mais vendido", "Novidade", "Personalizável", "Sob encomenda"];

function centsToInput(cents: number | null | undefined) {
  return cents == null ? "" : (cents / 100).toFixed(2).replace(".", ",");
}

export default function ProductForm({
  product,
  categories,
  uploadsEnabled,
}: {
  product?: Product & { categories: { id: string }[] };
  categories: Category[];
  uploadsEnabled: boolean;
}) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [newUrl, setNewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const selectedCats = new Set(product?.categories.map((c) => c.id));
  const customBadges = (product?.badges ?? []).filter((b) => !PRESET_BADGES.includes(b));

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of Array.from(files)) {
        const blob = await upload(`produtos/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        });
        setImages((prev) => [...prev, blob.url]);
      }
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Falha no envio da foto.");
    } finally {
      setUploading(false);
    }
  }

  function move(i: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <form action={action} className="mt-6 space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      {images.map((url) => (
        <input key={url} type="hidden" name="images" value={url} />
      ))}

      <section className="admin-card space-y-4">
        <label className="block">
          <span className="admin-label">Nome</span>
          <input
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className="admin-input"
            placeholder="Cesta Café da Manhã Especial"
          />
        </label>
        <label className="block">
          <span className="admin-label">Endereço na loja</span>
          <div className="flex items-center gap-1 text-sm text-stone-500">
            <span>/produto/</span>
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="admin-input"
            />
          </div>
        </label>
        <label className="block">
          <span className="admin-label">Descrição</span>
          <textarea
            name="description"
            rows={6}
            defaultValue={product?.description}
            className="admin-input"
            placeholder="Conte como é a cesta, para quem é, tamanho..."
          />
        </label>
        <label className="block">
          <span className="admin-label">O que vem na cesta</span>
          <textarea
            name="items"
            rows={6}
            defaultValue={product?.items.join("\n")}
            className="admin-input"
            placeholder={"Um item por linha, ex.:\nPão de fermentação natural\nSuco natural 300 ml"}
          />
        </label>
      </section>

      <section className="admin-card grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="admin-label">Preço (R$)</span>
          <input name="price" required inputMode="decimal" defaultValue={centsToInput(product?.priceCents)} className="admin-input" placeholder="189,90" />
        </label>
        <label className="block">
          <span className="admin-label">Preço &quot;de&quot; (opcional)</span>
          <input name="compareAt" inputMode="decimal" defaultValue={centsToInput(product?.compareAtCents)} className="admin-input" placeholder="219,90" />
        </label>
        <label className="block">
          <span className="admin-label">Estoque</span>
          <input name="stock" type="number" min={0} step={1} required defaultValue={product?.stock ?? 0} className="admin-input" />
        </label>
      </section>

      <section className="admin-card">
        <h2 className="admin-label">Fotos</h2>
        <p className="text-xs text-stone-500">A primeira foto é a capa do produto.</p>
        {images.length > 0 && (
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((url, i) => (
              <li key={url} className="relative overflow-hidden rounded-lg ring-1 ring-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="aspect-square w-full object-cover" />
                {i === 0 && <span className="absolute left-1 top-1 rounded bg-white/90 px-1.5 text-xs">Capa</span>}
                <div className="flex justify-between bg-white px-2 py-1 text-sm">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Mover para a esquerda">←</button>
                  <button type="button" onClick={() => setImages((p) => p.filter((u) => u !== url))} className="text-red-600">Remover</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Mover para a direita">→</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {uploadsEnabled ? (
            <label className="admin-btn-secondary cursor-pointer">
              {uploading ? "Enviando..." : "Enviar fotos"}
              <input type="file" accept="image/*" multiple hidden disabled={uploading} onChange={(e) => onFiles(e.target.files)} />
            </label>
          ) : (
            <span className="text-xs text-stone-500">Envio de arquivos desativado (falta affetocestas_BLOB_READ_WRITE_TOKEN). Cole o link da foto:</span>
          )}
          <div className="flex flex-1 gap-2">
            <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://... (link de uma foto)" className="admin-input" />
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => {
                const u = newUrl.trim();
                if (/^https?:\/\//.test(u) && !images.includes(u)) setImages((p) => [...p, u]);
                setNewUrl("");
              }}
            >
              Adicionar
            </button>
          </div>
        </div>
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
      </section>

      <section className="admin-card space-y-4">
        <fieldset>
          <legend className="admin-label">Categorias e ocasiões</legend>
          {categories.length === 0 ? (
            <p className="text-sm text-stone-500">Nenhuma cadastrada. Crie em &quot;Categorias&quot;.</p>
          ) : (
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="categoryIds" value={c.id} defaultChecked={selectedCats.has(c.id)} />
                  {c.emoji} {c.name}
                </label>
              ))}
            </div>
          )}
        </fieldset>
        <fieldset>
          <legend className="admin-label">Selos</legend>
          <div className="flex flex-wrap gap-3">
            {PRESET_BADGES.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="badges" value={b} defaultChecked={product?.badges.includes(b)} />
                {b}
              </label>
            ))}
          </div>
          <input
            name="customBadges"
            defaultValue={customBadges.join(", ")}
            placeholder="Outros selos, separados por vírgula"
            className="admin-input mt-2"
          />
        </fieldset>
      </section>

      <section className="admin-card flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
          Visível na loja
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} />
          Destaque na página inicial
        </label>
      </section>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={pending || uploading} className="admin-btn-primary">
          {pending ? "Salvando..." : "Salvar produto"}
        </button>
      </div>
    </form>
  );
}
