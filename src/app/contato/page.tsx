import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { RevealLines } from "@/components/motion/Reveal";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Picture } from "@/components/ui/Picture";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Conte sobre o seu projeto. Respondemos em até dois dias úteis.",
};

export default function ContatoPage() {
  return (
    <div data-ambient="light" className="wrap pb-[var(--section)] pt-[calc(var(--header-h)+12vh)]">
      <div className="grid-12 gap-y-16">
        <div className="col-span-12 lg:col-span-5">
          <p className="label mb-8">( contato )</p>
          <RevealLines as="h1" trigger="load" delay={0.3} className="display t-xl" lines={["Vamos dar forma", <span key="k1">à sua <em>próxima</em></span>, "ideia?"]} />
          <p className="lead mt-10 max-w-[40ch]">
            Conte um pouco sobre o terreno ou o imóvel, o programa e o momento do projeto. Respondemos em até dois dias úteis.
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
            {site.contact.email && (
              <div>
                <dt className="label muted">E-mail</dt>
                <dd className="mt-1">{site.contact.email}</dd>
              </div>
            )}
          </dl>
          <MediaReveal className="mt-14 hidden aspect-[4/5] lg:block" from="bottom">
            <Picture name="lago-deck" alt="Varanda do Pavilhão do Lago, renderização conceitual" sizes="40vw" />
          </MediaReveal>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-28">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
