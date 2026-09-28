import categoriesData from "@/data/categories.json";
import type { Category } from "@/lib/types";

const categories = categoriesData as Category[];

type Props = {
  name: string;
  image?: string;
  categories?: string[];
  className?: string;
};

// Mostra a foto do produto; sem foto, desenha uma ilustração na cor da categoria.
export function ProductImage({ name, image, categories: slugs = [], className = "" }: Props) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name} className={`h-full w-full object-cover ${className}`} />;
  }
  const cat = categories.find((c) => slugs.includes(c.slug)) ?? categories[0];
  return (
    <div
      role="img"
      aria-label={name}
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ background: `radial-gradient(circle at 30% 25%, #fffaf3 0%, ${cat.color}33 45%, ${cat.color}88 100%)` }}
    >
      <BasketArt color={cat.color} emoji={cat.emoji} />
    </div>
  );
}

function BasketArt({ color, emoji }: { color: string; emoji: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-3/4 w-3/4" aria-hidden="true">
      <path d="M50 95c0-35 22-60 50-60s50 25 50 60" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <text x="100" y="98" fontSize="44" textAnchor="middle">{emoji}</text>
      <path d="M28 100h144l-16 70a10 10 0 0 1-10 8H54a10 10 0 0 1-10-8Z" fill={color} />
      <g stroke="#fffaf3" strokeOpacity=".45" strokeWidth="3">
        <path d="M36 124h128M40 146h120" />
        <path d="M70 102l6 74M100 102v74M130 102l-6 74" />
      </g>
      <rect x="22" y="94" width="156" height="12" rx="6" fill={color} stroke="#fffaf3" strokeOpacity=".5" strokeWidth="2" />
    </svg>
  );
}
