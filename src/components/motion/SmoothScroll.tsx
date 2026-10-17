"use client";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, whenIdle } from "@/lib/motion";
import { introPending } from "@/lib/intro";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Rolagem suave (Lenis) sincronizada com o GSAP. Desligada com prefers-reduced-motion e em telas de toque. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // recalcula as posições depois do carregamento das imagens/fontes, fora da abertura
    const onLoad = () => !introPending() && whenIdle(() => ScrollTrigger.refresh(), 800);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("js");
    // no toque a rolagem nativa já é suave e roda fora do JavaScript: o Lenis só entra com mouse/trackpad
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) {
        setTimeout(() => {
          if (window.__lenis) window.__lenis.scrollTo(el, { offset: -20, immediate: true });
          else el.scrollIntoView();
          ScrollTrigger.refresh();
        }, 60);
        return;
      }
    }
    window.__lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}

export function scrollToTarget(target: string | HTMLElement | number) {
  if (window.__lenis) window.__lenis.scrollTo(target as never, { offset: 0, duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}
