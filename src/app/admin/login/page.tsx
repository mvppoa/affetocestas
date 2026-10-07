import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./login-form";

export const metadata = { title: "Entrar | Painel Afetto", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <h1 className="text-xl font-semibold text-stone-800">Painel Afetto</h1>
        <p className="mt-1 text-sm text-stone-500">Entre com a senha de administradora.</p>
        <LoginForm />
      </div>
    </main>
  );
}
