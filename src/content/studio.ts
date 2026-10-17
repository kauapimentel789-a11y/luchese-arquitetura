/** Conteúdo institucional: serviços, processo, materiais, equipe e valores. Edite livremente. */

export const services = [
  {
    index: "01",
    title: "Design de interiores",
    text: "Layout, iluminação, revestimentos e curadoria de mobiliário, do primeiro estudo ao último objeto.",
    image: "cozinha-2",
  },
  {
    index: "02",
    title: "Marcenaria sob medida",
    text: "Painéis, cozinhas, closets, penteadeiras e estantes desenhados peça por peça, com iluminação embutida.",
    image: "suite-closet-2",
  },
  {
    index: "03",
    title: "Reforma de interiores",
    text: "Leitura do que existe, decisão do que permanece e desenho do que muda, em casas e apartamentos.",
    image: "living-5",
  },
  {
    index: "04",
    title: "Reforma de fachadas",
    text: "Uma nova cara para casas e pequenos edifícios: revestimentos, cores, esquadrias, iluminação e jardim de frente.",
    image: "lazer-2",
  },
  {
    index: "05",
    title: "Áreas externas e de lazer",
    text: "Piscina, deck, área gourmet e jardim pensados como mais um ambiente da casa.",
    image: "gourmet-2",
  },
  {
    index: "06",
    title: "Espaços comerciais",
    text: "Salões, lojas e espaços de atendimento que traduzem a identidade de cada marca em luz e materiais.",
    image: "salao-1",
  },
];

export const process = [
  {
    index: "01",
    title: "Imersão e briefing",
    text: "Conversas, visita ao imóvel e levantamento das necessidades, rotinas e expectativas de quem vai usar o espaço.",
    output: "Programa de necessidades",
  },
  {
    index: "02",
    title: "Conceito e estudo preliminar",
    text: "Primeiras ideias de layout, materiais e atmosfera, apresentadas em plantas e imagens 3D.",
    output: "Estudo preliminar",
  },
  {
    index: "03",
    title: "Desenvolvimento do projeto",
    text: "O estudo aprovado ganha medidas, materiais e soluções técnicas de iluminação, elétrica e hidráulica.",
    output: "Anteprojeto",
  },
  {
    index: "04",
    title: "Detalhamento técnico",
    text: "Desenhos executivos, detalhes de marcenaria, paginações e especificações para orçamento e obra.",
    output: "Projeto executivo",
  },
  {
    index: "05",
    title: "Acompanhamento e execução",
    text: "Visitas técnicas e apoio às decisões de obra. Etapa opcional, contratada à parte quando fizer sentido para o projeto.",
    output: "Quando contratado",
  },
];

export const materials = [
  { name: "Madeira", note: "Painéis e prateleiras que aquecem o toque e organizam a parede.", image: "mat-madeira" },
  { name: "Muxarabi", note: "Trama de madeira que filtra a vista sem fechar o ambiente.", image: "mat-muxarabi" },
  { name: "Pedra", note: "Superfícies de veio marcante para bancadas e revestimentos.", image: "mat-pedra" },
  { name: "Vidro e luz", note: "Cristaleiras e closets com perfis finos e iluminação embutida.", image: "mat-vidro" },
  { name: "Metal preto", note: "Metais e perfis escuros que desenham os detalhes.", image: "mat-metal" },
  { name: "Água e jardim", note: "Piscina iluminada e plantas tropicais nas áreas externas.", image: "mat-vegetacao" },
];

/**
 * Equipe. Preencha nome, cargo, formação e registro apenas com dados reais.
 * `portrait: null` mostra uma moldura de retrato a ser substituída por foto profissional.
 */
export const team = [
  {
    name: "Nicolly Luchese",
    role: "Arquiteta e urbanista, fundadora",
    bio: "Conduz os projetos do estúdio da primeira conversa ao detalhe da marcenaria, por dentro e por fora da casa.",
    credentials: null as string | null,
    portrait: null as string | null,
  },
];

export const values = [
  { title: "Contexto", text: "Cada projeto começa na casa que já existe e na história de quem vai morar ou trabalhar ali." },
  { title: "Matéria", text: "Poucos materiais, verdadeiros e bem detalhados, que envelhecem com dignidade." },
  { title: "Luz", text: "A iluminação é desenhada junto com a marcenaria, e a luz natural guia o layout." },
  { title: "Proximidade", text: "Um estúdio pequeno, com atenção direta da arquiteta responsável em todas as etapas." },
];

export const specialties = ["Interiores residenciais", "Marcenaria sob medida", "Reforma de fachadas", "Áreas externas e de lazer", "Espaços comerciais"];
