import type { Metadata } from "next";
import { SearchView } from "@/components/pages/SearchView";
import * as catalog from "@/lib/catalog";

export const metadata: Metadata = { title: "Busca" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  return <SearchView catalog={catalog} q={(await searchParams).q ?? ""} />;
}
