"use client";
import { projects } from "@/content/projects";
import { Picture } from "@/components/ui/Picture";
import { TLink } from "@/components/motion/Transition";
import { MediaReveal, Parallax } from "@/components/motion/MediaReveal";
import { RevealLines } from "@/components/motion/Reveal";

/* composição assimétrica: cada item ocupa colunas, proporções e alturas diferentes */
const layout = [
  { col: "lg:col-span-7", ratio: "aspect-[16/10]", speed: 0, from: "bottom" as const },
  { col: "lg:col-span-4 lg:col-start-9 lg:mt-[22vh]", ratio: "aspect-[4/5]", speed: 8, from: "left" as const },
  { col: "lg:col-span-5 lg:col-start-2 lg:-mt-[6vh]", ratio: "aspect-[4/5]", speed: 4, from: "right" as const },
  { col: "lg:col-span-6 lg:col-start-7 lg:mt-[14vh]", ratio: "aspect-[3/2]", speed: 10, from: "bottom" as const },
  { col: "lg:col-span-8 lg:col-start-3 lg:mt-[8vh]", ratio: "aspect-[16/9]", speed: 0, from: "center" as const },
];

export function SelectedWorks() {
  const list = projects.slice(1, 6);
  return (
    <section data-ambient="light" className="section wrap" aria-labelledby="works-title">
      <div className="grid-12 mb-20 gap-y-8">
        <div className="col-span-12 flex justify-between gap-6 border-t border-[var(--line)] pt-5">
          <p className="label whitespace-nowrap">03 ( projetos selecionados )</p>
          <p className="label muted hidden text-right sm:block">{String(projects.length).padStart(2, "0")} estudos</p>
        </div>
        <RevealLines id="works-title" className="display t-xl col-span-12 lg:col-span-9" lines={["Do terreno", <span key="k1">ao <em>detalhe</em>.</span>]} />
        <div className="col-span-12 flex items-end lg:col-span-3 lg:justify-end">
          <TLink href="/projetos" label="Projetos" className="label link-draw">
            Todos os projetos <span aria-hidden>→</span>
          </TLink>
        </div>
      </div>

      <ul className="grid-12 gap-y-20">
        {list.map((p, i) => {
          const l = layout[i % layout.length];
          return (
            <li key={p.slug} className={`col-span-12 ${l.col}`}>
              <Parallax speed={l.speed}>
                <TLink href={`/projetos/${p.slug}`} label={p.name} data-cursor="Explorar projeto" className="group block">
                  <MediaReveal className={`${l.ratio} w-full media-zoom`} from={l.from}>
                    <Picture name={p.cover} alt={`${p.name}, ${p.category.toLowerCase()} em ${p.location}`} sizes="(min-width:1024px) 60vw, 100vw" />
                  </MediaReveal>
                  <div className="mt-5 flex items-start justify-between gap-6 border-t border-[var(--line)] pt-4">
                    <div>
                      <p className="label muted mb-2">
                        {p.index} · {p.category}
                      </p>
                      <h3 className="display t-md transition-colors duration-500 group-hover:text-bronze">{p.name}</h3>
                    </div>
                    <p className="label muted shrink-0 text-right leading-relaxed">
                      {p.location}
                      <br />
                      {p.year}
                    </p>
                  </div>
                </TLink>
              </Parallax>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
