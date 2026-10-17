/**
 * Portfólio.
 * IMPORTANTE: todos os projetos abaixo são estudos conceituais criados para demonstrar o site.
 * As imagens são renderizações digitais produzidas para esta apresentação (não são fotos de obras).
 * Substitua por projetos reais do escritório e mude `conceptual` para `false` quando aplicável.
 */

export type Category = "Residencial" | "Interiores" | "Comercial" | "Hospitalidade" | "Conceitual";

export const categories: Category[] = ["Residencial", "Interiores", "Comercial", "Hospitalidade", "Conceitual"];

export type Chapter = {
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
  layout?: "full" | "split" | "inset";
};

export type Project = {
  slug: string;
  index: string;
  name: string;
  category: Category;
  location: string;
  year: string;
  /** Marca o projeto como estudo/demonstração no site. */
  conceptual: boolean;
  tagline: string;
  description: string;
  concept: string;
  materials: string[];
  cover: string;
  gallery: { image: string; caption: string }[];
  /** Ficha técnica: pares rótulo/valor livres e editáveis. */
  specs: { label: string; value: string }[];
  chapters: Chapter[];
  /** Planta esquemática exibida na página (ver components/project/PlanDiagram). */
  plan?: "mirante" | "patio" | "pavilion";
};

export const projects: Project[] = [
  {
    slug: "residencia-mirante",
    index: "01",
    name: "Residência Mirante",
    category: "Residencial",
    location: "Itu, SP",
    year: "2026",
    conceptual: true,
    tagline: "Um volume de concreto suspenso sobre o terreno, aberto para o vale.",
    description:
      "Residência unifamiliar implantada sobre um platô de pedra. O pavimento social é um pavilhão de vidro protegido por um volume de concreto que avança sobre o jardim e a piscina, criando sombra e uma moldura contínua para a paisagem.",
    concept:
      "Duas peças, dois pesos. Embaixo, transparência e chão de pedra: a casa se estende até a borda da piscina. Em cima, um volume introspectivo de concreto aparente, filtrado por brises de madeira, guarda os quartos e se abre ao vale em uma única janela horizontal.",
    materials: ["Concreto aparente com fôrma de tábua", "Pedra natural em fiadas", "Travertino", "Freijó", "Vidro extra-clear", "Esquadrias em alumínio grafite"],
    cover: "mirante-hero",
    gallery: [
      { image: "mirante-hero", caption: "Fachada principal ao fim da tarde" },
      { image: "mirante-pool", caption: "Piscina de borda infinita e deck em madeira" },
      { image: "mirante-corner", caption: "Balanço do volume superior" },
      { image: "mirante-living", caption: "Estar integrado ao jardim" },
      { image: "mirante-dusk", caption: "A casa iluminada na hora azul" },
      { image: "mirante-aerial", caption: "Implantação no platô" },
    ],
    specs: [
      { label: "Programa", value: "Residência unifamiliar, 4 suítes" },
      { label: "Área construída", value: "[a definir] m²" },
      { label: "Terreno", value: "[a definir] m²" },
      { label: "Pavimentos", value: "2" },
      { label: "Estrutura", value: "Concreto armado com balanço de 4 m" },
      { label: "Status", value: "Estudo conceitual" },
    ],
    chapters: [
      {
        eyebrow: "01 (o terreno)",
        title: "Começamos pelo horizonte.",
        text: "O platô natural, voltado para o poente, definiu a implantação: a casa se alinha ao vale e deixa a encosta arborizada às suas costas. A pedra retirada na terraplenagem volta como embasamento.",
        image: "mirante-aerial",
        layout: "split",
      },
      {
        eyebrow: "02 (o volume)",
        title: "Um peso que parece flutuar.",
        text: "O volume superior avança quatro metros além do apoio. A laje de concreto vira beiral, sombreia o vidro no verão e enquadra o jardim como uma pintura horizontal.",
        image: "mirante-corner",
        layout: "inset",
      },
      {
        eyebrow: "03 (a luz)",
        title: "Do fim da tarde à hora azul.",
        text: "Os brises de freijó filtram o sol baixo nos quartos. À noite, o pavimento térreo se torna uma lanterna sobre a água, e a piscina devolve a casa em reflexo.",
        image: "mirante-dusk",
        layout: "full",
      },
    ],
    plan: "mirante",
  },
  {
    slug: "casa-pedra-alta",
    index: "02",
    name: "Casa Pedra Alta",
    category: "Residencial",
    location: "Campos do Jordão, SP",
    year: "2025",
    conceptual: true,
    tagline: "Pedra da serra e madeira carbonizada para o clima frio.",
    description:
      "Casa de campo composta por dois volumes: uma barra longa em pedra local, com a área social, e um volume de madeira carbonizada com telhado inclinado, que abriga os quartos e responde à chuva e ao frio da serra.",
    concept:
      "Abrigo e abertura. Paredes espessas de pedra acumulam calor; os panos de vidro se voltam para o norte e para a vista das araucárias.",
    materials: ["Pedra local", "Madeira carbonizada (shou sugi ban)", "Cobertura metálica", "Pinus tratado"],
    cover: "pedra_alta-ext",
    gallery: [
      { image: "pedra_alta-ext", caption: "Os dois volumes no campo" },
      { image: "pedra_alta-entry", caption: "Parede de pedra e varanda" },
    ],
    specs: [
      { label: "Programa", value: "Casa de campo, 3 suítes" },
      { label: "Área construída", value: "[a definir] m²" },
      { label: "Status", value: "Estudo conceitual" },
    ],
    chapters: [
      {
        eyebrow: "01 (abrigo)",
        title: "Paredes que guardam o calor.",
        text: "A barra de pedra, com sessenta centímetros de espessura, protege a área social dos ventos do sul e libera a fachada norte para a luz.",
        image: "pedra_alta-entry",
        layout: "split",
      },
    ],
    plan: "patio",
  },
  {
    slug: "apartamento-jardins",
    index: "03",
    name: "Apartamento Jardins",
    category: "Interiores",
    location: "São Paulo, SP",
    year: "2025",
    conceptual: true,
    tagline: "Forro de ripas, travertino e luz da tarde.",
    description:
      "Reforma de interiores de um apartamento térreo com jardim privativo. A planta foi integrada, e um forro contínuo de ripas de carvalho organiza estar, jantar e cozinha sob uma mesma linha.",
    concept:
      "Uma única superfície para o chão e outra para o teto. Entre elas, peças de marcenaria e uma ilha de pedra escura que ancora a cozinha no centro da casa.",
    materials: ["Travertino", "Carvalho", "Nogueira", "Pedra escura polida", "Linho", "Bronze escovado"],
    cover: "jardins-kitchen",
    gallery: [
      { image: "jardins-kitchen", caption: "Ilha em pedra e pendentes em bronze" },
      { image: "jardins-living", caption: "Estar voltado para o jardim" },
    ],
    specs: [
      { label: "Programa", value: "Reforma de interiores" },
      { label: "Área", value: "[a definir] m²" },
      { label: "Escopo", value: "Layout, marcenaria, iluminação e curadoria" },
      { label: "Status", value: "Estudo conceitual" },
    ],
    chapters: [
      {
        eyebrow: "01 (o centro)",
        title: "A cozinha como lugar de encontro.",
        text: "A ilha de pedra concentra preparo e refeição rápida. Os pendentes em bronze marcam o eixo da planta e aquecem a luz à noite.",
        image: "jardins-living",
        layout: "split",
      },
    ],
    plan: "patio",
  },
  {
    slug: "atelier-sete",
    index: "04",
    name: "Atelier Sete",
    category: "Comercial",
    location: "Campinas, SP",
    year: "2024",
    conceptual: true,
    tagline: "Espaço de trabalho entre pilares de concreto e vidro canelado.",
    description:
      "Escritório em laje corrida, com estrutura aparente. A sala de reunião é uma caixa de vidro canelado que dá privacidade sem bloquear a luz, e uma mesa longa de carvalho concentra o trabalho coletivo.",
    concept: "Deixar a estrutura à vista e desenhar só o necessário: luz, acústica e lugares de encontro informais.",
    materials: ["Concreto aparente", "Vidro canelado", "Carvalho", "Aço preto"],
    cover: "atelier-wide",
    gallery: [{ image: "atelier-wide", caption: "Salão de trabalho e sala de reunião" }],
    specs: [
      { label: "Programa", value: "Escritório corporativo" },
      { label: "Área", value: "[a definir] m²" },
      { label: "Status", value: "Estudo conceitual" },
    ],
    chapters: [],
  },
  {
    slug: "pavilhao-do-lago",
    index: "05",
    name: "Pavilhão do Lago",
    category: "Hospitalidade",
    location: "Bragança Paulista, SP",
    year: "2024",
    conceptual: true,
    tagline: "Um pavilhão leve em madeira e aço sobre a água.",
    description:
      "Pavilhão de convivência para uma pousada à beira de um lago. A cobertura de madeira apoia-se em pilares finos de aço, e o deck avança sobre a água com degraus para o banho.",
    concept: "Uma cobertura e um chão. Tudo o mais é paisagem refletida.",
    materials: ["Cumaru", "Aço carbono pintado", "Vidro", "Linho"],
    cover: "lago-wide",
    gallery: [
      { image: "lago-wide", caption: "O pavilhão ao amanhecer" },
      { image: "lago-deck", caption: "Varanda sob a cobertura" },
    ],
    specs: [
      { label: "Programa", value: "Pavilhão de convivência para pousada" },
      { label: "Área coberta", value: "[a definir] m²" },
      { label: "Status", value: "Estudo conceitual" },
    ],
    chapters: [
      {
        eyebrow: "01 (a margem)",
        title: "Um chão sobre a água.",
        text: "O deck se projeta sobre o lago e desce em degraus até a lâmina d'água, convidando ao banho ao amanhecer.",
        image: "lago-deck",
        layout: "split",
      },
    ],
    plan: "pavilion",
  },
  {
    slug: "estudo-planos",
    index: "06",
    name: "Estudo Planos",
    category: "Conceitual",
    location: "Pesquisa do estúdio",
    year: "2026",
    conceptual: true,
    tagline: "Planos de concreto, sombra e um espelho d'água.",
    description:
      "Exercício de composição espacial: cinco planos de concreto e uma laje definem percursos, recintos e sombras ao redor de um espelho d'água.",
    concept: "Investigar como poucos elementos, bem proporcionados, bastam para criar lugar.",
    materials: ["Concreto aparente", "Água", "Cascalho", "Gramíneas nativas"],
    cover: "planos-wide",
    gallery: [
      { image: "planos-wide", caption: "Os planos ao entardecer" },
      { image: "planos-close", caption: "Recinto e espelho d'água" },
    ],
    specs: [
      { label: "Natureza", value: "Pesquisa de forma e luz" },
      { label: "Status", value: "Estudo conceitual" },
    ],
    chapters: [],
  },
];

export const featured = projects[0];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
