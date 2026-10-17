"use client";
import { Picture } from "@/components/ui/Picture";
import { TLink } from "@/components/motion/Transition";
import { RevealLines } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/MediaReveal";
import { whatsappHref } from "@/lib/whatsapp";

/** Encerramento: imagem de fundo, tipografia monumental e chamada para conversa. */
export function ClosingCTA() {
  const wa = whatsappHref();
  return (
    <section data-ambient="dark" className="relative overflow-hidden text-marfim" aria-labelledby="cta-title">
      <div className="absolute inset-0">
        <Parallax speed={8} className="absolute inset-[-10%_0]">
          <Picture name="lazer-2" alt="" sizes="100vw" className="h-full w-full object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,24,22,.85)_0%,rgba(23,24,22,.35)_45%,rgba(23,24,22,.9)_100%)]" />
      </div>
      <div className="wrap relative flex min-h-[100svh] flex-col justify-between py-[calc(var(--header-h)+6vh)]">
        <div className="flex justify-between gap-6 border-t border-white/20 pt-5">
          <p className="label whitespace-nowrap">08 ( contato )</p>
          <p className="label text-white/60 hidden text-right sm:block">Respondemos em até dois dias úteis</p>
        </div>
        <div>
          <RevealLines id="cta-title" className="display t-mega max-w-[15ch]" lines={["Vamos dar forma", <span key="k1">à sua <em>próxima</em></span>, "ideia?"]} />
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <TLink href="/contato" label="Contato" className="btn btn-light" data-cursor="Vamos conversar">
              <span>Iniciar uma conversa</span>
              <span className="btn-arrow">→</span>
            </TLink>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-light border-white/40">
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
