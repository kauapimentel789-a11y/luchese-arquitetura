"use client";
import { useRef } from "react";
import { Picture } from "@/components/ui/Picture";
import { TLink } from "@/components/motion/Transition";
import { gsap, useIsoLayoutEffect, prefersReducedMotion, canScrub } from "@/lib/motion";
import { introPending, onIntroDone } from "@/lib/intro";

/**
 * Abertura: fotografia/renderização monumental revelada por uma faixa que se abre,
 * título em três linhas por máscara, camadas com profundidades diferentes
 * respondendo ao cursor e à rolagem.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const q = gsap.utils.selector(el);
    let offIntro = () => {};
    const fromChooser = introPending();
    const ctx = gsap.context(() => {
      if (!reduced) {
        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        offIntro = onIntroDone(() => tl.play());
        // vindo da escolha na abertura, a imagem já ocupa a tela: só o texto entra
        const s = fromChooser ? -0.75 : 0;
        if (!fromChooser) tl.fromTo(q("[data-frame]"), { clipPath: "inset(46% 8% 46% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.9, ease: "power4.inOut" }, 0);
        tl.fromTo(q("[data-img]"), { scale: fromChooser ? 1.1 : 1.32 }, { scale: 1.04, duration: 2.8 }, 0.05)
          .fromTo(q("[data-line]"), { yPercent: 115, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.12 }, 1.0 + s)
          .fromTo(q("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, transformOrigin: "left center" }, 1.2 + s)
          .fromTo(q("[data-rule-v]"), { scaleY: 0 }, { scaleY: 1, duration: 1.6, transformOrigin: "top center" }, 1.25 + s)
          .fromTo(q("[data-fade]"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 1.45 + s);

        // rolagem: a imagem desce mais devagar que o texto, que se dissolve (no celular, só o fade)
        const scrub = canScrub();
        if (scrub)
          gsap.to(q("[data-scroll-img]"), {
            yPercent: 14,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
        gsap.to(q("[data-scroll-text]"), {
          yPercent: scrub ? -38 : 0,
          // só opacidade: o título continua no mapa de acessibilidade ao rolar
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: true },
        });
      }
    }, el);

    // parallax do cursor (somente desktop)
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let off = () => {};
    if (fine && !reduced) {
      const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")).map((n) => ({
        d: parseFloat(n.dataset.depth || "0"),
        x: gsap.quickTo(n, "x", { duration: 1.4, ease: "power3.out" }),
        y: gsap.quickTo(n, "y", { duration: 1.4, ease: "power3.out" }),
      }));
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * l.d);
          l.y(ny * l.d);
        });
      };
      el.addEventListener("pointermove", move);
      off = () => el.removeEventListener("pointermove", move);
    }
    return () => {
      off();
      offIntro();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      data-hero-overlay
      data-ambient="dark"
      aria-label="Abertura"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-carvao text-marfim"
    >
      <div data-frame className="absolute inset-0">
        <div data-scroll-img className="absolute inset-0">
          <div data-depth="-26" className="absolute inset-[-3%]">
            <div data-img className="h-full w-full">
              <div className="h-full w-full animate-[slowzoom_38s_ease-in-out_infinite_alternate]">
                <span data-foco-show="arquitetura" className="block h-full w-full">
                  <Picture name="mirante-hero" alt="Residência Mirante ao entardecer: volume de concreto suspenso sobre um pavilhão de vidro e uma piscina de borda infinita" priority sizes="100vw" className="h-full w-full object-cover object-[72%_60%] md:object-center" />
                </span>
                <span data-foco-show="interiores" className="block h-full w-full">
                  <Picture name="jardins-living" alt="Estar do Apartamento Jardins: forro de madeira ripada, luz lateral e vista para o jardim" sizes="100vw" className="h-full w-full object-cover" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,24,22,.55)_0%,rgba(23,24,22,0)_26%,rgba(23,24,22,0)_48%,rgba(23,24,22,.82)_100%)]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,24,22,.5)_0%,rgba(23,24,22,0)_55%)]" />
      </div>

      {/* camada gráfica: linhas de prancha */}
      <div aria-hidden data-depth="10" className="pointer-events-none absolute inset-0">
        <div data-rule className="absolute left-[var(--gutter)] right-[var(--gutter)] top-[calc(var(--header-h)+18vh)] h-px bg-white/20" />
        <div data-rule-v className="absolute bottom-0 top-0 left-[66.6%] hidden w-px bg-white/12 lg:block" />
        <p data-fade className="label absolute right-[var(--gutter)] hidden sm:block top-[calc(var(--header-h)+18vh+14px)] text-right text-white/70">
          23°15′ S · 47°17′ O
          <br />
          <span className="text-white/45">Estudo de implantação</span>
        </p>
      </div>

      <div data-scroll-text className="relative z-10 flex h-full flex-col justify-end wrap pb-[max(40px,7vh)]">
        <div data-depth="16">
          <p data-fade className="label mb-7 text-pedra">
            ( Arquitetura · Interiores · Paisagem )
          </p>
          <h1 className="display t-mega max-w-[17ch]">
            {["Arquitetura que", <span key="k1">transforma <em>a maneira</em></span>, "de viver."].map((l, i) => (
              <span key={i} className="block overflow-hidden pb-[0.07em] -mb-[0.07em]">
                <span data-line className="block origin-left">
                  {l}
                </span>
              </span>
            ))}
          </h1>
        </div>
        <div className="mt-10 grid grid-cols-12 items-end gap-y-8">
          <p data-fade className="lead col-span-12 max-w-[38ch] text-white/85 md:col-span-6 lg:col-span-4">
            Projetamos espaços com identidade, propósito e uma relação singular entre matéria, luz e paisagem.
          </p>
          <div data-fade className="col-span-12 flex md:col-span-6 lg:col-span-4 lg:col-start-6">
            <TLink href="/projetos" label="Projetos" className="btn btn-light" data-cursor="Ver portfólio">
              <span>Explorar projetos</span>
              <span className="btn-arrow">→</span>
            </TLink>
          </div>
          <div data-fade className="col-span-12 hidden items-end justify-between gap-6 lg:col-span-3 lg:col-start-10 lg:flex">
            <p className="label leading-relaxed text-white/60">
              <span data-foco-show="arquitetura">(01) Residência Mirante</span>
              <span data-foco-show="interiores">(03) Apartamento Jardins</span>
              <br />
              Renderização conceitual
            </p>
            <div className="flex flex-col items-center gap-3" aria-hidden>
              <span className="label text-white/60 [writing-mode:vertical-rl]">Rolar</span>
              <span className="relative block h-16 w-px overflow-hidden bg-white/20">
                <span className="absolute inset-x-0 top-0 h-6 animate-[scrollcue_2.4s_cubic-bezier(.76,0,.24,1)_infinite] bg-white" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
