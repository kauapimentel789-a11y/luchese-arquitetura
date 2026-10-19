import { figures } from "@/content/site";
import { Counter } from "@/components/motion/Counter";
import { FadeIn } from "@/components/motion/Reveal";

/** Indicadores: só mostram números quando o escritório os informa em content/site.ts. */
export function Figures() {
  const anyValue = figures.some((f) => f.value !== null);
  // sem números confirmados a seção não aparece: um painel de "a confirmar" não serve ao visitante
  if (!anyValue) return null;
  return (
    <section data-ambient="dark" className="section wrap text-marfim" aria-labelledby="figures-title">
      <div className="mb-16 flex justify-between gap-6 border-t border-white/15 pt-5">
        <p className="label" id="figures-title">
          ( em números )
        </p>
        
      </div>
      <FadeIn stagger={0.1} className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((f) => (
          <div key={f.label} className="border-t border-white/15 pt-6">
            <p className="display text-[clamp(4rem,8vw,8.5rem)] leading-[0.85]">
              {f.value !== null ? <Counter value={f.value} prefix={f.prefix} suffix={f.suffix} /> : <span className="text-white/25">—</span>}
            </p>
            <p className="label mt-6">{f.label}</p>
            <p className="mt-1 text-[0.9375rem] text-mineral">{f.value !== null ? f.note : "a confirmar"}</p>
          </div>
        ))}
      </FadeIn>
    </section>
  );
}
