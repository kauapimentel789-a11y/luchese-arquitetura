"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { scrollToTarget } from "./SmoothScroll";
import { isStatic, staticHref } from "@/lib/asset";

type Ctx = { navigate: (href: string, label?: string) => void };
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });

/**
 * Transição cinematográfica entre páginas: uma cortina carvão sobe com o nome do destino,
 * a rota troca por baixo e a cortina se abre revelando a nova página.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const pending = useRef(false);

  const navigate = useCallback(
    (href: string, l?: string) => {
      const [path, hash] = href.split("#");
      const target = path || pathname;
      const here = isStatic ? (window as unknown as { __ROUTE__?: string }).__ROUTE__ ?? pathname : pathname;
      if (target === here || (isStatic && target.replace(/\/$/, "") === here.replace(/\/$/, ""))) {
        if (hash) {
          const el = document.getElementById(hash);
          if (el) scrollToTarget(el);
          history.replaceState(null, "", href);
        } else scrollToTarget(0);
        return;
      }
      const go = () => (isStatic ? window.location.assign(staticHref(href)) : router.push(href));
      if (prefersReducedMotion() || !panel.current) {
        go();
        return;
      }
      setLabel(l ?? "");
      pending.current = true;
      gsap.killTweensOf(panel.current);
      gsap.set(panel.current, { display: "flex", yPercent: 100 });
      gsap.to(panel.current, {
        yPercent: 0,
        duration: 0.85,
        ease: "power4.inOut",
        onComplete: go,
      });
      gsap.fromTo(panel.current.querySelector("[data-label]"), { yPercent: 120 }, { yPercent: 0, duration: 0.9, delay: 0.25, ease: "expo.out" });
    },
    [pathname, router],
  );

  useEffect(() => {
    if (!pending.current || !panel.current) return;
    pending.current = false;
    gsap.to(panel.current, {
      yPercent: -100,
      duration: 1.0,
      delay: 0.15,
      ease: "power4.inOut",
      onComplete: () => {
        gsap.set(panel.current, { display: "none" });
      },
    });
  }, [pathname]);

  // exportação estática: qualquer link interno vira navegação entre arquivos
  useEffect(() => {
    if (!isStatic) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!a || !href || !href.startsWith("/") || a.target === "_blank" || e.metaKey || e.ctrlKey || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      navigate(href, a.dataset.label);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [navigate]);

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      <div
        ref={panel}
        aria-hidden
        className="fixed inset-0 z-[90] hidden items-end bg-carvao text-marfim wrap pb-[8vh]"
        style={{ transform: "translateY(100%)" }}
      >
        <div className="overflow-hidden">
          <p data-label className="display t-xl">
            {label}
          </p>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionCtx);
}

type TLProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; label?: string; children: React.ReactNode };

/** Link interno que usa a transição de página. Mantém o comportamento padrão com Ctrl/Cmd/clique do meio. */
export function TLink({ href, label, children, onClick, ...rest }: TLProps) {
  const { navigate } = useTransition();
  return (
    <Link
      href={href}
      prefetch={isStatic ? false : undefined}
      data-label={label}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href, label);
      }}
    >
      {children}
    </Link>
  );
}
