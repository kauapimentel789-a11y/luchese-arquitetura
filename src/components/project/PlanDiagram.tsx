"use client";
import { useRef } from "react";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/motion";

/* Plantas esquemáticas ilustrativas (não são desenhos técnicos). Unidades em metros, origem no canto. */
type Room = { x: number; y: number; w: number; h: number; label?: string; kind?: "wall" | "glass" | "water" | "deck" | "solid" | "room" | "outline" };
const plans: Record<string, { w: number; h: number; title: string; items: Room[] }> = {
  mirante: {
    w: 32,
    h: 19,
    title: "Pavimento térreo",
    items: [
      { x: 0, y: 0, w: 28, h: 12.6, kind: "room" },
      { x: 6, y: 0, w: 18, h: 9.4, kind: "room", label: "Estar · Jantar · Cozinha" },
      { x: 21.6, y: 0.5, w: 2.4, h: 8.3, kind: "solid" },
      { x: 6, y: 0.5, w: 15.6, h: 0.5, kind: "solid" },
      { x: 6.4, y: 8.78, w: 15.2, h: 0.06, kind: "glass" },
      { x: 2, y: 0.5, w: 23, h: 9.9, kind: "outline" },
      { x: 2, y: 12.6, w: 16, h: 5.6, kind: "water", label: "Piscina" },
      { x: 18.3, y: 12.6, w: 9.7, h: 5.8, kind: "deck", label: "Deck" },
      { x: 25, y: 4, w: 6, h: 8.4, kind: "deck", label: "Pérgola" },
    ],
  },
  patio: {
    w: 24,
    h: 16,
    title: "Planta esquemática",
    items: [
      { x: 1, y: 1, w: 22, h: 14, kind: "room" },
      { x: 1, y: 1, w: 13, h: 8, kind: "room", label: "Estar · Jantar" },
      { x: 14, y: 1, w: 9, h: 8, kind: "room", label: "Cozinha" },
      { x: 1, y: 9, w: 22, h: 6, kind: "deck", label: "Jardim" },
      { x: 1, y: 8.9, w: 22, h: 0.08, kind: "glass" },
    ],
  },
  pavilion: {
    w: 28,
    h: 18,
    title: "Planta esquemática",
    items: [
      { x: 1, y: 1, w: 26, h: 16, kind: "water", label: "" },
      { x: 3, y: 3, w: 24, h: 13, kind: "deck", label: "" },
      { x: 7, y: 5, w: 17, h: 8.5, kind: "room", label: "Salão" },
      { x: 7, y: 13.4, w: 17, h: 0.08, kind: "glass" },
      { x: 12, y: 16, w: 6, h: 1.2, kind: "deck", label: "Degraus" },
    ],
  },
};

export function PlanDiagram({ type }: { type: keyof typeof plans }) {
  const ref = useRef<SVGSVGElement>(null);
  const p = plans[type];
  const S = 30;
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const shapes = Array.from(el.querySelectorAll<SVGRectElement>("[data-draw]")).filter((s) => !s.getAttribute("stroke-dasharray"));
    const ctx = gsap.context(() => {
      shapes.forEach((s) => {
        const len = s.getTotalLength();
        gsap.set(s, { strokeDasharray: len, strokeDashoffset: len });
      });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } });
      tl.to(shapes, { strokeDashoffset: 0, duration: 2.2, stagger: 0.12, ease: "power2.inOut" }).from(
        el.querySelectorAll("[data-fill], text, [stroke-dasharray]"),
        { autoAlpha: 0, duration: 1, stagger: 0.05 },
        "-=1",
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const fill = (k?: string) =>
    k === "water" ? "rgba(111,133,132,.28)" : k === "deck" ? "rgba(154,128,97,.14)" : k === "solid" ? "rgba(154,128,97,.55)" : "none";

  return (
    <figure>
      <svg ref={ref} viewBox={`-20 -20 ${p.w * S + 60} ${p.h * S + 90}`} className="w-full text-current" role="img" aria-label={`${p.title} esquemática`}>
        {p.items.map((r, k) => (
          <g key={k}>
            {r.kind !== "glass" && <rect data-fill x={r.x * S} y={r.y * S} width={r.w * S} height={r.h * S} fill={fill(r.kind)} />}
            <rect
              data-draw
              x={r.x * S}
              y={r.y * S}
              width={r.w * S}
              height={r.h * S}
              fill="none"
              stroke={r.kind === "glass" ? "var(--color-bronze)" : "currentColor"}
              strokeWidth={r.kind === "room" && k === 0 ? 2 : 1}
              strokeDasharray={r.kind === "deck" ? "4 4" : r.kind === "outline" ? "10 6" : undefined}
              opacity={r.kind === "outline" ? 0.45 : 1}
            />
            {r.label && (
              <text x={(r.x + r.w / 2) * S} y={(r.y + r.h / 2) * S} textAnchor="middle" dominantBaseline="middle" fill="currentColor" style={{ font: "400 13px var(--font-sans)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                {r.label.toUpperCase()}
              </text>
            )}
          </g>
        ))}
        {/* norte e escala */}
        <g transform={`translate(${p.w * S - 10}, ${p.h * S + 30})`} fill="none" stroke="currentColor">
          <circle r="14" />
          <path d="M0 -12 L5 6 L0 2 L-5 6 Z" fill="currentColor" />
        </g>
        <g transform={`translate(0, ${p.h * S + 34})`} stroke="currentColor">
          <path d={`M0 0 H${5 * S} M0 -5 V5 M${5 * S} -5 V5 M${2.5 * S} -3 V3`} />
          <text x={5 * S + 12} y="4" fill="currentColor" stroke="none" style={{ font: "400 12px var(--font-sans)", letterSpacing: "0.18em" }}>
            5 M
          </text>
        </g>
      </svg>
      <figcaption className="mt-4 flex flex-wrap justify-between gap-3 border-t border-[var(--line)] pt-3">
        <span className="label">{p.title}{type === "mirante" ? " · tracejado: projeção do volume superior" : ""}</span>
        <span className="label muted">Diagrama ilustrativo, sem escala técnica</span>
      </figcaption>
    </figure>
  );
}
