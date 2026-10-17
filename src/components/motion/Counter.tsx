"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/motion";

/** Contador animado ao entrar na tela. Só é usado quando há um valor real informado. */
export function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => prefix + Math.round(n).toLocaleString("pt-BR") + suffix;
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { n: 0 };
    el.textContent = fmt(0);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () =>
        gsap.to(obj, { n: value, duration: 2.4, ease: "expo.out", onUpdate: () => (el.textContent = fmt(obj.n)) }),
    });
    return () => st.kill();
  }, [value]);
  return (
    <span ref={ref} className="tabular">
      {fmt(value)}
    </span>
  );
}
