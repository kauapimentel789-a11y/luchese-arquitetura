import { team, values, specialties } from "@/content/studio";
import { Picture } from "@/components/ui/Picture";
import { TLink } from "@/components/motion/Transition";
import { RevealLines, FadeIn } from "@/components/motion/Reveal";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Portrait } from "@/components/ui/Portrait";

/** Sobre o escritório (resumo na página inicial). */
export function Studio() {
  const lead = team[0];
  return (
    <section data-ambient="light" className="section wrap" aria-labelledby="studio-title">
      <div className="grid-12 gap-y-16">
        <div className="col-span-12 flex justify-between gap-6 border-t border-[var(--line)] pt-5">
          <p className="label whitespace-nowrap">07 ( sobre )</p>
          <p className="label muted hidden text-right sm:block">Estúdio de arquitetura e interiores</p>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <RevealLines id="studio-title" className="display t-lg" lines={["Um estúdio pequeno,", <span key="k1">atenção <em>inteira</em>.</span>]} />
          <FadeIn stagger={0.1} className="mt-12 grid max-w-[58ch] gap-6">
            <p className="lead">
              Fundado por {lead.name}, o escritório trabalha em duas frentes que se completam: o interior, que dá forma ao
              cotidiano, e a reforma, que renova a casa por dentro e por fora.
            </p>
            <p className="muted">
              Cada projeto é conduzido de perto pela arquiteta responsável, com uma equipe enxuta e parceiros técnicos escolhidos para cada obra.
            </p>
          </FadeIn>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {specialties.map((s) => (
              <li key={s} className="label muted">
                — {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-4 lg:col-start-9">
          <Portrait person={lead} className="col-span-2 sm:col-span-1 lg:col-span-2" />
          <MediaReveal className="col-span-2 aspect-[3/2] sm:col-span-1 lg:hidden" from="right">
            <Picture name="suite-penteadeira-3" alt="" sizes="50vw" />
          </MediaReveal>
        </div>

        <ul className="col-span-12 grid gap-x-10 gap-y-10 border-t border-[var(--line)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <li key={v.title}>
              <p className="label muted tabular">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display t-md mt-3">{v.title}</h3>
              <p className="mt-3 text-[15.5px] muted">{v.text}</p>
            </li>
          ))}
        </ul>
        <div className="col-span-12">
          <TLink href="/escritorio" label="O escritório" className="btn btn-dark">
            <span>Conheça o escritório</span>
            <span className="btn-arrow">→</span>
          </TLink>
        </div>
      </div>
    </section>
  );
}
