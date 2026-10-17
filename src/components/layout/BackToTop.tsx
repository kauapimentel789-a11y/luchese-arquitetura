"use client";
import { scrollToTarget } from "@/components/motion/SmoothScroll";

export function BackToTop() {
  return (
    <button type="button" className="link-draw" onClick={() => scrollToTarget(0)}>
      Voltar ao topo ↑
    </button>
  );
}
