"use client";
import { useRef } from "react";
import { process } from "@/content/studio";
import { RevealLines } from "@/components/motion/Reveal";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/motion";

/* pequenos diagramas de prancha para cada etapa, desenhados com traço */
const diagrams = [
  // 01 levantamento: ambiente medido com cotas
  <g key="0">
    <rect x="40" y="30" width="120" height="80" />
    <path d="M40 126 H160 M40 120 V132 M160 120 V132" />
    <path d="M176 30 V110 M170 30 H182 M170 110 H182" />
    <path d="M40 70 H70" strokeDasharray="3 5" />
  </g>,
  // 02 croqui: volumes em perspectiva
  <g key="1">
    <path d="M30 110 L30 70 L110 50 L110 90 Z" />
    <path d="M110 50 L170 64 L170 104 L110 90" />
    <path d="M30 70 L90 84 L170 64" />
    <path d="M60 120 C80 112 120 116 160 122" strokeDasharray="3 5" />
  </g>,
  // 03 planta
  <g key="2">
    <rect x="25" y="30" width="150" height="90" />
    <path d="M25 75 H95 M95 30 V120 M135 75 H175" />
    <path d="M95 60 A15 15 0 0 1 110 75" />
    <path d="M60 30 V22 M140 120 V128" />
  </g>,
  // 04 detalhe: corte de laje e caixilho
  <g key="3">
    <path d="M30 40 H170 V58 H30 Z" />
    <path d="M60 58 V120 M66 58 V120" />
    <path d="M66 70 H120 M66 108 H120" strokeDasharray="2 4" />
    <circle cx="150" cy="90" r="22" />
    <path d="M150 68 V112 M128 90 H172" />
  </g>,
  // 05 obra: andaime/estrutura
  <g key="4">
    <path d="M30 120 H170" />
    <path d="M50 120 V40 M100 120 V40 M150 120 V40" />
    <path d="M50 40 H150 M50 80 H150" />
    <path d="M50 80 L100 40 M100 80 L150 40 M50 120 L100 80 M100 120 L150 80" strokeDasharray="3 4" />
  </g>,
];

/** Processo: uma linha vertical se desenha conforme a rolagem e conduz pelas cinco etapas. */
export function Process() {
  const root = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-progress]", { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: "[data-steps]", start: "top 60%", end: "bottom 60%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
        const paths = step.querySelectorAll<SVGGeometryElement>("path, circle, rect");
        paths.forEach((p) => {
          const len = p.getTotalLength?.() ?? 300;
          gsap.set(p, { strokeDasharray: p.getAttribute("stroke-dasharray") ?? len, strokeDashoffset: p.getAttribute("stroke-dasharray") ? 0 : len });
        });
        const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 72%", once: true } });
        tl.from(step.querySelector("[data-num]"), { yPercent: 60, autoAlpha: 0, duration: 1.4, ease: "expo.out" })
          .from(step.querySelectorAll("[data-text] > *"), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08, ease: "power3.out" }, 0.15)
          .to(Array.from(paths).filter((p) => !p.getAttribute("stroke-dasharray")), { strokeDashoffset: 0, duration: 1.8, stagger: 0.12, ease: "power2.inOut" }, 0.2)
          .to(step.querySelector("[data-dot]"), { scale: 1, backgroundColor: "var(--color-bronze)", duration: 0.6 }, 0);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="processo" data-ambient="stone" className="section wrap scroll-mt-20" aria-labelledby="process-title">
      <div className="grid-12 mb-20 gap-y-8">
        <div className="col-span-12 flex justify-between gap-6 border-t border-[var(--line)] pt-5">
          <p className="label whitespace-nowrap">05 ( processo )</p>
          <p className="label muted hidden text-right sm:block">Cinco etapas</p>
        </div>
        <RevealLines id="process-title" className="display t-xl col-span-12 lg:col-span-9" lines={["Um método", <span key="k1">claro, do <em>briefing</em></span>, "à obra."]} />
      </div>

      <ol data-steps className="relative">
        <span aria-hidden className="absolute bottom-0 left-[0.6875rem] top-0 w-px bg-[var(--line-strong)] md:left-1/2" />
        <span aria-hidden data-progress className="absolute bottom-0 left-[0.6875rem] top-0 w-px origin-top bg-carvao md:left-1/2" />
        {process.map((s, i) => {
          const right = i % 2 === 1;
          return (
            <li key={s.index} data-step className="relative grid grid-cols-12 gap-x-6 pb-24 pl-10 last:pb-0 md:pl-0">
              <span aria-hidden data-dot className="absolute left-[0.375rem] top-6 h-[0.6875rem] w-[0.6875rem] scale-75 rounded-full border border-carvao bg-pedra md:left-[calc(50%-0.3125rem)]" />
              <div className={`col-span-12 md:col-span-5 ${right ? "md:col-start-8 md:order-2" : "md:col-start-1 md:text-right"}`}>
                <p data-num className="display text-[clamp(5rem,13vw,12rem)] leading-[0.8] text-carvao/90 tabular">
                  {s.index}
                </p>
                <div data-text className={`mt-6 grid gap-4 ${right ? "" : "md:justify-items-end"}`}>
                  <h3 className="display t-md">{s.title}</h3>
                  <p className="max-w-[44ch] muted">{s.text}</p>
                  <p className="label">→ {s.output}</p>
                </div>
              </div>
              <div className={`col-span-12 mt-8 md:col-span-4 md:mt-10 ${right ? "md:col-start-2 md:order-1" : "md:col-start-8"}`}>
                <svg viewBox="0 0 200 150" className="w-full max-w-[20rem] text-carvao" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
                  {diagrams[i]}
                </svg>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="label muted mt-16 max-w-[60ch]">
        O acompanhamento de obra é opcional e definido em contrato. Escopo, prazos e honorários são apresentados em proposta específica para cada projeto.
      </p>
    </section>
  );
}
