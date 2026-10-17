"use client";
import { useRef, useState } from "react";
import { featured } from "@/content/projects";
import { Picture, imageMeta } from "@/components/ui/Picture";
import { Hotspots, type Spot } from "@/components/home/Hotspots";
import { TLink } from "@/components/motion/Transition";
import { RevealLines } from "@/components/motion/Reveal";
import { gsap, useIsoLayoutEffect, prefersReducedMotion, canScrub } from "@/lib/motion";

const IMAGE = "living-4";
const SPOTS: Spot[] = [
  { x: 9, y: 45, title: "Cristaleira iluminada", text: "Portas de vidro com perfil preto e LED em cada prateleira." },
  { x: 25, y: 16, title: "Prateleiras suspensas", text: "Estrutura em metal preto presa ao teto, com tábuas de madeira." },
  { x: 43, y: 30, title: "Escada vazada", text: "Degraus em balanço que deixam a luz passar até a sala." },
  { x: 60, y: 66, title: "Mesa junto à ilha", text: "Tampo curvo em madeira que continua a bancada da cozinha." },
  { x: 78, y: 42, title: "Muxarabi de madeira", text: "Divide a cozinha do estar sem fechar a vista." },
];

/** Projeto em destaque: a imagem se expande até ocupar a largura da tela, como uma obra exposta. */
export function Featured() {
  const frame = useRef<HTMLDivElement>(null);
  const p = featured;
  const [open, setOpen] = useState<number | null>(null);
  const meta = imageMeta(IMAGE);
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

      <div ref={frame} className="media aspect-[2400/1331] w-full md:aspect-auto md:h-[78svh] md:min-h-[440px]">
        <div data-img className="absolute inset-0">
          <div className="cover-box" style={{ "--ar": meta.w / meta.h } as React.CSSProperties}>
            <Picture name={IMAGE} alt="Cristaleira iluminada, escada vazada e muxarabi da Casa Muxarabi" sizes="100vw" />
            <Hotspots spots={SPOTS} open={open} setOpen={setOpen} />
          </div>
        </div>
      </div>
      <div className="wrap mt-4 min-h-[5.5rem] md:hidden" aria-live="polite">
        {open === null ? (
          <p className="label text-mineral">Toque nos pontos para ver os detalhes</p>
        ) : (
          <div>
            <p className="label text-bronze">
              {String(open + 1).padStart(2, "0")} · {SPOTS[open].title}
            </p>
            <p className="mt-2 text-[15px] text-white/75">{SPOTS[open].text}</p>
          </div>
        )}
      </div>

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
