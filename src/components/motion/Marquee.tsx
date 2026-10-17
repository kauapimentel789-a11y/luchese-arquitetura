"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, canScrub, prefersReducedMotion } from "@/lib/motion";

/**
 * Faixa de texto em movimento contínuo. Com mouse, acelera e muda de sentido conforme a rolagem,
 * e inclina de leve com a velocidade. Só anima enquanto está na tela.
 */
export function Marquee({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    const setX = gsap.quickSetter(el, "xPercent");
    const skewTo = gsap.quickTo(el, "skewX", { duration: 0.6, ease: "power3.out" });
    const wrap = gsap.utils.wrap(-50, 0);
    const scrub = canScrub();
    let x = 0;
    let dir = -1;
    let boost = 0;
    const st = ScrollTrigger.create({
      trigger: el.parentElement!,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => {
        if (!scrub) return;
        const v = s.getVelocity();
        if (Math.abs(v) > 30) dir = v > 0 ? -1 : 1;
        boost = Math.min(Math.abs(v) / 250, 10);
        skewTo(gsap.utils.clamp(-7, 7, -v / 350));
      },
    });
    // uma cópia do texto a cada ~45 s em repouso
    const tick = (_t: number, dt: number) => {
      if (!st.isActive) return;
      x = wrap(x + dir * (1 + boost) * 0.0011 * dt);
      setX(x);
      boost *= 0.93;
      if (boost < 0.05) skewTo(0);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  const copy = (k: number) => (
    <div key={k} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={t} className="display t-xl flex items-center whitespace-nowrap">
          <span className="px-[2.2vw]">{i % 2 ? <em>{t}</em> : t}</span>
          <span className="text-bronze text-[0.5em]">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <section data-ambient="light" aria-hidden className="overflow-hidden border-y border-[var(--line)] py-[5vh]">
      <div ref={track} className="flex w-max will-change-transform">
        {copy(0)}
        {copy(1)}
      </div>
    </section>
  );
}
