"use client";
import { useEffect, useRef, useState } from "react";
import { services } from "@/content/studio";
import { Picture } from "@/components/ui/Picture";
import { RevealLines } from "@/components/motion/Reveal";
import { gsap, useFinePointer } from "@/lib/motion";

/**
 * Serviços em lista editorial. No desktop, a imagem do serviço acompanha o cursor;
 * no toque, cada linha se expande e mostra a imagem dentro dela.
 */
export function Services() {
  const [open, setOpen] = useState<number | null>(0);
  const [hover, setHover] = useState<number | null>(null);
  const fine = useFinePointer();
  const float = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!fine || !float.current || !list.current) return;
    const el = float.current;
    const x = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      x(e.clientX + 32);
      y(e.clientY - el.offsetHeight / 2);
    };
    const ul = list.current;
    ul.addEventListener("pointermove", move);
    return () => ul.removeEventListener("pointermove", move);
  }, [fine]);

  return (
    <section id="servicos" data-ambient="light" className="section wrap scroll-mt-20" aria-labelledby="services-title">
      <div className="grid-12 mb-16 gap-y-8">
        <div className="col-span-12 flex justify-between gap-6 border-t border-[var(--line)] pt-5">
          <p className="label whitespace-nowrap">04 ( serviços )</p>
          <p className="label muted hidden text-right sm:block">Seis frentes, um mesmo cuidado</p>
        </div>
        <RevealLines id="services-title" className="display t-xl col-span-12 lg:col-span-8" lines={["Do interior", <span key="k1">à <em>fachada</em>.</span>]} />
        <p className="col-span-12 self-end muted lg:col-span-4">
          Atuamos do detalhe da marcenaria à fachada da casa. Cada serviço pode ser contratado de forma independente ou integrado em um único projeto.
        </p>
      </div>

      <ul ref={list} className="border-b border-[var(--line)]" onPointerLeave={() => setHover(null)}>
        {services.map((s, i) => {
          const isOpen = open === i;
          return (
            <li key={s.index} className="border-t border-[var(--line)]" onPointerEnter={() => fine && setHover(i)}>
              <h3>
                <button
                  type="button"
                  className="group grid w-full grid-cols-12 items-baseline gap-4 py-7 text-left md:py-9"
                  id={`svc-btn-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`svc-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="label col-span-2 muted tabular md:col-span-1">{s.index}</span>
                  <span className="display col-span-9 text-[clamp(1.9rem,4.4vw,4.4rem)] leading-none transition-transform duration-700 ease-[cubic-bezier(.22,.8,.2,1)] group-hover:translate-x-3 md:col-span-9">
                    {s.title}
                  </span>
                  <span aria-hidden className="col-span-1 justify-self-end text-2xl font-light transition-transform duration-500 md:col-span-2" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>
                    +
                  </span>
                </button>
              </h3>
              <div
                id={`svc-${i}`}
                role="region"
                aria-labelledby={`svc-btn-${i}`}
                inert={!isOpen}
                className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,.8,.2,1)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 pb-10">
                    <p className="col-span-12 max-w-[52ch] md:col-span-6 md:col-start-2">{s.text}</p>
                    <div className="media col-span-12 aspect-[16/10] md:col-span-4 md:col-start-9 lg:hidden">
                      <Picture name={s.image} alt="" sizes="(min-width:768px) 33vw, 100vw" />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {fine && (
        <div
          ref={float}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[18.75rem] w-[15rem] lg:block"
          style={{ transform: "translate(-999px,-999px)" }}
        >
          {services.map((s, i) => (
            <div
              key={s.index}
              className="media absolute inset-0 transition-[opacity,clip-path,transform] duration-700 ease-[cubic-bezier(.22,.8,.2,1)]"
              style={{
                opacity: hover === i ? 1 : 0,
                clipPath: hover === i ? "inset(0 0 0 0)" : "inset(50% 0 50% 0)",
                transform: hover === i ? "scale(1)" : "scale(1.08)",
              }}
            >
              <Picture name={s.image} alt="" sizes="240px" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
