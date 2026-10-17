"use client";
import { useRef } from "react";
import { featured } from "@/content/projects";
import { Picture } from "@/components/ui/Picture";
import { TLink } from "@/components/motion/Transition";
import { RevealLines } from "@/components/motion/Reveal";
import { gsap, useIsoLayoutEffect, prefersReducedMotion, canScrub } from "@/lib/motion";

/** Projeto em destaque: a imagem se expande até ocupar a largura da tela, como uma obra exposta. */
export function Featured() {
  const frame = useRef<HTMLDivElement>(null);
  const p = featured;
  useIsoLayoutEffect(() => {
    const el = frame.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      if (!canScrub()) {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } })
          .fromTo(el, { clipPath: "inset(0% 9% 0% 9%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" })
          .fromTo(el.querySelector("[data-img]"), { scale: 1.18 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0);
        return;
      }
      gsap.fromTo(el, { clipPath: "inset(0% 9% 0% 9%)" }, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 90%", end: "top 15%", scrub: true },
      });
      gsap.fromTo(el.querySelector("[data-img]"), { scale: 1.18, yPercent: -6 }, {
        scale: 1,
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section data-ambient="dark" className="section text-marfim" aria-labelledby="featured-title">
      <div className="wrap mb-14 grid-12 items-end gap-y-8">
        <div className="col-span-12 flex justify-between gap-6 border-t border-white/15 pt-5">
          <p className="label whitespace-nowrap">02 ( projeto em destaque )</p>
          <p className="label text-mineral hidden text-right sm:block">{p.category} · Renderização digital</p>
        </div>
        <RevealLines id="featured-title" as="h2" className="display t-xl col-span-12 lg:col-span-8" lines={[p.name.split(" ").slice(0, -1).join(" "), <em key="m">{p.name.split(" ").slice(-1)[0]}</em>]} />
        <p className="lead col-span-12 text-white/75 lg:col-span-4">{p.tagline}</p>
      </div>

      <TLink href={`/projetos/${p.slug}`} label={p.name} data-cursor="Explorar projeto" className="group block" aria-label={`Ver o projeto ${p.name}`}>
        <div ref={frame} className="media h-[78svh] min-h-[440px] w-full">
          <div data-img className="absolute inset-0">
            <Picture name="living-4" alt="Cristaleira iluminada e escada da Casa Muxarabi" sizes="100vw" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,.8,.2,1)] group-hover:scale-[1.03]" />
          </div>
        </div>
      </TLink>

      <div className="wrap mt-8 grid grid-cols-2 gap-y-6 md:grid-cols-5">
        {[
          ["Ambientes", p.rooms],
          ["Escopo", p.scope],
          ["Categoria", p.category],
          ["Imagens", "Renderizações digitais"],
        ].map(([k, v]) => (
          <div key={k} className="tick pt-4 pl-4">
            <p className="label text-mineral">{k}</p>
            <p className="mt-1">{v}</p>
          </div>
        ))}
        <div className="col-span-2 flex items-end md:col-span-1 md:justify-end">
          <TLink href={`/projetos/${p.slug}`} label={p.name} className="label link-draw">
            Ver projeto <span aria-hidden>→</span>
          </TLink>
        </div>
      </div>
    </section>
  );
}
