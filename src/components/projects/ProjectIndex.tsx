"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, projects, secondImage, type Category } from "@/content/projects";
import { getFoco, INTRO_EVENT } from "@/lib/intro";
import { SwapPicture } from "@/components/ui/SwapPicture";
import { TLink } from "@/components/motion/Transition";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

const spans = [
  "lg:col-span-8",
  "lg:col-span-4 lg:mt-[18vh]",
  "lg:col-span-5 lg:col-start-2",
  "lg:col-span-6 lg:col-start-7 lg:mt-[10vh]",
  "lg:col-span-7 lg:col-start-3",
  "lg:col-span-4 lg:col-start-9 lg:-mt-[8vh]",
];
const ratios = ["aspect-[16/10]", "aspect-[4/5]", "aspect-[4/5]", "aspect-[3/2]", "aspect-[16/9]", "aspect-[4/5]"];

/** Índice de projetos com filtros funcionais por categoria e composição assimétrica. */
export function ProjectIndex() {
  const [filter, setFilter] = useState<Category | "Todos">("Todos");
  const list = useMemo(() => (filter === "Todos" ? projects : projects.filter((p) => p.category === filter)), [filter]);
  const grid = useRef<HTMLUListElement>(null);

  // quem escolheu "arquitetura interna" na abertura chega com o filtro de interiores
  useEffect(() => {
    const apply = () => getFoco() === "interiores" && setFilter("Interiores");
    apply();
    window.addEventListener(INTRO_EVENT, apply);
    return () => window.removeEventListener(INTRO_EVENT, apply);
  }, []);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    if (!prefersReducedMotion()) {
      gsap.fromTo(
        el.querySelectorAll("[data-card]"),
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08, ease: "expo.out", clearProps: "transform" },
      );
    }
    ScrollTrigger.refresh();
  }, [filter]);

  const count = (c: Category) => projects.filter((p) => p.category === c).length;

  return (
    <>
      <div className="sticky top-[calc(var(--header-h)-1px)] z-20 -mx-[var(--gutter)] mb-16 border-y border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_96%,transparent)] px-[var(--gutter)]">
        <div className="no-scrollbar flex gap-8 overflow-x-auto py-4" role="group" aria-label="Filtrar por categoria">
          {(["Todos", ...categories] as const).map((c) => {
            const n = c === "Todos" ? projects.length : count(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
                disabled={n === 0}
                className={`label link-draw shrink-0 transition-opacity ${filter === c ? "opacity-100" : "opacity-50 hover:opacity-100"} disabled:opacity-25`}
              >
                {c} <sup className="tabular">{String(n).padStart(2, "0")}</sup>
              </button>
            );
          })}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {list.length} projetos exibidos
      </p>
      <ul ref={grid} className="grid-12 gap-y-20">
        {list.map((p, i) => (
          <li key={p.slug} data-card className={`col-span-12 ${filter === "Todos" ? spans[i % spans.length] : i % 2 ? "lg:col-span-5 lg:col-start-8 lg:mt-[12vh]" : "lg:col-span-6"}`}>
            <TLink href={`/projetos/${p.slug}`} label={p.name} data-cursor="Explorar projeto" className="group block">
              <div className={`media media-zoom ${filter === "Todos" ? ratios[i % ratios.length] : "aspect-[4/5]"}`}>
                <SwapPicture name={p.cover} second={secondImage(p)} alt={`${p.name}: ${p.rooms}`} sizes="(min-width:1024px) 60vw, 100vw" />
              </div>
              <div className="mt-5 grid grid-cols-12 gap-4 border-t border-[var(--line)] pt-4">
                <p className="label muted col-span-2 tabular">{p.index}</p>
                <div className="col-span-10 sm:col-span-7">
                  <h2 className="display t-md transition-colors duration-500 group-hover:text-bronze">{p.name}</h2>
                  <p className="mt-2 text-[0.9375rem] muted">{p.tagline}</p>
                </div>
                <p className="label muted col-span-10 col-start-3 leading-relaxed sm:col-span-3 sm:text-right">
                  {p.category}
                  <br />
                  {p.scope}
                </p>
              </div>
            </TLink>
          </li>
        ))}
      </ul>
    </>
  );
}
