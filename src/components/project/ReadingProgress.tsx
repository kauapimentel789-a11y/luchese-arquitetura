"use client";
import { useEffect, useRef } from "react";

/** Indicador de progresso de leitura das páginas de projeto (linha fina no topo + porcentagem). */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (num.current) num.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-[55] h-[2px]">
        <div ref={bar} className="h-full origin-left bg-bronze" style={{ transform: "scaleX(0)" }} />
      </div>
      <div aria-hidden className="label fixed bottom-6 right-[var(--gutter)] z-40 hidden mix-blend-difference text-white md:block">
        <span ref={num} className="tabular">00</span>%
      </div>
    </>
  );
}
