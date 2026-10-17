"use client";
import { useRef } from "react";
import { materials } from "@/content/studio";
import { Picture } from "@/components/ui/Picture";
import { RevealLines } from "@/components/motion/Reveal";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/motion";

/**
 * Materialidade. No desktop, a faixa de materiais desliza na horizontal enquanto a página
 * rola na vertical (a seção fica fixa durante o percurso). No celular, vira uma grade simples.
 */
export function Materials() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (hover: hover)", () => {
      const dist = () => tr.scrollWidth - window.innerWidth;
      const tween = gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tr.querySelectorAll<HTMLElement>("[data-mat-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.25 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: img.parentElement!, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
        );
      });
      gsap.fromTo("[data-mat-progress]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => "+=" + dist(), scrub: true } });
      return () => tween.kill();
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-ambient="dark" className="relative overflow-hidden text-marfim" aria-labelledby="mat-title">
      <div className="flex min-h-[100svh] flex-col justify-center py-24 lg:py-0">
        <div ref={track} className="flex flex-col gap-16 wrap lg:w-max lg:flex-row lg:items-center lg:gap-[6vw] lg:pr-[12vw]">
          <div className="lg:w-[34vw] lg:shrink-0">
            <div className="mb-10 flex justify-between gap-6 border-t border-white/15 pt-5">
              <p className="label whitespace-nowrap">06 ( materialidade )</p>
            </div>
            <RevealLines id="mat-title" className="display t-xl" lines={["Matéria,", <span key="k1">luz e <em>textura</em>.</span>]} />
            <p className="mt-8 max-w-[40ch] text-white/70">
              Escolhemos poucos materiais e os deixamos aparentes. A luz embutida revela o veio da madeira, a trama do muxarabi e o desenho da pedra.
            </p>
            <p className="label mt-10 hidden text-mineral lg:block">Continue rolando →</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 lg:flex lg:gap-[3vw]">
            {materials.map((m, i) => (
              <li key={m.name} className={`lg:shrink-0 ${i % 2 ? "lg:mt-[16vh] lg:w-[22vw]" : "lg:-mt-[10vh] lg:w-[26vw]"}`}>
                <figure>
                  <div className="media aspect-[4/5]">
                    <div data-mat-img className="absolute inset-0">
                      <Picture name={m.image} alt={`Detalhe de ${m.name.toLowerCase()}`} sizes="(min-width:1024px) 26vw, 50vw" className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <figcaption className="mt-4 border-t border-white/15 pt-3">
                    <p className="label flex justify-between">
                      <span>{m.name}</span>
                      <span className="text-mineral tabular">{String(i + 1).padStart(2, "0")}</span>
                    </p>
                    <p className="mt-2 text-[15px] text-mineral">{m.note}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden className="wrap absolute inset-x-0 bottom-10 hidden lg:block">
          <div className="h-px bg-white/15">
            <div data-mat-progress className="h-px origin-left bg-bronze-claro" />
          </div>
        </div>
      </div>
    </section>
  );
}
