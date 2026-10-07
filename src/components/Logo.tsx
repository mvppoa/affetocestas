import { StoreLink } from "./StoreLink";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <StoreLink href="/" className="inline-flex flex-col items-center leading-none" aria-label="Afetto Cestas e Tábuas, página inicial">
      <span className={`font-script text-4xl sm:text-5xl ${light ? "text-cream" : "text-terracotta"}`}>Afetto</span>
      <span className={`mt-1 text-[0.65rem] uppercase tracking-[0.35em] ${light ? "text-cream/80" : "text-cocoa/70"}`}>
        cestas e tábuas
      </span>
    </StoreLink>
  );
}
