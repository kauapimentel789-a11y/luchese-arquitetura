/** Conteúdo institucional: serviços, processo, materiais, equipe e valores. Edite livremente. */

export const services = [
  {
    index: "01",
    title: "Arquitetura residencial",
    text: "Casas novas do estudo de implantação ao projeto executivo: volumetria, fachadas, conforto ambiental e documentação para obra.",
    image: "mirante-pool",
  },
  {
    index: "02",
    title: "Arquitetura comercial",
    text: "Escritórios, lojas e espaços de atendimento que traduzem a identidade de cada marca em planta, luz e materiais.",
    image: "atelier-wide",
  },
  {
    index: "03",
    title: "Design de interiores",
    text: "Layout, marcenaria, iluminação, revestimentos e curadoria de mobiliário, do primeiro estudo ao último objeto.",
    image: "jardins-kitchen",
  },
  {
    index: "04",
    title: "Reformas e requalificação",
    text: "Leitura do que existe, decisão do que permanece e desenho do que muda, em casas, apartamentos e edifícios.",
    image: "jardins-living",
  },
  {
    index: "05",
    title: "Estudos de viabilidade",
    text: "Análise do terreno, da legislação e do programa para orientar a compra de um lote ou o início de um projeto.",
    image: "mirante-aerial",
  },
  {
    index: "06",
    title: "Desenvolvimento e acompanhamento",
    text: "Compatibilização com projetos complementares e visitas técnicas à obra, quando incluídas no contrato.",
    image: "pedra_alta-entry",
  },
];

export const process = [
  {
    index: "01",
    title: "Imersão e briefing",
    text: "Conversas, visita ao terreno ou ao imóvel e levantamento das necessidades, rotinas e expectativas de quem vai usar o espaço.",
    output: "Programa de necessidades",
  },
  {
    index: "02",
    title: "Conceito e estudo preliminar",
    text: "Primeiras ideias de implantação, volumetria e atmosfera, apresentadas em croquis, plantas e imagens.",
    output: "Estudo preliminar",
  },
  {
    index: "03",
    title: "Desenvolvimento do projeto",
    text: "O estudo aprovado ganha medidas, materiais e soluções técnicas, e é compatibilizado com os projetos complementares.",
    output: "Anteprojeto e projeto legal",
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
  { name: "Concreto aparente", note: "Fôrma de tábua, textura que guarda o desenho da madeira.", image: "mat-concreto" },
  { name: "Pedra natural", note: "Fiadas irregulares de pedra local, assentadas a seco.", image: "mat-pedra" },
  { name: "Madeira", note: "Ripas maciças que filtram a luz e aquecem o toque.", image: "macro-madeira" },
  { name: "Vidro", note: "Canelado ou extra-clear, para revelar ou velar.", image: "macro-vidro" },
  { name: "Metal", note: "Bronze escovado e aço escuro em perfis finos.", image: "macro-metal" },
  { name: "Vegetação", note: "Gramíneas nativas que movem a luz ao longo do dia.", image: "macro-vegetacao" },
];

/**
 * Equipe. Preencha nome, cargo, formação e registro apenas com dados reais.
 * `portrait: null` mostra uma moldura de retrato a ser substituída por foto profissional.
 */
export const team = [
  {
    name: "Nicolly Luchese",
    role: "Arquiteta e urbanista, fundadora",
    bio: "Conduz os projetos do estúdio da primeira conversa ao detalhe, nas escalas da casa, do interior e do jardim.",
    credentials: null as string | null,
    portrait: null as string | null,
  },
];

export const values = [
  { title: "Contexto", text: "Cada projeto começa no lugar: clima, vista, vizinhança e a história de quem vai morar ou trabalhar ali." },
  { title: "Matéria", text: "Poucos materiais, verdadeiros e bem detalhados, que envelhecem com dignidade." },
  { title: "Luz", text: "Desenhamos aberturas, beirais e superfícies pensando no percurso do sol ao longo do dia." },
  { title: "Proximidade", text: "Um estúdio pequeno, com atenção direta da arquiteta responsável em todas as etapas." },
];

export const specialties = ["Residências unifamiliares", "Interiores residenciais", "Espaços comerciais", "Áreas externas e paisagismo", "Reformas"];
