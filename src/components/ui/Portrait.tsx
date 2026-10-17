/* eslint-disable @next/next/no-img-element */
import { asset } from "@/lib/asset";
type Person = { name: string; role: string; portrait: string | null; credentials?: string | null };

/**
 * Retrato profissional. Enquanto não houver foto (`portrait: null`), mostra uma moldura
 * com o monograma, sinalizando claramente que a imagem será substituída.
 */
export function Portrait({ person, className = "" }: { person: Person; className?: string }) {
  return (
    <figure className={className}>
      <div className="relative aspect-[4/5] overflow-hidden bg-pedra">
        {person.portrait ? (
          <img src={person.portrait} alt={`Retrato de ${person.name}`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-6 border border-[rgb(23_24_22/0.12)]">
            <img src={asset("/brand/monogram-black.png")} alt="" className="w-16 opacity-80" />
            <p className="label text-center text-[rgb(23_24_22/0.72)]">
              Retrato profissional
              <br />a ser incluído
            </p>
          </div>
        )}
      </div>
      <figcaption className="mt-4 border-t border-[var(--line)] pt-3">
        <p className="display t-md">{person.name}</p>
        <p className="label muted mt-2">{person.role}</p>
        {person.credentials && <p className="mt-1 text-[14px] muted">{person.credentials}</p>}
      </figcaption>
    </figure>
  );
}
