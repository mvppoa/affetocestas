"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { parseBRL, slugify } from "@/lib/format";

export type FormState = { error?: string } | undefined;

function refreshStore() {
  revalidatePath("/", "layout");
}

// ---------- Login ----------

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800));
    return { error: "Senha incorreta." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Produtos ----------

export async function saveProduct(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "") || null;
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = parseBRL(String(formData.get("price") ?? ""));
  const compareRaw = String(formData.get("compareAt") ?? "").trim();
  const compareAtCents = compareRaw ? parseBRL(compareRaw) : null;
  const stock = Number.parseInt(String(formData.get("stock") ?? "0"), 10);
  const items = String(formData.get("items") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const images = formData.getAll("images").map(String).map((s) => s.trim()).filter(Boolean);
  const badges = [
    ...formData.getAll("badges").map(String),
    ...String(formData.get("customBadges") ?? "").split(","),
  ]
    .map((s) => s.trim())
    .filter((s, i, arr) => s && arr.indexOf(s) === i);
  const categoryIds = formData.getAll("categoryIds").map(String);
  const active = formData.get("active") === "on";
  const featured = formData.get("featured") === "on";

  if (!name) return { error: "Informe o nome do produto." };
  if (!slug) return { error: "Informe um endereço (slug) válido." };
  if (priceCents === null || priceCents <= 0) return { error: "Informe um preço válido, ex.: 189,90." };
  if (compareRaw && compareAtCents === null) return { error: "Preço \"de\" inválido." };
  if (!Number.isInteger(stock) || stock < 0) return { error: "Estoque deve ser um número inteiro, 0 ou mais." };

  const data = {
    name,
    slug,
    description,
    priceCents,
    compareAtCents,
    items,
    stock,
    images,
    badges,
    active,
    featured,
  };

  try {
    if (id) {
      await prisma.product.update({
        where: { id },
        data: { ...data, categories: { set: categoryIds.map((cid) => ({ id: cid })) } },
      });
    } else {
      await prisma.product.create({
        data: { ...data, categories: { connect: categoryIds.map((cid) => ({ id: cid })) } },
      });
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: `Já existe um produto com o endereço "${slug}". Escolha outro.` };
    }
    throw e;
  }

  refreshStore();
  redirect("/admin?salvo=1");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.product.delete({ where: { id } });
  refreshStore();
  redirect("/admin?excluido=1");
}

export async function toggleProductActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });
  await prisma.product.update({ where: { id }, data: { active: !product.active } });
  refreshStore();
  revalidatePath("/admin");
}

// ---------- Categorias ----------

export async function saveCategory(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim() || "🎁";
  const colorRaw = String(formData.get("color") ?? "").trim();
  const color = /^#[0-9a-fA-F]{6}$/.test(colorRaw) ? colorRaw : "#b5835a";
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0;
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!name || !slug) return { error: "Informe o nome." };

  try {
    const data = { name, slug, description, emoji, color, sortOrder };
    if (id) await prisma.category.update({ where: { id }, data });
    else await prisma.category.create({ data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: `Já existe uma categoria com o endereço "${slug}".` };
    }
    throw e;
  }
  refreshStore();
  revalidatePath("/admin/categorias");
  return undefined;
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.category.delete({ where: { id } });
  refreshStore();
  revalidatePath("/admin/categorias");
}
