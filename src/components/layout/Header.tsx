"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { TLink } from "@/components/motion/Transition";
import { Logo } from "./Logo";
import { MenuOverlay } from "./MenuOverlay";

/**
 * Cabeçalho: começa integrado ao hero (transparente, texto claro) e assume fundo
 * translúcido ao rolar. Some ao rolar para baixo e volta ao rolar para cima.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [overlayPage, setOverlayPage] = useState(true);
  const [ambientDark, setAmbientDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOverlayPage(!!document.querySelector("[data-hero-overlay]"));
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 320 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    const mo = new MutationObserver(() => setAmbientDark(document.body.dataset.ambient === "dark"));
    mo.observe(document.body, { attributes: true, attributeFilter: ["data-ambient"] });
    setAmbientDark(document.body.dataset.ambient === "dark");
    return () => {
      window.removeEventListener("scroll", on);
      mo.disconnect();
    };
  }, [pathname]);

  const transparent = overlayPage && !scrolled;
  const inverse = transparent || ambientDark;

  return (
    <>
      <a href="#conteudo" className="label sr-only z-[100] bg-marfim p-3 text-carvao focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Pular para o conteúdo
      </a>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color,backdrop-filter] duration-700 ease-[cubic-bezier(.22,.8,.2,1)]"
        style={{
          transform: hidden && !open ? "translateY(-100%)" : "translateY(0)",
          paddingTop: "env(safe-area-inset-top, 0px)",
          color: inverse ? "var(--color-marfim)" : "var(--color-carvao)",
          backgroundColor: transparent ? "transparent" : "color-mix(in srgb, var(--bg) 84%, transparent)",
          backdropFilter: transparent ? "none" : "blur(14px) saturate(1.1)",
          WebkitBackdropFilter: transparent ? "none" : "blur(14px) saturate(1.1)",
          borderBottom: `1px solid ${transparent ? "rgb(245 243 238 / 0.18)" : "var(--line)"}`,
        }}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <TLink href="/" label="Início" aria-label="Luchese Arquitetura, página inicial" className="shrink-0">
            <Logo inverse={inverse} />
          </TLink>
          <nav aria-label="Principal" className="hidden xl:block">
            <ul className="flex items-center gap-11">
              {nav.map((l) => {
                const active = !l.href.includes("#") && pathname.startsWith(l.href);
                return (
                  <li key={l.href}>
                    <TLink href={l.href} label={l.label} className="label link-draw" aria-current={active ? "page" : undefined}>
                      {l.label}
                    </TLink>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-7">
            <TLink href="/contato" label="Contato" className="label link-draw hidden md:inline-flex">
              Iniciar um projeto <span aria-hidden>↗</span>
            </TLink>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-overlay"
              className="label group flex items-center gap-3"
            >
              <span>Menu</span>
              <span aria-hidden className="relative block h-[9px] w-[26px]">
                <span className="absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 group-hover:translate-x-1" />
                <span className="absolute bottom-0 left-0 h-px w-[70%] bg-current transition-[width] duration-500 group-hover:w-full" />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
