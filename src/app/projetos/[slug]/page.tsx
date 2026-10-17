import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { imageSrc, Picture } from "@/components/ui/Picture";
import { ProjectHero } from "@/components/project/ProjectHero";
import { Gallery } from "@/components/project/Gallery";
import { ReadingProgress } from "@/components/project/ReadingProgress";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { RevealLines, FadeIn } from "@/components/motion/Reveal";
import { TLink } from "@/components/motion/Transition";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.description,
    openGraph: { title: p.name, description: p.tagline, images: [{ url: imageSrc(p.cover, 1800) }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article>
      <ReadingProgress />
      <ProjectHero p={p} />

      {/* apresentação + ficha técnica */}
      <section data-ambient="light" className="section wrap">
        <div className="grid-12 gap-y-16">
          <div className="col-span-12 flex justify-between border-t border-[var(--line)] pt-5">
            <p className="label">( o projeto )</p>
            <p className="label muted">Imagens renderizadas</p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <RevealLines className="display t-lg" lines={[p.tagline]} />
            <FadeIn stagger={0.1} className="mt-10 grid max-w-[60ch] gap-6">
              <p className="lead">{p.description}</p>
              <div>
                <p className="label mb-3">Conceito</p>
                <p className="muted">{p.concept}</p>
              </div>
            </FadeIn>
          </div>
          <aside className="col-span-12 lg:col-span-4 lg:col-start-9" aria-label="Ficha técnica">
            <p className="label mb-4">Ficha técnica</p>
            <dl className="border-t border-[var(--line)]">
              {[["Projeto", p.name], ["Categoria", p.category], ...p.specs.map((s) => [s.label, s.value])].map(([k, v]) => (
                <div key={k} className="grid grid-cols-5 gap-4 border-b border-[var(--line)] py-3 text-[15px]">
                  <dt className="label col-span-2 pt-1 muted">{k}</dt>
                  <dd className="col-span-3">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="label mb-4 mt-10">Materiais</p>
            <ul className="flex flex-wrap gap-2">
              {p.materials.map((m) => (
                <li key={m} className="rounded-full border border-[var(--line-strong)] px-3 py-1.5 text-[13px]">
                  {m}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* narrativa */}
      {p.chapters.map((c, k) => (
        <section key={k} data-ambient={c.layout === "full" ? "dark" : k % 2 ? "stone" : "light"} className={c.layout === "full" ? "text-marfim" : "section wrap"}>
          {c.layout === "full" ? (
            <div className="relative">
              <MediaReveal className="h-[92svh] min-h-[480px] w-full" from="center" parallax={6}>
                <Picture name={c.image!} alt={c.title} sizes="100vw" />
              </MediaReveal>
              <div className="wrap absolute inset-x-0 bottom-0 bg-gradient-to-t from-carvao/85 to-transparent pb-[8vh] pt-40">
                <p className="label mb-5 text-pedra">{c.eyebrow}</p>
                <RevealLines className="display t-xl max-w-[16ch]" lines={[c.title]} />
                <p className="mt-6 max-w-[52ch] text-white/80">{c.text}</p>
              </div>
            </div>
          ) : (
            <div className="grid-12 items-center gap-y-12">
              <div className={`col-span-12 lg:col-span-5 ${c.layout === "inset" ? "lg:order-2 lg:col-start-8" : ""}`}>
                <p className="label mb-6">{c.eyebrow}</p>
                <RevealLines className="display t-lg" lines={[c.title]} />
                <FadeIn>
                  <p className="mt-8 max-w-[48ch] muted">{c.text}</p>
                </FadeIn>
              </div>
              {c.image && (
                <div className={`col-span-12 lg:col-span-6 ${c.layout === "inset" ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
                  <MediaReveal className={c.layout === "inset" ? "aspect-[4/5]" : "aspect-[3/2]"} from={c.layout === "inset" ? "left" : "right"}>
                    <Picture name={c.image} alt={c.title} sizes="(min-width:1024px) 50vw, 100vw" />
                  </MediaReveal>
                </div>
              )}
            </div>
          )}
        </section>
      ))}

      {/* galeria */}
      <section data-ambient="dark" className="section wrap text-marfim" aria-labelledby="gal-title">
        <div className="mb-10 flex items-end justify-between border-t border-white/15 pt-5">
          <h2 id="gal-title" className="label">
            ( galeria · {String(p.gallery.length).padStart(2, "0")} imagens )
          </h2>
          <p className="label hidden text-mineral sm:block">Use ← → ou arraste</p>
        </div>
        <Gallery items={p.gallery} title={p.name} />
      </section>

      {/* próximo projeto */}
      <section data-ambient="dark" className="text-marfim">
        <TLink href={`/projetos/${next.slug}`} label={next.name} data-cursor="Próximo projeto" className="group relative block overflow-hidden">
          <div className="media h-[70svh] min-h-[420px]">
            <Picture name={next.cover} alt="" sizes="100vw" className="h-full w-full object-cover opacity-60 transition-[transform,opacity] duration-[1.6s] ease-[cubic-bezier(.22,.8,.2,1)] group-hover:scale-[1.04] group-hover:opacity-80" />
          </div>
          <div className="wrap absolute inset-0 flex flex-col justify-end pb-[7vh]">
            <p className="label mb-5 text-pedra">Próximo projeto · {next.index}</p>
            <p className="display t-xl">{next.name}</p>
            <p className="label mt-6 inline-flex items-center gap-3">
              Ver projeto <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
            </p>
          </div>
        </TLink>
      </section>
    </article>
  );
}
