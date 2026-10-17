import type { Metadata } from "next";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { RevealLines } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Projetos de interiores, marcenaria, espaços comerciais e áreas externas da Luchese Arquitetura, em Joinville.",
};

export default function ProjetosPage() {
  return (
    <div data-ambient="light" className="wrap pb-[var(--section)] pt-[calc(var(--header-h)+12vh)]">
      <div className="grid-12 mb-20 gap-y-8">
        <p className="label col-span-12">( portfólio )</p>
        <RevealLines as="h1" trigger="load" delay={0.3} className="display t-mega col-span-12 lg:col-span-10" lines={["Projetos", <em key="e">selecionados</em>]} />
        <p className="col-span-12 max-w-[52ch] muted lg:col-span-5 lg:col-start-8">
          Projetos de interiores, marcenaria e reforma desenvolvidos pelo escritório. As imagens são renderizações digitais dos projetos, não fotografias de
          obras construídas.
        </p>
      </div>
      <ProjectIndex />
    </div>
  );
}
