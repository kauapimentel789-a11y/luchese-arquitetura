"use client";
import { useEffect } from "react";
import { gsap, useFinePointer, useReducedMotion } from "@/lib/motion";

/** Botões (.btn) puxados levemente pelo cursor. Só com mouse/trackpad. */
export function Magnetic() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fine || reduced) return;
    let active: HTMLElement | null = null;
    let xTo: gsap.QuickToFunc, yTo: gsap.QuickToFunc;
    const release = () => {
      if (!active) return;
      gsap.to(active, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
      active = null;
    };
    const move = (e: PointerEvent) => {
      const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>(".btn");
      if (!btn) return release();
      if (btn !== active) {
        release();
        active = btn;
        xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
        yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
      }
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", release);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", release);
    };
  }, [fine, reduced]);

  return null;
}
