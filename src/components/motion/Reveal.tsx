"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";

type LinesProps = {
  lines: React.ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  /** "scroll" anima ao entrar na tela; "load" anima imediatamente (hero). */
  trigger?: "scroll" | "load";
  id?: string;
};

/** Título com quebras de linha intencionais, revelado linha a linha por máscara. */
export function RevealLines({ lines, as: Tag = "h2", className, delay = 0, stagger = 0.11, trigger = "scroll", id }: LinesProps) {
  const ref = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const inner = el.querySelectorAll<HTMLElement>("[data-line]");
    let offIntro = () => {};
    const ctx = gsap.context(() => {
      gsap.set(inner, { yPercent: 112, rotate: 2.5 });
      const tw = gsap.to(inner, {
        yPercent: 0,
        rotate: 0,
        duration: 1.35,
        ease: "expo.out",
        stagger,
        delay,
        paused: true,
      });
      if (trigger === "load") offIntro = onIntroDone(() => tw.play());
      else {
        ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => tw.play() });
      }
    }, el);
    return () => {
      offIntro();
      ctx.revert();
    };
  }, []);
  return (
    <Tag ref={ref as never} className={className} id={id}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <span data-line className="block origin-left will-change-transform">
            {l}
          </span>
        </span>
      ))}
    </Tag>
  );
}

type FadeProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "p" | "li" | "section" | "span";
  stagger?: number;
};

/** Entrada suave (opacidade + deslocamento). Com `stagger`, anima os filhos diretos em sequência. */
export function FadeIn({ children, className, delay = 0, y = 28, as: Tag = "div", stagger }: FadeProps) {
  const ref = useRef<HTMLElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const targets = stagger ? Array.from(el.children) : [el];
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        autoAlpha: 0,
        y,
        duration: 1.2,
        ease: "power3.out",
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
