"use client";
import { useRef, useState } from "react";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/motion";
import { finishIntro, introPending, setFoco, type Foco } from "@/lib/intro";
import { Picture } from "@/components/ui/Picture";

/*
  Abertura em dois atos.
  1. O monograma NL é desenhado em duas peças deslocadas, que deslizam e se encaixam sobre o
     traçado tracejado da prancha; as letras de LUCHESE chegam soltas e o espaçamento se fecha
     até a medida do logotipo.
  2. O logotipo sobe e a tela se divide em dois caminhos: arquitetura interna ou externa.
     O caminho escolhido ocupa a tela e abre o site já com esse foco (ver lib/intro.ts).
  Toca só na primeira página da visita.

  Monograma redesenhado como traço a partir de public/brand/monogram-black.png (360 × 417).
*/
const PIECE_A = "M41 381V47L160.5 169V364Q160.5 378 175 378H330";
const PIECE_B = "M181 191L276.5 289V36";
const WORD = "LUCHESE".split("");
const SUB = "ARQUITETURA".split("");

const CHOICES: { foco: Foco; n: string; title: string; detail: string; image: string; alt: string }[] = [
  {
    foco: "interiores",
    n: "01",
    title: "Arquitetura interna",
    detail: "Interiores, marcenaria, luz e mobiliário",
    image: "jardins-living",
    alt: "Estar do Apartamento Jardins com forro de madeira e vista para o jardim",
  },
  {
    foco: "arquitetura",
    n: "02",
    title: "Arquitetura externa",
    detail: "Residências, volumes, fachadas e paisagem",
    image: "mirante-hero",
    alt: "Residência Mirante ao entardecer, volume de concreto sobre pavilhão de vidro",
  },
];

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const chooseRef = useRef<(f: Foco, i: number) => void>(() => {});

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || !introPending()) {
      setGone(true);
      return;
    }
    el.dataset.live = "";
    const q = gsap.utils.selector(el);
    const reduced = prefersReducedMotion();
    const lockScroll = requestAnimationFrame(() => window.__lenis?.stop());

    // pronto = fontes + página carregada (com teto, para nunca prender o visitante)
    const ready = Promise.race([
      Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise<void>((res) => (document.readyState === "complete" ? res() : window.addEventListener("load", () => res(), { once: true }))),
      ]),
      new Promise((res) => setTimeout(res, 7000)),
    ]);

    const counter = q("[data-count]")[0];
    const bar = q("[data-bar]")[0];
    const prog = { v: 0 };
    const paint = () => {
      if (counter) counter.textContent = String(Math.round(prog.v)).padStart(3, "0");
      if (bar) bar.style.transform = `scaleX(${prog.v / 100})`;
    };

    const ctx = gsap.context(() => {
      const lockup = q("[data-lockup]")[0];
      const panels = q("[data-panel]");

      // ato 2: o logotipo sobe e os dois caminhos entram por baixo
      const toChooser = () => {
        const small = window.innerWidth < 768 ? 0.42 : 0.5;
        const lift = () => {
          const r = lockup.getBoundingClientRect();
          const top = window.innerWidth < 768 ? 34 : 46;
          return top + (r.height * small) / 2 - (r.top + r.height / 2);
        };
        const tl = gsap.timeline({
          defaults: { ease: "expo.inOut" },
          onComplete: () => {
            setChoosing(true);
            setTimeout(() => (q("[data-panel]")[0] as HTMLElement | undefined)?.focus({ preventScroll: true }), 60);
          },
        });
        tl.to(prog, { v: 100, duration: 0.45, ease: "power2.out", onUpdate: paint })
          .to(q("[data-foot]"), { autoAlpha: 0, duration: 0.45, ease: "power2.out" }, "+=0.1")
          .to(q("[data-tick]"), { scaleX: 0, duration: 0.5, ease: "power2.in" }, "<")
          .to(lockup, { y: lift, scale: small, duration: reduced ? 0.01 : 1.25 }, "<0.15")
          .fromTo(
            panels,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0.4 : 1.35, stagger: 0.12 },
            "<0.2",
          )
          .fromTo(q("[data-panel-img]"), { scale: 1.28 }, { scale: 1, duration: reduced ? 0.01 : 1.8, ease: "expo.out", stagger: 0.12 }, "<0.25")
          .fromTo(q("[data-panel-copy]"), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.1 }, "-=1.1");
      };

      // escolha: o caminho escolhido toma a tela e o site é revelado por baixo
      chooseRef.current = (foco, i) => {
        setChoosing(false);
        setFoco(foco);
        const picked = panels[i];
        const other = panels[1 - i];
        const out = gsap.timeline({
          defaults: { ease: "expo.inOut" },
          onComplete: () => {
            window.__lenis?.start();
            setGone(true);
          },
        });
        out
          .to(q("[data-panel-copy]"), { autoAlpha: 0, y: -14, duration: 0.45, ease: "power2.in" }, 0)
          .to(lockup, { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, 0)
          .to(other, { flexGrow: 0.0001, autoAlpha: 0.2, duration: reduced ? 0.3 : 1.1 }, 0.1)
          .to(q("[data-choices]"), { gap: 0, padding: 0, duration: reduced ? 0.3 : 1.1 }, 0.1)
          .to(picked.querySelector("[data-panel-shade]"), { opacity: 0, duration: 1 }, 0.3)
          .to(q("[data-layer='main']"), { clipPath: "inset(0% 0% 100% 0%)", duration: reduced ? 0.5 : 1.15, ease: "power4.inOut" }, reduced ? 0.4 : 1.15)
          .to(q("[data-layer='accent']"), { clipPath: "inset(0% 0% 100% 0%)", duration: reduced ? 0.5 : 1.15, ease: "power4.inOut" }, "<0.12")
          .add(finishIntro, "<0.3");
      };

      if (reduced) {
        gsap.set(q("[data-piece]"), { strokeDashoffset: 0 });
        gsap.set(q("[data-letter], [data-sub]"), { autoAlpha: 1 });
        gsap.set(q("[data-ghost], [data-rule]"), { autoAlpha: 0 });
        gsap.set(q("[data-word]"), { "--ls": "0.34em" });
        gsap.set(q("[data-foot]"), { autoAlpha: 1 });
        Promise.all([ready, new Promise((r) => setTimeout(r, 500))]).then(toChooser);
        return;
      }

      // ato 1: a marca se monta
      gsap.set(q("[data-g='a']"), { x: -78, y: 34 });
      gsap.set(q("[data-g='b']"), { x: 74, y: -82 });

      const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });
      tl.to(prog, { v: 88, duration: 2.9, ease: "power1.inOut", onUpdate: paint }, 0)
        .fromTo(q("[data-foot]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0.1)
        // prancha: linhas de construção e o traçado de destino
        .to(q("[data-rule='h']"), { scaleX: 1, duration: 1.3, stagger: 0.08 }, 0)
        .to(q("[data-rule='v']"), { scaleY: 1, duration: 1.3, stagger: 0.08 }, 0.1)
        .to(q("[data-ghost]"), { autoAlpha: 1, duration: 0.7, ease: "power2.out" }, 0.35)
        // as duas peças são desenhadas fora do lugar
        .to(q("[data-piece='a']"), { strokeDashoffset: 0, duration: 1.35, ease: "power2.inOut" }, 0.4)
        .to(q("[data-piece='b']"), { strokeDashoffset: 0, duration: 1.05, ease: "power2.inOut" }, 0.65)
        // encaixe
        .to(q("[data-g='a']"), { x: 0, y: 0, duration: 1.0 }, 1.6)
        .to(q("[data-g='b']"), { x: 0, y: 0, duration: 1.0 }, 1.66)
        .to(q("[data-piece='b']"), { stroke: "#f5f3ee", duration: 0.5, ease: "power2.out" }, 2.45)
        .to(q("[data-mono]"), { scale: 0.965, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1, transformOrigin: "50% 60%" }, 2.6)
        .to(q("[data-ghost]"), { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 2.6)
        .to(q("[data-tick]"), { scaleX: 1, duration: 0.9 }, 2.6)
        .to(q("[data-rule]"), { autoAlpha: 0, duration: 0.8, ease: "power2.out" }, 2.75)
        // LUCHESE: letras soltas que assentam enquanto o espaçamento se fecha
        .fromTo(
          q("[data-letter]"),
          {
            autoAlpha: 0,
            yPercent: () => gsap.utils.random(-150, 150),
            xPercent: () => gsap.utils.random(-60, 60),
            rotate: () => gsap.utils.random(-28, 28),
            filter: "blur(8px)",
          },
          { autoAlpha: 1, yPercent: 0, xPercent: 0, rotate: 0, filter: "blur(0px)", duration: 1.25, ease: "expo.out", stagger: { each: 0.07, from: "random" } },
          1.95,
        )
        .fromTo(q("[data-word]"), { "--ls": "1.1em" }, { "--ls": "0.34em", duration: 1.7 }, 1.9)
        .fromTo(q("[data-sub]"), { autoAlpha: 0, yPercent: 110 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.03 }, 2.85);

      Promise.all([ready, new Promise((r) => tl.eventCallback("onComplete", r))]).then(toChooser);
    }, el);

    return () => {
      cancelAnimationFrame(lockScroll);
      ctx.revert();
      window.__lenis?.start();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} data-preloader className="preloader fixed inset-0 z-[120] text-marfim">
      <div data-layer="accent" className="absolute inset-0 bg-bronze" />
      <div data-layer="main" className="absolute inset-0 overflow-hidden bg-carvao">
        {/* ato 2: os dois caminhos */}
        <div
          data-choices
          role="group"
          aria-label="Escolha por onde começar"
          className="choices absolute inset-0 flex flex-col gap-[clamp(8px,1.4vw,22px)] p-[clamp(8px,1.4vw,22px)] md:flex-row"
        >
          {CHOICES.map((c, i) => (
            <button
              key={c.foco}
              type="button"
              data-panel
              tabIndex={choosing ? 0 : -1}
              disabled={!choosing}
              onClick={() => chooseRef.current(c.foco, i)}
              aria-label={`${c.title}: ${c.detail}`}
              data-cursor={choosing ? "Entrar" : undefined}
              className="choice group relative min-h-0 overflow-hidden bg-carvao-2 text-left text-marfim outline-offset-[-6px] [clip-path:inset(100%_0%_0%_0%)]"
            >
              <span data-panel-img className="absolute inset-0 block">
                <Picture name={c.image} alt="" priority sizes="(min-width: 768px) 50vw, 100vw" className="choice-img h-full w-full object-cover" />
              </span>
              <span data-panel-shade className="choice-shade absolute inset-0 bg-[linear-gradient(180deg,rgba(23,24,22,.62)_0%,rgba(23,24,22,.25)_38%,rgba(23,24,22,.72)_100%)]" />
              <span data-panel-copy className="absolute inset-x-0 bottom-0 flex items-end gap-5 p-[clamp(18px,3.4vw,56px)] opacity-0">
                <span aria-hidden className="choice-arrow grid h-[clamp(48px,4.4vw,64px)] w-[clamp(48px,4.4vw,64px)] shrink-0 place-items-center bg-marfim text-[20px] text-carvao">
                  <span className="choice-arrow-glyph">→</span>
                </span>
                <span className="flex min-w-0 flex-col gap-2">
                  <span className="label text-white/60">
                    ({c.n}) {c.detail}
                  </span>
                  <span className="display t-md">{c.title}</span>
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* ato 1: a marca */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div data-lockup className="relative flex flex-col items-center" role="img" aria-label="Luchese Arquitetura">
            <div className="relative">
              {/* linhas de construção alinhadas à caixa do monograma */}
              <span data-rule="h" className="pre-rule-h top-0" />
              <span data-rule="h" className="pre-rule-h bottom-0" />
              <span data-rule="v" className="pre-rule-v left-0" />
              <span data-rule="v" className="pre-rule-v right-0" />
              <svg data-mono viewBox="0 0 360 417" className="relative block h-auto w-[clamp(64px,8vw,104px)] overflow-visible" aria-hidden>
                <g data-ghost className="opacity-0" fill="none" stroke="rgb(245 243 238 / 0.28)" strokeWidth="1.5" strokeDasharray="5 7">
                  <path d={PIECE_A} />
                  <path d={PIECE_B} />
                </g>
                <g data-g="a">
                  <path data-piece="a" d={PIECE_A} pathLength={1} className="pre-piece" stroke="#f5f3ee" />
                </g>
                <g data-g="b">
                  <path data-piece="b" d={PIECE_B} pathLength={1} className="pre-piece" stroke="#b89c7a" />
                </g>
              </svg>
            </div>
            <span data-tick className="mt-7 block h-px w-10 origin-center scale-x-0 bg-bronze-claro" />
            <span aria-hidden className="mt-7 flex flex-col items-center leading-none">
              <span data-word className="pre-word font-sans font-normal text-[clamp(28px,4.2vw,54px)]">
                {WORD.map((l, i) => (
                  <span key={i} data-letter className="inline-block opacity-0">
                    {l}
                  </span>
                ))}
              </span>
              <span className="mt-4 flex overflow-hidden pl-[0.55em] font-sans text-[clamp(10px,1.05vw,13px)] font-medium tracking-[0.55em]">
                {SUB.map((l, i) => (
                  <span key={i} data-sub className="inline-block opacity-0">
                    {l}
                  </span>
                ))}
              </span>
            </span>
          </div>
        </div>

        <div data-foot className="wrap pointer-events-none absolute inset-x-0 bottom-0 pb-[max(28px,env(safe-area-inset-bottom))] opacity-0" role="status">
          <div className="flex items-end justify-between gap-6">
            <p className="label hidden text-white/45 sm:block">Arquitetura · Interiores · Paisagem</p>
            <span className="sm:hidden" />
            <p className="label tabular text-white/70">
              <span className="sr-only">Carregando </span>
              <span data-count>000</span>
              <span className="text-white/35"> / 100</span>
            </p>
          </div>
          <div className="mt-4 h-px bg-white/10">
            <div data-bar className="h-px origin-left scale-x-0 bg-bronze-claro" />
          </div>
        </div>
      </div>
    </div>
  );
}
