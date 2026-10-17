"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Picture } from "@/components/ui/Picture";
import { RevealLines } from "@/components/motion/Reveal";
import { ScrollTrigger, useFinePointer, useReducedMotion, whenQuiet } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";

const HouseScene = dynamic(() => import("./HouseScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    // libera o contexto de teste na hora (cada contexto WebGL custa memória de GPU)
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}



const fmtHour = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}h${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

/**
 * Experiência 3D: maquete digital da Residência Mirante com estudo solar.
 * Carregada só quando a seção se aproxima da tela; sem WebGL, mostra a renderização estática.
 */
export function Experience3D() {
  const section = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [hour, setHour] = useState(16.5);
  const [exploded, setExploded] = useState(false);
  const scrollTurn = useRef(0);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = section.current!;
    // o teste de WebGL e o download da maquete ficam para depois da abertura, num momento ocioso,
    // para não disputar a CPU com a animação de entrada nem travar a rolagem quando a seção chega
    let wait = 0;
    let offQuiet = () => {};
    const offIntro = onIntroDone(() => {
      // depois que a entrada do hero termina e quando a pessoa não está rolando
      wait = window.setTimeout(
        () =>
          (offQuiet = whenQuiet(() => {
            setWebgl((w) => (w === null ? hasWebGL() : w));
            void import("./HouseScene");
          })),
        3200,
      );
    });
    // a cena é montada bem antes de aparecer (e num momento ocioso), para a compilação não cair no meio da rolagem
    const ioNear = new IntersectionObserver(
      ([e]) =>
        e.isIntersecting &&
        // monta a cena quando a rolagem para; até lá fica a imagem estática
        (offQuiet = whenQuiet(() => {
          setWebgl((w) => (w === null ? hasWebGL() : w));
          setNear(true);
        }, 500)),
      { rootMargin: "1400px 0px" },
    );
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px 0px" });
    ioNear.observe(el);
    io.observe(el);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => (scrollTurn.current = reduced ? 0.5 : s.progress),
    });
    return () => {
      offIntro();
      clearTimeout(wait);
      offQuiet();
      ioNear.disconnect();
      io.disconnect();
      st.kill();
    };
  }, [reduced]);

  return (
    <section ref={section} data-ambient="dark" className="section text-marfim" aria-labelledby="exp-title">
      <div className="wrap grid-12 mb-12 gap-y-8">
        <div className="col-span-12 flex justify-between gap-6 border-t border-white/15 pt-5">
          <p className="label whitespace-nowrap">04 ( maquete digital )</p>
          <p className="label text-mineral hidden text-right sm:block">Residência Mirante · Estudo solar</p>
        </div>
        <RevealLines id="exp-title" className="display t-xl col-span-12 lg:col-span-8" lines={["Percorra o dia", <span key="k1">dentro do <em>projeto</em>.</span>]} />
        <p className="col-span-12 self-end text-white/70 lg:col-span-4">
          Mova o sol e veja como o balanço de concreto sombreia o vidro ao longo do dia. Separe os pavimentos para entender como a casa se organiza.
          {fine ? " Arraste para girar a maquete." : ""}
        </p>
      </div>

      <div className="wrap">
        <div
          className="relative aspect-[4/5] w-full overflow-hidden bg-carvao-2 sm:aspect-[16/10] lg:aspect-[21/9]"
          data-cursor={fine && webgl ? "Arrastar" : undefined}
        >
          {/* pôster: também é o fallback sem WebGL */}
          <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 0 : 1 }}>
            <Picture name="mirante-aerial" alt="Vista aérea da Residência Mirante no terreno" sizes="100vw" className="h-full w-full object-cover" />
            {webgl === false && (
              <p className="label absolute bottom-4 left-4 bg-carvao/80 px-3 py-2">Seu navegador não suporta WebGL. Exibindo renderização estática.</p>
            )}
            {webgl && near && !ready && <p className="label absolute bottom-4 left-4 animate-pulse bg-carvao/70 px-3 py-2">Carregando maquete…</p>}
          </div>
          {webgl && near && (
            <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }}>
              <HouseScene hour={hour} exploded={exploded} scrollTurn={scrollTurn} interactive={fine} lite={!fine} active={visible} onReady={() => setReady(true)} />
            </div>
          )}
          <div aria-hidden className="pointer-events-none absolute left-4 top-4 hidden gap-6 sm:flex">
            <span className="label text-white/60">N ↑</span>
            <span className="label text-white/60">Esc. gráfica 0 — 10 m</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 items-center gap-6">
          <div className="col-span-12 md:col-span-7">
            <label htmlFor="hora" className="label mb-3 flex justify-between text-mineral">
              <span>Hora do dia</span>
              <span className="tabular text-marfim">{fmtHour(hour)}</span>
            </label>
            <input
              id="hora"
              type="range"
              min={6.5}
              max={18.5}
              step={0.25}
              value={hour}
              onChange={(e) => setHour(parseFloat(e.target.value))}
              className="range w-full"
              aria-valuetext={fmtHour(hour)}
            />
            <div aria-hidden className="label mt-2 flex justify-between text-white/60">
              <span>Nascente</span>
              <span>Meio-dia</span>
              <span>Poente</span>
            </div>
          </div>
          <div className="col-span-12 flex flex-wrap gap-3 md:col-span-5 md:justify-end" role="group" aria-label="Modo de visualização">
            <button type="button" className={`btn ${exploded ? "btn-light opacity-60" : "btn-light"}`} aria-pressed={!exploded} onClick={() => setExploded(false)}>
              <span>Volume</span>
            </button>
            <button type="button" className={`btn ${exploded ? "btn-light" : "btn-light opacity-60"}`} aria-pressed={exploded} onClick={() => setExploded(true)}>
              <span>Separar pavimentos</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
