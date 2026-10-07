import { StoreShell } from "@/components/StoreShell";
import { getCategories } from "@/lib/catalog";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  return <StoreShell categories={await getCategories()}>{children}</StoreShell>;
}
