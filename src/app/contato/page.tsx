import type { Metadata } from "next";
import { RevealLines } from "@/components/motion/Reveal";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Picture } from "@/components/ui/Picture";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com o escritório pelo WhatsApp e conte sobre o seu projeto.",
};

export default function ContatoPage() {
  const wa = whatsappHref();
  return (
    <div data-ambient="light" className="wrap pb-[var(--section)] pt-[calc(var(--header-h)+12vh)]">
      <div className="grid-12 gap-y-16">
        <div className="col-span-12 lg:col-span-5">
          <p className="label mb-8">( contato )</p>
          <RevealLines as="h1" trigger="load" delay={0.3} className="display t-xl" lines={["Vamos dar forma", <span key="k1">à sua <em>próxima</em></span>, "ideia?"]} />
          <p className="lead mt-10 max-w-[40ch]">
            O atendimento é feito pelo WhatsApp. Conte um pouco sobre o terreno ou o imóvel, o programa e o momento do projeto.
          </p>
          <dl className="mt-12 grid gap-6 border-t border-[var(--line)] pt-6 text-[15px]">
            <div>
              <dt className="label muted">Estúdio</dt>
              <dd className="mt-1">{site.contact.city}</dd>
            </div>
            <div>
              <dt className="label muted">Atendimento</dt>
              <dd className="mt-1">{site.contact.hours}</dd>
            </div>
          </dl>
          <MediaReveal className="mt-14 hidden aspect-[4/5] lg:block" from="bottom">
            <Picture name="lago-deck" alt="Varanda do Pavilhão do Lago, renderização conceitual" sizes="40vw" />
          </MediaReveal>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-28">
          <div className="border-t border-[var(--line)] pt-8">
            <p className="label muted">WhatsApp</p>
            {site.contact.phone && <p className="display mt-4 text-[clamp(2.2rem,5vw,3.6rem)]">{site.contact.phone}</p>}
            <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed">
              Para agilizar, envie a cidade da obra, o tipo de projeto (residencial, comercial ou interiores) e, se tiver, fotos ou a planta do terreno.
            </p>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-10" data-cursor="Conversar">
                <span>Conversar pelo WhatsApp</span>
                <span className="btn-arrow">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
