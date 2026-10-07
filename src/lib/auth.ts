import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "afetto_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("ADMIN_SESSION_SECRET precisa ter pelo menos 32 caracteres");
  return new TextEncoder().encode(s);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Use no início de toda página e server action do admin. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
