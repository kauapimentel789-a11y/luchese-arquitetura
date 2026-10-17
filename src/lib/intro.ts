/**
 * Coordena a tela de abertura com o restante do site.
 * O script em <head> (introBootScript) decide antes da primeira pintura se a abertura toca:
 * só na primeira página da visita (sessionStorage; sem ele, o referrer do próprio site serve de pista).
 * html[data-intro] vale "play", "done" ou "skip".
 */
export const INTRO_KEY = "luchese-intro";
export const INTRO_EVENT = "intro:done";
export const FOCO_KEY = "luchese-foco";
export type Foco = "interiores" | "arquitetura";

export const introBootScript = `(function(){var d=document.documentElement,s="play";try{if(sessionStorage.getItem("${INTRO_KEY}"))s="skip"}catch(e){try{if(document.referrer&&new URL(document.referrer).origin===location.origin)s="skip"}catch(e2){}}d.dataset.intro=s;try{var f=sessionStorage.getItem("${FOCO_KEY}");if(f)d.dataset.foco=f}catch(e){}})();`;

export function introPending() {
  return typeof document !== "undefined" && document.documentElement.dataset.intro === "play";
}

/** Executa cb quando a abertura terminar (ou imediatamente, se ela não estiver tocando). */
export function onIntroDone(cb: () => void) {
  if (!introPending()) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, cb);
}

export function finishIntro() {
  document.documentElement.dataset.intro = "done";
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/** Guarda o caminho escolhido na abertura (interiores ou arquitetura externa). */
export function setFoco(f: Foco) {
  document.documentElement.dataset.foco = f;
  try {
    sessionStorage.setItem(FOCO_KEY, f);
  } catch {}
}

export function getFoco(): Foco | undefined {
  if (typeof document === "undefined") return undefined;
  const f = document.documentElement.dataset.foco;
  return f === "interiores" || f === "arquitetura" ? f : undefined;
}
