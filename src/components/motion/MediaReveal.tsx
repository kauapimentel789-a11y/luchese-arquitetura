"use client";
import { useRef } from "react";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Direção de abertura da máscara. */
  from?: "bottom" | "top" | "left" | "right" | "center";
  /** Parallax interno da imagem (0 = sem). */
  parallax?: number;
  /** Escala inicial da imagem durante a revelação. */
  scale?: number;
  style?: React.CSSProperties;
  delay?: number;
};

const clips = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  center: "inset(18% 18% 18% 18%)",
};

/**
 * Moldura de imagem com revelação por máscara, zoom de entrada e parallax interno.
 * A imagem fica visível sem JavaScript; as animações só são aplicadas no cliente.
 */
export function MediaReveal({ children, className = "", from = "bottom", parallax = 8, scale = 1.25, style, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const inner = el.querySelector<HTMLElement>("[data-media-inner]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 86%", once: true }, delay });
      tl.fromTo(el, { clipPath: clips[from] }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" });
      if (inner) tl.fromTo(inner, { scale }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0.1);
      if (inner && parallax) {
        gsap.fromTo(
          inner,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className={`media ${className}`} style={style}>
      <div data-media-inner className="absolute inset-[-9%_0] will-change-transform [&>img]:h-full [&>img]:w-full [&>img]:object-cover">
        {children}
      </div>
    </div>
  );
}

/** Desloca um elemento em velocidade diferente da rolagem. */
export function Parallax({ children, speed = 10, className }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: speed },
        { yPercent: -speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
