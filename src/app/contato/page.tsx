import type { Metadata } from "next";
import { RevealLines } from "@/components/motion/Reveal";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Picture } from "@/components/ui/Picture";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/whatsapp";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description: "Conte o que você quer para o seu projeto e fale com o escritório pelo WhatsApp.",
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
            Conte o que você quer para o seu projeto. Ao enviar, a conversa continua no WhatsApp do escritório.
          </p>
          <dl className="mt-12 grid gap-6 border-t border-[var(--line)] pt-6 text-[0.9375rem]">
            <div>
              <dt className="label muted">Estúdio</dt>
              <dd className="mt-1">{site.contact.city}</dd>
            </div>
            {site.contact.phone && (
              <div>
                <dt className="label muted">WhatsApp</dt>
                <dd className="mt-1">
                  {wa ? (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="link-draw">
                      {site.contact.phone}
                    </a>
                  ) : (
                    site.contact.phone
                  )}
                </dd>
              </div>
            )}
            <div>
              <dt className="label muted">Atendimento</dt>
              <dd className="mt-1">{site.contact.hours}</dd>
            </div>
          </dl>
          <MediaReveal className="mt-14 hidden aspect-[4/5] lg:block" from="bottom">
            <Picture name="suite-penteadeira-2" alt="Suíte com painel ripado e penteadeira, renderização digital" sizes="40vw" />
          </MediaReveal>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-28">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
