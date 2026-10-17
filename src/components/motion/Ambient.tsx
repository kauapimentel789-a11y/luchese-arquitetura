"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/motion";

/**
 * Controla a cor de fundo do corpo conforme a seção em foco.
 * Cada seção declara `data-ambient="light|dark|stone"`; a transição é feita em CSS.
 */
export function AmbientController() {
  const pathname = usePathname();
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main [data-ambient], footer[data-ambient]"));
    const set = (v: string) => {
      document.body.dataset.ambient = v;
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
  return null;
}
