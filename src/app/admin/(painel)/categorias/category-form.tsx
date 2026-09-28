"use client";

import { useActionState, useEffect, useRef } from "react";
import type { Category } from "@prisma/client";
import { saveCategory } from "../../actions";

export default function CategoryForm({ category }: { category?: Category }) {
  const [state, action, pending] = useActionState(saveCategory, undefined);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state?.error && !category) ref.current?.reset();
  }, [pending, state, category]);

  return (
    <form ref={ref} action={action} className="grid gap-3 sm:grid-cols-[4rem_1fr_4rem_5rem_auto] sm:items-end">
      {category && <input type="hidden" name="id" value={category.id} />}
      <label className="block">
        <span className="text-xs text-stone-500">Emoji</span>
        <input name="emoji" defaultValue={category?.emoji ?? "🎁"} className="admin-input text-center" />
      </label>
      <label className="block">
        <span className="text-xs text-stone-500">Nome</span>
        <input name="name" required defaultValue={category?.name} className="admin-input" />
      </label>
      <label className="block">
        <span className="text-xs text-stone-500">Cor</span>
        <input name="color" type="color" defaultValue={category?.color ?? "#b5835a"} className="h-9 w-full cursor-pointer rounded-lg border border-stone-300 bg-white" />
      </label>
      <label className="block">
        <span className="text-xs text-stone-500">Ordem</span>
        <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className="admin-input" />
      </label>
      <button type="submit" disabled={pending} className="admin-btn-secondary">
        {pending ? "Salvando..." : category ? "Salvar" : "Adicionar"}
      </button>
      <label className="block sm:col-span-5">
        <span className="text-xs text-stone-500">Descrição (aparece no topo da página da categoria)</span>
        <input name="description" defaultValue={category?.description} className="admin-input" />
      </label>
      {state?.error && <p className="text-sm text-red-600 sm:col-span-5">{state.error}</p>}
    </form>
  );
}
