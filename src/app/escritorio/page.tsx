import type { Metadata } from "next";
import { team, values, specialties, process } from "@/content/studio";
import { RevealLines, FadeIn } from "@/components/motion/Reveal";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Picture } from "@/components/ui/Picture";
import { Portrait } from "@/components/ui/Portrait";
import { TLink } from "@/components/motion/Transition";

export const metadata: Metadata = {
  title: "O escritório",
  description: "História, filosofia, equipe e abordagem de projeto do estúdio.",
};

export default function EscritorioPage() {
  return (
    <>
      <section data-ambient="light" className="wrap pb-[var(--section)] pt-[calc(var(--header-h)+12vh)]">
        <div className="grid-12 gap-y-14">
          <p className="label col-span-12">( o escritório )</p>
          <RevealLines as="h1" trigger="load" delay={0.3} className="display t-mega col-span-12" lines={["Matéria, luz", <span key="k1">e <em>detalhe</em>.</span>]} />
          <FadeIn stagger={0.1} className="col-span-12 grid gap-6 md:col-span-6 lg:col-span-5 lg:col-start-7">
            <p className="lead">
              Somos um estúdio de arquitetura e interiores que trabalha de dentro para fora: o espaço vivido no dia a dia, a marcenaria que o organiza e a fachada que o apresenta.
            </p>
            <p className="muted">
              Acreditamos que um bom projeto começa antes do desenho, na escuta. Por isso dedicamos tempo ao entendimento da casa e de quem vai habitá-la,
              e só então propomos layout, marcenaria e materiais.
            </p>
          </FadeIn>
        </div>
      </section>

      <section data-ambient="light" aria-label="Imagem">
        <MediaReveal className="h-[80svh] min-h-[420px] w-full" from="center">
          <Picture name="living-2" alt="Estar e cozinha integrados da Casa Muxarabi, renderização digital" sizes="100vw" />
        </MediaReveal>
      </section>

      <section data-ambient="light" className="section wrap" aria-labelledby="hist">
        <div className="grid-12 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="label mb-6">01 ( história e filosofia )</p>
            <RevealLines id="hist" className="display t-lg" lines={["Projetar a partir", <span key="k2">de quem vai <em>habitar</em>.</span>]} />
          </div>
          <FadeIn stagger={0.1} className="col-span-12 grid gap-6 lg:col-span-6 lg:col-start-7">
            <p>
              [Espaço para a história do escritório: quando e onde começou, o que motivou a criação do estúdio e quais projetos marcaram a sua trajetória.
              Substitua este parágrafo por um texto real.]
            </p>
            <p className="muted">
              Nossa abordagem combina rigor técnico e sensibilidade: proporção, conforto ambiental e detalhamento cuidadoso a serviço de espaços serenos,
              acolhedores e feitos para durar.
            </p>
          </FadeIn>
        </div>
      </section>

      <section data-ambient="stone" className="section wrap" aria-labelledby="equipe">
        <div className="mb-14 flex justify-between border-t border-[var(--line)] pt-5">
          <h2 id="equipe" className="label">
            02 ( equipe )
          </h2>
          <p className="label muted">Retratos e credenciais a confirmar</p>
        </div>
        <div className="grid-12 gap-y-12">
          {team.map((t) => (
            <div key={t.name} className="col-span-12 grid grid-cols-12 gap-6 lg:col-span-10">
              <Portrait person={t} className="col-span-12 sm:col-span-5 lg:col-span-4" />
              <div className="col-span-12 sm:col-span-7 lg:col-span-6 lg:col-start-6">
                <p className="lead">{t.bio}</p>
                <p className="mt-6 text-[15px] muted">
                  {t.credentials ?? "Formação e registro profissional (CAU) serão exibidos aqui quando informados pelo escritório."}
                </p>
                <p className="label mb-3 mt-10">Especialidades</p>
                <ul className="grid gap-2">
                  {specialties.map((s) => (
                    <li key={s} className="border-b border-[var(--line)] pb-2">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section data-ambient="dark" className="section wrap text-marfim" aria-labelledby="valores">
        <div className="mb-14 flex justify-between border-t border-white/15 pt-5">
          <h2 id="valores" className="label">
            03 ( valores e abordagem )
          </h2>
        </div>
        <ul className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
          {values.map((v, i) => (
            <li key={v.title} className="border-t border-white/15 pt-6">
              <p className="label text-mineral tabular">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display t-lg mt-4">{v.title}</h3>
              <p className="mt-4 max-w-[46ch] text-white/70">{v.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-24 grid-12 gap-y-10">
          <p className="label col-span-12 text-mineral">Como trabalhamos</p>
          <ol className="col-span-12 grid gap-6 md:grid-cols-5">
            {process.map((s) => (
              <li key={s.index} className="border-t border-white/15 pt-4">
                <p className="display t-md tabular">{s.index}</p>
                <p className="mt-2 text-[15px]">{s.title}</p>
              </li>
            ))}
          </ol>
          <div className="col-span-12 mt-6 flex flex-wrap gap-4">
            <TLink href="/projetos" label="Projetos" className="btn btn-light">
              <span>Ver projetos</span>
              <span className="btn-arrow">→</span>
            </TLink>
            <TLink href="/contato" label="Contato" className="btn btn-light">
              <span>Iniciar um projeto</span>
              <span className="btn-arrow">→</span>
            </TLink>
          </div>
        </div>
      </section>
    </>
  );
}
