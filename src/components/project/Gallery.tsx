"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Picture } from "@/components/ui/Picture";
import { gsap, prefersReducedMotion } from "@/lib/motion";

type Item = { image: string; caption: string };

/**
 * Galeria com controles visíveis, setas do teclado, gesto de arrastar no toque
 * e visualização em tela cheia.
 */
export function Gallery({ items, title }: { items: Item[]; title: string }) {
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const n = items.length;

  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    const el = stage.current;
    if (!el || prefersReducedMotion()) return;
    const cur = el.querySelector<HTMLElement>(`[data-slide="${i}"]`);
    if (cur) gsap.fromTo(cur.querySelector("img"), { scale: 1.08 }, { scale: 1, duration: 1.6, ease: "expo.out" });
  }, [i]);

  useEffect(() => {
    if (!full) return;
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [full, go]);

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => (touch.current = e.touches[0].clientX),
    onTouchEnd: (e: React.TouchEvent) => {
      if (touch.current === null) return;
      const dx = e.changedTouches[0].clientX - touch.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      touch.current = null;
    },
  };

  const slides = (sizes: string, contain = false) =>
    items.map((it, k) => (
      <div
        key={it.image}
        data-slide={k}
        aria-hidden={k !== i}
        className="absolute inset-0 transition-[opacity,clip-path] duration-[1100ms] ease-[cubic-bezier(.76,0,.24,1)]"
        style={{ opacity: k === i ? 1 : 0, clipPath: k === i ? "inset(0 0 0 0)" : k < i ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }}
      >
        <Picture name={it.image} alt={`${title}: ${it.caption}`} sizes={sizes} className={`h-full w-full ${contain ? "object-contain" : "object-cover"}`} />
      </div>
    ));

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label={`Galeria de imagens de ${title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      className="outline-none"
    >
      <div ref={stage} className="media relative aspect-[4/5] w-full sm:aspect-[16/9]" {...swipe}>
        {slides("100vw")}
        <button type="button" onClick={() => setFull(true)} data-cursor="Ampliar" className="absolute inset-0 z-10" aria-label="Abrir imagem em tela cheia" />
      </div>
      <div className="mt-5 flex items-center justify-between gap-6">
        <p className="label min-w-0 truncate" aria-live="polite">
          <span className="tabular">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <span className="muted"> — {items[i].caption}</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => go(-1)} className="btn px-4 py-3" aria-label="Imagem anterior">
            <span>←</span>
          </button>
          <button type="button" onClick={() => go(1)} className="btn px-4 py-3" aria-label="Próxima imagem">
            <span>→</span>
          </button>
        </div>
      </div>
      <div className="mt-4 flex gap-1" aria-hidden>
        {items.map((_, k) => (
          <span key={k} className="h-px flex-1 bg-[var(--line)]">
            <span className="block h-px bg-current transition-transform duration-700 origin-left" style={{ transform: `scaleX(${k <= i ? 1 : 0})` }} />
          </span>
        ))}
      </div>

      {full && (
        <div role="dialog" aria-modal="true" aria-label="Imagem em tela cheia" className="fixed inset-0 z-[70] flex flex-col bg-carvao text-marfim" data-lenis-prevent>
          <div className="wrap flex h-[var(--header-h)] shrink-0 items-center justify-between pt-[env(safe-area-inset-top,0px)]">
            <p className="label tabular">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} — {items[i].caption}
            </p>
            <button type="button" autoFocus onClick={() => setFull(false)} className="label link-draw">
              Fechar ×
            </button>
          </div>
          <div className="relative flex-1" {...swipe}>
            {slides("100vw", true)}
          </div>
          <div className="wrap flex shrink-0 justify-center gap-2 py-5 pb-[max(20px,env(safe-area-inset-bottom,0px))]">
            <button type="button" onClick={() => go(-1)} className="btn btn-light px-5 py-3" aria-label="Imagem anterior">
              <span>←</span>
            </button>
            <button type="button" onClick={() => go(1)} className="btn btn-light px-5 py-3" aria-label="Próxima imagem">
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
