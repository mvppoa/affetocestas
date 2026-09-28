"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Cestas feitas com afeto",
    text: "Presentes montados à mão para surpreender quem você ama.",
    cta: "Ver pronta entrega",
    href: "/categoria/pronta-entrega",
    bg: "from-terracotta to-[#d99a4e]",
    emoji: "🧺",
  },
  {
    title: "Café da manhã na cama",
    text: "Comece o dia de alguém especial com pães, frutas e muito carinho.",
    cta: "Escolher cesta",
    href: "/categoria/cafe-da-manha",
    bg: "from-[#8a6a4a] to-[#c8a27a]",
    emoji: "☕",
  },
  {
    title: "Tábuas para compartilhar",
    text: "Queijos, frios e petiscos selecionados para reunir as pessoas.",
    cta: "Ver tábuas",
    href: "/categoria/tabuas",
    bg: "from-sage to-[#a9b89c]",
    emoji: "🧀",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden" aria-roledescription="carrossel">
      <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={s.title} className={`w-full shrink-0 bg-gradient-to-br ${s.bg}`} aria-hidden={i !== index}>
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-14 sm:py-20">
              <div className="max-w-lg text-white">
                <h2 className="font-serif text-3xl sm:text-5xl">{s.title}</h2>
                <p className="mt-4 text-lg text-white/90">{s.text}</p>
                <Link
                  href={s.href}
                  tabIndex={i === index ? 0 : -1}
                  className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-cocoa hover:bg-cream"
                >
                  {s.cta}
                </Link>
              </div>
              <span className="hidden text-[9rem] leading-none drop-shadow-lg sm:block" aria-hidden="true">{s.emoji}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setIndex(i)}
            aria-label={`Ir para o banner ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
