import { HomeView } from "@/components/pages/HomeView";
import * as catalog from "@/lib/sample-catalog";

export default function Home() {
  return <HomeView catalog={catalog} />;
}
