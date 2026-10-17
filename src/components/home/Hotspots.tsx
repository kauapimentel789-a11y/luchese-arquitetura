"use client";
import { useEffect, useRef } from "react";

export type Spot = { x: number; y: number; title: string; text: string };

/**
 * Pontos clicáveis sobre a imagem que mostram o material ou a solução de cada parte do ambiente.
 * As posições são em % da imagem; o contêiner pai precisa ter a mesma proporção da imagem.
 * No celular o texto aparece abaixo da imagem (ver Featured), porque a moldura é baixa demais.
 */
export function Hotspots({ spots, open, setOpen }: { spots: Spot[]; open: number | null; setOpen: (i: number | null) => void }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open === null) return;
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(null);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open, setOpen]);

  return (
    <div ref={root} className="absolute inset-0" onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}>
      {spots.map((s, i) => {
        const on = open === i;
        const left = s.x > 55;
        return (
          <div key={s.title} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: on ? 2 : 1 }}>
            <button
              type="button"
              aria-expanded={on}
              aria-controls={`spot-${i}`}
              aria-label={s.title}
              data-cursor="Ver detalhe"
              onClick={() => setOpen(on ? null : i)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
              className="hotspot -translate-x-1/2 -translate-y-1/2"
              data-on={on || undefined}
            >
              <span aria-hidden className="hotspot-ring" />
              <span aria-hidden className="hotspot-plus">+</span>
            </button>
            <div
              id={`spot-${i}`}
              role="note"
              className={`hotspot-card hidden md:block ${left ? "right-6" : "left-6"} ${on ? "is-open" : ""}`}
              aria-hidden={!on}
            >
              <p className="label text-bronze">{String(i + 1).padStart(2, "0")}</p>
              <p className="display mt-2 text-[22px] leading-tight">{s.title}</p>
              <p className="mt-2 text-[14px] text-white/75">{s.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
