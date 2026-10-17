"use client";
import { useState } from "react";
import { Picture } from "@/components/ui/Picture";

/**
 * Imagem de capa que troca para uma segunda imagem do projeto ao passar o mouse sobre o card (.group).
 * A segunda só é baixada no primeiro passar do mouse, e só aparece depois de carregada.
 */
export function SwapPicture({ name, second, alt, sizes }: { name: string; second?: string; alt: string; sizes?: string }) {
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  return (
    <>
      <Picture name={name} alt={alt} sizes={sizes} />
      {second && armed && (
        <Picture name={second} alt="" sizes={sizes} priority className={`swap-img ${ready ? "swap-ready" : ""}`} onLoad={() => setReady(true)} />
      )}
      {second && !armed && <span aria-hidden className="absolute inset-0" onPointerEnter={(e) => e.pointerType === "mouse" && setArmed(true)} />}
    </>
  );
}
