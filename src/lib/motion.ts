"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // sem o recálculo automático no "load": ele caía no meio da abertura e engasgava a animação.
  // O recálculo depois do carregamento é feito em SmoothScroll (ou na tela de escolha da abertura).
  ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,resize" });
}

export { gsap, ScrollTrigger };

/** Curvas do sistema de movimento. */
export const ease = {
  arq: "expo.out",
  cine: "power4.inOut",
  soft: "power3.out",
};

/** Executa quando o navegador estiver ocioso (com prazo máximo), para tirar trabalho pesado do caminho das animações. */
export function whenIdle(cb: () => void, timeout = 2000) {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => cb(), { timeout });
  else setTimeout(cb, 200);
}

/**
 * Efeitos presos à rolagem (parallax, máscaras que acompanham o dedo) só com mouse/trackpad.
 * No celular a rolagem nativa corre fora da thread do JavaScript, então esses efeitos ficam
 * sempre um quadro atrás e parecem tremer; lá usamos revelações por tempo.
 */
export function canScrub() {
  if (typeof window === "undefined") return false;
  return !prefersReducedMotion() && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

let lastScroll = 0;
if (typeof window !== "undefined") window.addEventListener("scroll", () => (lastScroll = performance.now()), { passive: true });

/**
 * Como whenIdle, mas também espera a rolagem parar (quiet ms sem rolar).
 * Para trabalho que trava a página por alguns décimos de segundo, como carregar a maquete 3D.
 */
export function whenQuiet(cb: () => void, quiet = 900) {
  let t = 0;
  const check = () => {
    const since = performance.now() - lastScroll;
    if (since < quiet) t = window.setTimeout(check, quiet - since + 50);
    else whenIdle(cb, 1500);
  };
  check();
  return () => clearTimeout(t);
}

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFine(mq.matches);
    const on = () => setFine(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return fine;
}
