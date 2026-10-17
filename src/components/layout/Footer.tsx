import { asset } from "@/lib/asset";
import { nav, site } from "@/content/site";
import { TLink } from "@/components/motion/Transition";
import { whatsappHref } from "@/lib/whatsapp";
import { BackToTop } from "./BackToTop";

export function Footer() {
  const wa = whatsappHref();
  const socials = site.social.filter((s) => s.href);
  const year = new Date().getFullYear();
  return (
    <footer className="bg-carvao text-marfim" data-ambient="dark">
      <div className="wrap pt-24 pb-10">
        <div className="grid grid-cols-12 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/logo-full-white.png")} alt={site.name} width={160} height={154} className="h-auto w-[132px]" />
            <p className="mt-10 max-w-sm text-[15px] leading-relaxed text-mineral">{site.description}</p>
          </div>
          <nav aria-label="Rodapé" className="col-span-6 lg:col-span-2">
            <p className="label mb-5 text-mineral">Navegação</p>
            <ul className="space-y-2.5">
              <li>
                <TLink href="/" label="Início" className="link-draw">
                  Início
                </TLink>
              </li>
              {nav.map((l) => (
                <li key={l.href}>
                  <TLink href={l.href} label={l.label} className="link-draw">
                    {l.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-6 lg:col-span-3">
            <p className="label mb-5 text-mineral">Contato</p>
            <ul className="space-y-2.5">
              <li>{site.contact.city}</li>
              {site.contact.address && <li>{site.contact.address}</li>}
              {site.contact.phone && <li>{site.contact.phone}</li>}
              {wa && (
                <li>
                  <a className="link-draw" href={wa} target="_blank" rel="noopener noreferrer">
                    WhatsApp ↗
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="col-span-12 lg:col-span-2">
            {socials.length > 0 && (
              <>
                <p className="label mb-5 text-mineral">Redes</p>
                <ul className="space-y-2.5">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a className="link-draw" href={s.href!} target="_blank" rel="noopener noreferrer">
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* assinatura decorativa em escala de fachada; SVG para não ser lida como texto */}
        <svg aria-hidden focusable="false" viewBox="0 0 1000 250" className="mt-24 block h-auto w-[min(100%,1100px)] select-none">
          <text x="-6" y="200" fill="rgb(245 243 238 / 0.07)" style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 268, letterSpacing: "-0.03em" }}>
            Luchese
          </text>
        </svg>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-6 text-[13px] text-mineral md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legal.company ?? site.name}
            {site.legal.cnpj && <> · CNPJ {site.legal.cnpj}</>}
            {site.legal.cau && <> · {site.legal.cau}</>}
          </p>
          <p>Projetos e imagens deste site são estudos conceituais e renderizações digitais.</p>
          <div className="flex items-center gap-6">
            <TLink href="/privacidade" label="Privacidade" className="link-draw">
              Privacidade
            </TLink>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
