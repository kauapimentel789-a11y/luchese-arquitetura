import { asset } from "@/lib/asset";
import { site } from "@/content/site";

/** Assinatura da marca. Usa as imagens do logotipo Luchese ou o logotipo tipográfico temporário. */
export function Logo({ inverse, compact }: { inverse?: boolean; compact?: boolean }) {
  if (site.useTemporaryWordmark) {
    return (
      <span className="flex items-baseline gap-3 leading-none">
        <span className="font-sans text-[1.0625rem] font-normal tracking-[0.42em]">{site.temporaryWordmark.name}</span>
        {!compact && <span className="label hidden text-[0.625rem] opacity-70 sm:inline">{site.temporaryWordmark.descriptor}</span>}
      </span>
    );
  }
  const c = inverse ? "white" : "black";
  return (
    <span className="flex items-center gap-3.5 leading-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(`/brand/monogram-${c}.png`)} alt="" width={36} height={42} className="h-[2.125rem] w-auto" />
      {!compact && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset(`/brand/wordmark-${c}.png`)} alt="" width={110} height={40} className="h-[1.875rem] w-auto" />
      )}
      <span className="sr-only">{site.name}</span>
    </span>
  );
}
