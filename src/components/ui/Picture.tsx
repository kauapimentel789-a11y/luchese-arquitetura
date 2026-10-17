import manifest from "@/content/images.json";
import { asset } from "@/lib/asset";

type Entry = { w: number; h: number; widths: number[]; blur: string };
const images = manifest as Record<string, Entry>;

export function imageMeta(name: string) {
  return images[name];
}

export function imageSrc(name: string, width = 1800) {
  const m = images[name];
  if (!m) return "";
  const w = m.widths.find((x) => x >= width) ?? m.widths[m.widths.length - 1];
  return asset(`/images/${name}-${w}.webp`);
}

type Props = {
  name: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
};

/**
 * Imagem responsiva gerada a partir do manifesto de renderizações.
 * Usa srcset em WebP, placeholder desfocado e carregamento tardio fora da primeira dobra.
 */
export function Picture({ name, alt, sizes = "100vw", priority, className, imgClassName, style }: Props) {
  const m = images[name];
  if (!m) return null;
  const srcSet = m.widths.map((w) => `${asset(`/images/${name}-${w}.webp`)} ${w}w`).join(", ");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc(name, 1200)}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={m.w}
      height={m.h}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={imgClassName ?? className}
      style={{ backgroundImage: `url(${m.blur})`, backgroundSize: "cover", ...style }}
    />
  );
}
