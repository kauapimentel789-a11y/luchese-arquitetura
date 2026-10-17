"use client";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { Picture } from "@/components/ui/Picture";
import { useTransition } from "@/components/motion/Transition";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { whatsappHref } from "@/lib/whatsapp";

/** Menu em tela cheia: cortina que desce, links monumentais e prévia de projetos ao passar o cursor. */
export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { navigate } = useTransition();
  const wa = whatsappHref();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    if (open) {
      setMounted(true);
      window.__lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      gsap.set(el, { display: "block" });
      const tl = gsap.timeline();
      tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0 : 0.9, ease: "power4.inOut" });
      tl.fromTo(
        el.querySelectorAll("[data-menu-item]"),
        { yPercent: 110 },
        { yPercent: 0, duration: reduced ? 0 : 1.1, ease: "expo.out", stagger: 0.06 },
        reduced ? 0 : 0.45,
      );
      tl.fromTo(el.querySelectorAll("[data-menu-fade]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05 }, reduced ? 0 : 0.7);
      setTimeout(() => el.querySelector<HTMLElement>("[data-menu-first]")?.focus(), 400);
    } else if (mounted) {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      gsap.to(el, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: reduced ? 0 : 0.75,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && root.current) {
        const f = root.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (href: string, label: string) => {
    onClose();
    setTimeout(() => navigate(href, label), 350);
  };

  return (
    <div
      ref={root}
      id="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] hidden overflow-y-auto bg-carvao text-marfim"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      data-lenis-prevent
    >
      <div className="wrap flex min-h-full flex-col pt-[env(safe-area-inset-top,0px)]">
        <div className="flex h-[var(--header-h)] items-center justify-between">
          <span className="label opacity-60" data-menu-fade>
            ( menu )
          </span>
          <button type="button" onClick={onClose} className="label link-draw" data-menu-fade>
            Fechar <span aria-hidden>×</span>
          </button>
        </div>

        <div className="grid flex-1 grid-cols-12 items-center gap-x-6 py-10">
          <nav aria-label="Menu principal" className="col-span-12 lg:col-span-7">
            <ul className="space-y-1">
              {nav.map((l, i) => (
                <li key={l.href} className="overflow-hidden" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)}>
                  <a
                    href={l.href}
                    data-menu-item
                    data-menu-first={i === 0 ? "" : undefined}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey) return;
                      e.preventDefault();
                      go(l.href, l.label);
                    }}
                    className="group flex items-baseline gap-5 py-1 md:gap-8"
                  >
                    <span className="label w-8 shrink-0 text-bronze-claro tabular">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display text-[clamp(2.9rem,8.4vw,7.4rem)] transition-[transform,color] duration-700 ease-[cubic-bezier(.22,.8,.2,1)] group-hover:translate-x-4 group-hover:italic group-focus-visible:translate-x-4">
                      {l.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="relative col-span-5 hidden aspect-[4/5] max-h-[68vh] self-center justify-self-end lg:block lg:w-full" data-menu-fade aria-hidden>
            {nav.map((l, i) => (
              <div
                key={l.href}
                className="media absolute inset-0 transition-[opacity,clip-path] duration-[900ms] ease-[cubic-bezier(.22,.8,.2,1)]"
                style={{ opacity: hover === i ? 1 : 0, clipPath: hover === i ? "inset(0 0 0 0)" : "inset(6% 6% 6% 6%)" }}
              >
                <Picture name={l.image} alt="" sizes="40vw" />
              </div>
            ))}
            <p className="label absolute -bottom-8 left-0 opacity-60">Renderização digital</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 border-t border-white/15 py-8 sm:grid-cols-3" data-menu-fade>
          <div>
            <p className="label mb-2 opacity-50">Estúdio</p>
            <p>{site.contact.city}</p>
            <p className="opacity-60">{site.contact.hours}</p>
          </div>
          <div>
            <p className="label mb-2 opacity-50">Contato</p>
            {site.contact.phone && <p>{site.contact.phone}</p>}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="link-draw">
                WhatsApp
              </a>
            )}
          </div>
          <div className="sm:text-right">
            <button type="button" onClick={() => go("/contato", "Contato")} className="btn btn-light">
              <span>Iniciar um projeto</span> <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
