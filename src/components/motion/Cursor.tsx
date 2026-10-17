"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";
import { useFinePointer, useReducedMotion } from "@/lib/motion";

/**
 * Cursor contextual: um ponto discreto que se expande em um disco com rótulo
 * ("Explorar projeto", "Arrastar"...) sobre elementos com `data-cursor`.
 * Só aparece com mouse/trackpad; o cursor do sistema continua disponível.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!fine || reduced || !dot.current) return;
    const el = dot.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(t ? t.dataset.cursor || "" : null);
    };
    const leave = () => setLabel(null);
    window.addEventListener("pointermove", move);
    // o elemento clicado pode sumir (abertura, menu): o rótulo não deve ficar preso
    window.addEventListener("click", leave);
    document.addEventListener("pointerleave", leave);
    gsap.set(el, { autoAlpha: 1 });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("click", leave);
      document.removeEventListener("pointerleave", leave);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  const active = label !== null;
  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[130] opacity-0 mix-blend-normal"
      style={{ transform: "translate(-100px,-100px)" }}
    >
      <div
        className="flex h-[116px] w-[116px] items-center justify-center rounded-full bg-marfim/95 text-carvao transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,.8,.2,1)] will-change-transform"
        // escala em vez de largura/altura: o disco cresce sem recalcular o layout
        style={{ transform: `translate(-50%,-50%) scale(${active ? 1 : 8 / 116})`, opacity: active ? 1 : 0.0 }}
      >
        <span
          className="label px-3 text-center text-[10px] leading-snug transition-opacity duration-300"
          style={{ opacity: active ? 1 : 0, letterSpacing: "0.18em" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
