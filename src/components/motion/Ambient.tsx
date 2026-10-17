"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Controla a cor de fundo do corpo conforme a seção em foco.
 * Cada seção declara `data-ambient="light|dark|stone"`; a cor anterior se dissolve numa camada fixa (só opacidade).
 */
export function AmbientController() {
  const pathname = usePathname();
  const fade = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main [data-ambient], footer[data-ambient]"));
    const set = (v: string) => {
      const body = document.body;
      if (body.dataset.ambient === v) return;
      const veil = fade.current;
      if (veil && body.dataset.ambient && !prefersReducedMotion()) {
        // a cor anterior cobre a tela e se dissolve enquanto o fundo novo já está por baixo
        veil.style.background = getComputedStyle(body).backgroundColor;
        gsap.fromTo(veil, { opacity: 1 }, { opacity: 0, duration: 0.9, ease: "power3.out", overwrite: true });
      }
      body.dataset.ambient = v;
    };
    set(sections[0]?.dataset.ambient ?? "light");
    const triggers = sections.map((s) =>
      ScrollTrigger.create({
        trigger: s,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && set(s.dataset.ambient!),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [pathname]);
  return <div ref={fade} aria-hidden className="ambient-fade" />;
}
