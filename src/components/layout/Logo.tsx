import { asset } from "@/lib/asset";
import { site } from "@/content/site";

/** Assinatura da marca. Usa as imagens do logotipo Luchese ou o logotipo tipográfico temporário. */
export function Logo({ inverse, compact }: { inverse?: boolean; compact?: boolean }) {
  if (site.useTemporaryWordmark) {
    return (
      <span className="flex items-baseline gap-3 leading-none">
        <span className="font-sans text-[17px] font-normal tracking-[0.42em]">{site.temporaryWordmark.name}</span>
        {!compact && <span className="label hidden text-[10px] opacity-70 sm:inline">{site.temporaryWordmark.descriptor}</span>}
      </span>
    );
  }
  const c = inverse ? "white" : "black";
  return (
    <span className="flex items-center gap-3.5 leading-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(`/brand/monogram-${c}.png`)} alt="" width={36} height={42} className="h-[34px] w-auto" />
      {!compact && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset(`/brand/wordmark-${c}.png`)} alt="" width={110} height={40} className="h-[30px] w-auto" />
      )}
      <span className="sr-only">{site.name}</span>
    </span>
  );
}
