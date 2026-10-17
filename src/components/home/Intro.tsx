"use client";
import { useRef } from "react";
import { Picture } from "@/components/ui/Picture";
import { RevealLines, FadeIn } from "@/components/motion/Reveal";
import { TLink } from "@/components/motion/Transition";
import { gsap, useIsoLayoutEffect, prefersReducedMotion, canScrub } from "@/lib/motion";

/** Apresentação do escritório: declaração forte, texto institucional e imagem que muda de escala. */
export function Intro() {
  const img = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = img.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      if (!canScrub()) {
        // celular: a moldura se abre uma vez, por tempo, quando entra na tela
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } })
          .fromTo(el, { clipPath: "inset(12% 14% 12% 14%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" })
          .fromTo(el.querySelector("img"), { scale: 1.28 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0.1);
        return;
      }
      gsap.fromTo(el, { clipPath: "inset(12% 14% 12% 14%)" }, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 95%", end: "center 55%", scrub: true },
      });
      gsap.fromTo(el.querySelector("img"), { scale: 1.28 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section data-ambient="light" className="section wrap" aria-labelledby="intro-title">
      <div className="grid-12 gap-y-16">
        <div className="col-span-12 flex items-start justify-between border-t border-[var(--line)] pt-5 lg:col-span-12">
          <p className="label whitespace-nowrap">01 ( o escritório )</p>
          <p className="label muted hidden sm:block">Prancha A · Manifesto</p>
        </div>

        <RevealLines
          id="intro-title"
          className="display t-xl col-span-12 lg:col-span-11"
          lines={["Não desenhamos", <span key="k1">apenas ambientes. <em>Criamos</em></span>, "experiências de habitar."]}
        />

        <div className="col-span-12 grid gap-10 md:col-span-6 lg:col-span-4 lg:col-start-2 lg:pt-24">
          <FadeIn stagger={0.12} className="grid gap-6">
            <p className="lead">
              Cada projeto nasce de uma leitura atenta da casa e de quem vive nela: a luz que entra, os caminhos do dia a dia, o que precisa ficar à
              mão e o que merece ficar à vista.
            </p>
            <p className="muted">
              Trabalhamos com poucos materiais, escolhidos pela verdade que carregam: a madeira que aquece o toque, a pedra das bancadas, o vidro
              que deixa a luz atravessar. A iluminação é desenhada junto com a marcenaria, peça por peça.
            </p>
            <p className="muted">
              O resultado são interiores serenos, precisos nas proporções e pensados para envelhecer bem. Do lado de fora, reformamos fachadas e
              áreas externas com o mesmo cuidado.
            </p>
            <div className="pt-4">
              <TLink href="/escritorio" label="O escritório" className="label link-draw">
                Conheça o escritório <span aria-hidden>→</span>
              </TLink>
            </div>
          </FadeIn>
        </div>

        <figure className="col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7">
          <div ref={img} className="media aspect-[4/5] w-full">
            <Picture name="hall-3" alt="Muxarabi de madeira, espelho orgânico e balcão de bar com banquetas" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <figcaption className="mt-4 flex justify-between gap-6 border-t border-[var(--line)] pt-3">
            <span className="label">Fig. 01 — Muxarabi e balcão de bar</span>
            <span className="label muted">Renderização digital</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
