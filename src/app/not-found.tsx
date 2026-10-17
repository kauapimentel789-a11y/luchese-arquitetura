import { TLink } from "@/components/motion/Transition";

export default function NotFound() {
  return (
    <div data-ambient="light" className="wrap flex min-h-[80svh] flex-col justify-end pb-[12vh] pt-[calc(var(--header-h)+10vh)]">
      <p className="label mb-6">( erro 404 )</p>
      <h1 className="display t-xl max-w-[14ch]">Este espaço ainda não foi projetado.</h1>
      <p className="mt-8 muted">A página que você procurou não existe ou mudou de endereço.</p>
      <div className="mt-10">
        <TLink href="/" label="Início" className="btn btn-dark">
          <span>Voltar ao início</span>
          <span className="btn-arrow">→</span>
        </TLink>
      </div>
    </div>
  );
}
