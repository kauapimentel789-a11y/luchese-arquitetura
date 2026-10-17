"use client";
import { useRef } from "react";
import type { Project } from "@/content/projects";
import { Picture } from "@/components/ui/Picture";
import { gsap, useIsoLayoutEffect, prefersReducedMotion, canScrub } from "@/lib/motion";

export function ProjectHero({ p }: { p: Project }) {
  const root = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.35 })
        .fromTo(q("[data-img]"), { scale: 1.2 }, { scale: 1, duration: 2.6, ease: "expo.out" })
        .fromTo(q("[data-line]"), { yPercent: 115 }, { yPercent: 0, duration: 1.4, stagger: 0.1, ease: "expo.out" }, 0.2)
        .fromTo(q("[data-fade]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06 }, 0.6);
      if (canScrub()) gsap.to(q("[data-par]"), { yPercent: 16, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);
  const words = p.name.split(" ");
  return (
    <section ref={root} data-hero-overlay data-ambient="dark" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-carvao text-marfim">
      <div data-par className="absolute inset-0">
        <div data-img className="h-full w-full">
          <Picture name={p.cover} alt={`${p.name}: ${p.tagline}`} priority sizes="100vw" className="h-full w-full object-cover" />
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,24,22,.5)_0%,rgba(23,24,22,0)_30%,rgba(23,24,22,.1)_55%,rgba(23,24,22,.85)_100%)]" />
      <div className="wrap relative flex h-full flex-col justify-end pb-[7vh]">
        <p data-fade className="label mb-6 text-pedra">
          {p.index} · {p.category} · Renderização digital
        </p>
        <h1 className="display t-mega">
          {[words.slice(0, -1).join(" "), <em key="l">{words[words.length - 1]}</em>].map((l, i) => (
            <span key={i} className="block overflow-hidden pb-[0.07em] -mb-[0.07em]">
              <span data-line className="block">
                {l}
              </span>
            </span>
          ))}
        </h1>
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/20 pt-5 md:grid-cols-4">
          {[
            ["Ambientes", p.rooms],
            ["Escopo", p.scope],
            ["Categoria", p.category],
            ["Imagens", "Renderizações digitais"],
          ].map(([k, v]) => (
            <div key={k} data-fade>
              <p className="label text-white/55">{k}</p>
              <p className="mt-1">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
