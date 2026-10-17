/**
 * Portfólio.
 * Projetos de interiores do escritório, apresentados com renderizações digitais (não são fotos de obra).
 * Não há local, ano ou cliente cadastrados: quando houver, acrescente em `specs`.
 */

export type Category = "Interiores" | "Comercial" | "Áreas externas";

export const categories: Category[] = ["Interiores", "Comercial", "Áreas externas"];

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
  /** Ambientes do projeto, em uma linha. */
  rooms: string;
  /** O que o escritório entregou. */
  scope: string;
  tagline: string;
  description: string;
  concept: string;
  materials: string[];
  cover: string;
  gallery: { image: string; caption: string }[];
  /** Ficha técnica: pares rótulo/valor livres e editáveis. */
  specs: { label: string; value: string }[];
  chapters: Chapter[];
};

export const projects: Project[] = [
  {
    slug: "casa-muxarabi",
    index: "01",
    name: "Casa Muxarabi",
    category: "Interiores",
    rooms: "Estar, jantar, cozinha e escada",
    scope: "Interiores e marcenaria",
    tagline: "Estar, jantar e cozinha em um só espaço, costurados pela marcenaria.",
    description:
      "Projeto de interiores para uma área social integrada. Uma parede de madeira acompanha a escada e recebe a TV, as prateleiras suspensas e os armários baixos; do outro lado, a cozinha em tom areia se abre para a mesa e a ilha.",
    concept:
      "Um material só, usado com intenção. O muxarabi de madeira filtra a vista entre os ambientes sem fechá-los, e a cristaleira com perfis escuros e luz embutida vira a peça de destaque do percurso até a escada.",
    materials: ["Painel ripado em madeira clara", "Muxarabi de madeira", "Marcenaria laqueada areia", "Cristaleira com perfil preto", "Fita de LED embutida", "Prateleiras em metal preto"],
    cover: "living-3",
    gallery: [
      { image: "living-3", caption: "Estar integrado à cozinha" },
      { image: "living-2", caption: "Ilha com banquetas e sofá orgânico" },
      { image: "living-4", caption: "Cristaleira iluminada e escada" },
      { image: "living-1", caption: "Painel de madeira sob a escada" },
      { image: "living-5", caption: "Armários baixos e prateleiras suspensas" },
    ],
    specs: [
      { label: "Ambientes", value: "Estar, jantar, cozinha e escada" },
      { label: "Escopo", value: "Interiores e marcenaria" },
      { label: "Imagens", value: "Renderizações digitais" },
    ],
    chapters: [
      {
        eyebrow: "( integração )",
        title: "Uma sala que não precisa de paredes",
        text: "Estar, jantar e cozinha dividem o mesmo piso claro e a mesma paleta. O que separa um uso do outro é a altura da marcenaria e a luz, não uma parede.",
        image: "living-2",
        layout: "split",
      },
      {
        eyebrow: "( o percurso )",
        title: "A escada como parte do móvel",
        text: "O painel de madeira sobe junto com a escada e recebe TV, nichos e prateleiras de metal. A circulação vira parte da composição da sala.",
        image: "living-5",
        layout: "full",
      },
      {
        eyebrow: "( detalhe )",
        title: "Luz dentro da marcenaria",
        text: "A cristaleira de vidro com perfis pretos tem iluminação em cada prateleira e marca a passagem entre a cozinha e a escada.",
        image: "living-4",
        layout: "inset",
      },
    ],
  },
  {
    slug: "cozinha-mesa-redonda",
    index: "02",
    name: "Cozinha Aberta",
    category: "Interiores",
    rooms: "Cozinha, jantar e estar",
    scope: "Interiores e marcenaria",
    tagline: "Uma cozinha aberta, com mesa redonda e banco junto à ilha.",
    description:
      "Projeto de interiores para cozinha, jantar e estar integrados. A ilha com cooktop recebe um banco estofado curvo, e a mesa redonda de madeira fica no centro, entre a cozinha e o sofá.",
    concept:
      "Cozinha para ser usada e para receber. Armários de porta almofadada em tom areia, prateleiras abertas com luz e um painel ripado que esconde portas e recebe a TV.",
    materials: ["Portas almofadadas areia", "Painel ripado em madeira", "Bancada em pedra clara", "Banco estofado curvo", "Prateleiras com LED", "Coifa em inox"],
    cover: "cozinha-1",
    gallery: [
      { image: "cozinha-1", caption: "Jantar entre a cozinha e o estar" },
      { image: "cozinha-2", caption: "Ilha com banco curvo e mesa oval" },
      { image: "cozinha-3", caption: "Fornos embutidos e cristaleira" },
      { image: "cozinha-4", caption: "Bancada com prateleiras iluminadas" },
      { image: "cozinha-5", caption: "Vista do estar para a cozinha" },
    ],
    specs: [
      { label: "Ambientes", value: "Cozinha, jantar e estar" },
      { label: "Escopo", value: "Interiores e marcenaria" },
      { label: "Imagens", value: "Renderizações digitais" },
    ],
    chapters: [
      {
        eyebrow: "( a ilha )",
        title: "Cozinhar de frente para a casa",
        text: "O cooktop fica na ilha, voltado para a mesa. Do lado do jantar, o banco estofado acompanha a curva da bancada e economiza cadeiras.",
        image: "cozinha-2",
        layout: "split",
      },
      {
        eyebrow: "( armazenamento )",
        title: "Tudo à mão, nada à vista",
        text: "Fornos embutidos em coluna, armários até o teto e prateleiras abertas só onde vale mostrar.",
        image: "cozinha-3",
        layout: "full",
      },
    ],
  },
  {
    slug: "suite-closet-de-vidro",
    index: "03",
    name: "Suíte Closet",
    category: "Interiores",
    rooms: "Suíte e closet",
    scope: "Interiores e marcenaria",
    tagline: "Cabeceira em muxarabi e closet de vidro iluminado dentro do quarto.",
    description:
      "Projeto de interiores para uma suíte de casal. O closet deixou de ser um cômodo separado e virou uma vitrine de vidro com perfis escuros, ao lado da cama.",
    concept:
      "A parede da cabeceira é toda em muxarabi de madeira, que dá textura sem pesar. O closet iluminado equilibra o quarto do outro lado, e os armários lisos somem na parede.",
    materials: ["Muxarabi de madeira", "Cabeceira estofada", "Closet em vidro fumê", "Perfis em alumínio preto", "Marcenaria lisa off-white", "Iluminação embutida"],
    cover: "suite-closet-1",
    gallery: [
      { image: "suite-closet-1", caption: "Cabeceira em muxarabi e closet iluminado" },
      { image: "suite-closet-2", caption: "Detalhe do closet de vidro" },
      { image: "suite-closet-3", caption: "Vista lateral da cama" },
      { image: "suite-closet-4", caption: "Armários e bancada de apoio" },
    ],
    specs: [
      { label: "Ambientes", value: "Suíte e closet" },
      { label: "Escopo", value: "Interiores e marcenaria" },
      { label: "Imagens", value: "Renderizações digitais" },
    ],
    chapters: [
      {
        eyebrow: "( o closet )",
        title: "Roupa exposta como numa vitrine",
        text: "Portas de vidro fumê com luz interna. O closet organiza e, à noite, ilumina o quarto.",
        image: "suite-closet-2",
        layout: "inset",
      },
      {
        eyebrow: "( apoio )",
        title: "Armários que somem na parede",
        text: "Portas lisas do piso ao teto e uma pequena bancada suspensa completam o quarto sem roubar a atenção.",
        image: "suite-closet-4",
        layout: "split",
      },
    ],
  },
  {
    slug: "suite-penteadeira",
    index: "04",
    name: "Suíte Penteadeira",
    category: "Interiores",
    rooms: "Suíte com penteadeira",
    scope: "Interiores e marcenaria",
    tagline: "Painel ripado, penteadeira com espelho iluminado e cama de couro.",
    description:
      "Projeto de interiores para uma suíte com penteadeira integrada ao painel da TV. O painel ripado em madeira atravessa a parede e recebe a TV, a prateleira e o espelho.",
    concept:
      "Uma parede faz o trabalho de três móveis. Do outro lado, armários lisos e uma cama estofada em couro caramelo aquecem a paleta clara.",
    materials: ["Painel ripado em madeira", "Penteadeira suspensa", "Espelho com LED", "Cama estofada em couro", "Armários off-white", "Cortina de linho"],
    cover: "suite-penteadeira-1",
    gallery: [
      { image: "suite-penteadeira-1", caption: "Painel com TV e penteadeira" },
      { image: "suite-penteadeira-3", caption: "Cama em couro e armários" },
      { image: "suite-penteadeira-4", caption: "Cabeceira com luz indireta" },
      { image: "suite-penteadeira-2", caption: "Variação do painel" },
    ],
    specs: [
      { label: "Ambientes", value: "Suíte com penteadeira" },
      { label: "Escopo", value: "Interiores e marcenaria" },
      { label: "Imagens", value: "Renderizações digitais" },
    ],
    chapters: [
      {
        eyebrow: "( a parede )",
        title: "TV, prateleira e espelho no mesmo painel",
        text: "A penteadeira suspensa nasce do painel ripado, com espelho iluminado embutido entre as ripas.",
        image: "suite-penteadeira-1",
        layout: "split",
      },
      {
        eyebrow: "( descanso )",
        title: "Couro, linho e luz baixa",
        text: "A cabeceira recebe uma faixa de luz indireta. O resto do quarto fica calmo, em tons claros.",
        image: "suite-penteadeira-4",
        layout: "full",
      },
    ],
  },
  {
    slug: "quartos",
    index: "05",
    name: "Três Quartos",
    category: "Interiores",
    rooms: "Quarto infantil, quarto com escritório e quarto jovem",
    scope: "Interiores e marcenaria",
    tagline: "Três quartos, três idades, a mesma marcenaria sob medida.",
    description:
      "Projeto de interiores para três quartos. Um infantil, com cama baixa e penteadeira de espelho em arco; um quarto com bancada de estudo e escritório; e um quarto jovem em cinza e preto, com setup de games.",
    concept:
      "Cada quarto tem sua personalidade, mas todos seguem a mesma lógica: armário até o teto, bancada suspensa e luz embutida na marcenaria.",
    materials: ["Marcenaria off-white", "Painel ripado", "Espelho em arco", "Bancada de estudo em madeira", "Painel ripado preto", "Iluminação embutida"],
    cover: "quarto-office-1",
    gallery: [
      { image: "quarto-infantil-1", caption: "Infantil: armário e espelho dourado" },
      { image: "quarto-infantil-3", caption: "Infantil: penteadeira em arco" },
      { image: "quarto-infantil-2", caption: "Infantil: cama sob a janela" },
      { image: "quarto-office-1", caption: "Quarto com bancada de estudo" },
      { image: "quarto-office-2", caption: "Bancada e prateleiras iluminadas" },
      { image: "quarto-office-3", caption: "Escritório junto ao armário" },
      { image: "quarto-jovem-2", caption: "Jovem: cabeceira ripada escura" },
      { image: "quarto-jovem-3", caption: "Jovem: armário e setup de games" },
      { image: "quarto-jovem-1", caption: "Jovem: painel da TV" },
    ],
    specs: [
      { label: "Ambientes", value: "Três quartos" },
      { label: "Escopo", value: "Interiores e marcenaria" },
      { label: "Imagens", value: "Renderizações digitais" },
    ],
    chapters: [
      {
        eyebrow: "( infantil )",
        title: "Um quarto que cresce junto",
        text: "Cama baixa sob a janela, penteadeira com espelho em arco e armários que servem por muitos anos.",
        image: "quarto-infantil-3",
        layout: "split",
      },
      {
        eyebrow: "( estudo )",
        title: "Dormir e trabalhar no mesmo quarto",
        text: "Uma bancada em madeira corre ao lado da cama, com prateleiras iluminadas acima. O quarto vira escritório sem perder o descanso.",
        image: "quarto-office-1",
        layout: "full",
      },
      {
        eyebrow: "( jovem )",
        title: "Cinza, preto e um setup de games",
        text: "Cabeceira em ripado escuro, armário liso de parede a parede e uma bancada para o computador.",
        image: "quarto-jovem-3",
        layout: "inset",
      },
    ],
  },
  {
    slug: "banho-e-servico",
    index: "06",
    name: "Banho e Serviço",
    category: "Interiores",
    rooms: "Banheiros, lavanderia e hall de entrada",
    scope: "Interiores e marcenaria",
    tagline: "Os ambientes de todo dia, desenhados com o mesmo cuidado da sala.",
    description:
      "Projeto de interiores para banheiros, lavanderia e hall. Gabinetes em madeira, metais pretos e espelhos com luz no banho; armários até o teto e bancada em L na lavanderia.",
    concept:
      "Áreas pequenas pedem marcenaria precisa. Cada centímetro tem função, e a mesma madeira dos outros ambientes leva o projeto até os cômodos de serviço.",
    materials: ["Gabinete em madeira", "Metais pretos", "Espelho com LED", "Box de vidro", "Porcelanato cinza", "Marcenaria off-white"],
    cover: "banheiro-2",
    gallery: [
      { image: "banheiro-2", caption: "Banheiro com cuba de apoio e metais pretos" },
      { image: "banheiro-1", caption: "Espelho iluminado e gabinete em madeira" },
      { image: "banheiro-3", caption: "Lavabo com nicho" },
      { image: "lavanderia-2", caption: "Lavanderia com bancada em L" },
      { image: "lavanderia-1", caption: "Varal e prateleiras" },
      { image: "lavanderia-3", caption: "Armários até o teto" },
      { image: "hall-2", caption: "Hall de entrada com nicho iluminado" },
    ],
    specs: [
      { label: "Ambientes", value: "Banheiros, lavanderia e hall" },
      { label: "Escopo", value: "Interiores e marcenaria" },
      { label: "Imagens", value: "Renderizações digitais" },
    ],
    chapters: [
      {
        eyebrow: "( banho )",
        title: "Madeira, cinza e metal preto",
        text: "Gabinetes suspensos em madeira, cuba de apoio e um espelho com luz vertical. O box de vidro mantém o banheiro amplo.",
        image: "banheiro-1",
        layout: "split",
      },
      {
        eyebrow: "( serviço )",
        title: "Uma lavanderia organizada",
        text: "Bancada em L com máquina embutida, varal aéreo e armários até o teto para esconder o que não precisa aparecer.",
        image: "lavanderia-2",
        layout: "inset",
      },
    ],
  },
  {
    slug: "hall-bar-gourmet",
    index: "07",
    name: "Estante, Bar e Gourmet",
    category: "Interiores",
    rooms: "Estante com aquário, bar e área gourmet",
    scope: "Interiores e marcenaria",
    tagline: "Estante com aquário, balcão de bar e churrasqueira revestida em pedra.",
    description:
      "Projeto de interiores para os espaços de receber. Uma estante iluminada com aquário embutido, um balcão de bar com banquetas e uma área gourmet com churrasqueira revestida em pedra escura.",
    concept:
      "Peças de marcenaria feitas para conversar. A madeira e a luz embutida se repetem nos três ambientes, e a pedra escura dá peso à área gourmet.",
    materials: ["Estante em madeira com LED", "Aquário embutido", "Muxarabi de madeira", "Banquetas em madeira", "Revestimento em pedra escura", "Bancada preta"],
    cover: "gourmet-2",
    gallery: [
      { image: "gourmet-2", caption: "Área gourmet com churrasqueira" },
      { image: "gourmet-1", caption: "Churrasqueira em pedra e bancada" },
      { image: "hall-1", caption: "Estante com aquário embutido" },
      { image: "hall-3", caption: "Balcão de bar com banquetas" },
    ],
    specs: [
      { label: "Ambientes", value: "Estante, bar e área gourmet" },
      { label: "Escopo", value: "Interiores e marcenaria" },
      { label: "Imagens", value: "Renderizações digitais" },
    ],
    chapters: [
      {
        eyebrow: "( a estante )",
        title: "Um aquário dentro do móvel",
        text: "Nichos iluminados para coleções em cima, aquário no meio e portas de palhinha embaixo.",
        image: "hall-1",
        layout: "inset",
      },
      {
        eyebrow: "( gourmet )",
        title: "Pedra escura e luz quente",
        text: "A churrasqueira revestida em pedra é a peça central. Ao lado, bancada preta, prateleiras iluminadas e acesso direto ao quintal.",
        image: "gourmet-2",
        layout: "split",
      },
    ],
  },
  {
    slug: "salao-de-beleza",
    index: "08",
    name: "Salão de Beleza",
    category: "Comercial",
    rooms: "Recepção, atendimento e lavatório",
    scope: "Interiores comerciais",
    tagline: "Espelhos ovais iluminados, ripado de madeira e poltronas em tom terracota.",
    description:
      "Projeto de interiores para um salão de beleza. Recepção com balcão ripado, estações com espelhos ovais de LED, estantes de produtos em arco e área de espera com poltronas.",
    concept:
      "Um espaço comercial que precisa vender e acolher. A luz dos espelhos valoriza quem senta na cadeira, e as estantes em arco transformam os produtos em vitrine.",
    materials: ["Balcão ripado em madeira", "Espelhos ovais com LED", "Estantes em arco", "Poltronas em veludo terracota", "Piso claro contínuo", "Plantas naturais"],
    cover: "salao-1",
    gallery: [
      { image: "salao-1", caption: "Recepção e estações de atendimento" },
      { image: "salao-2", caption: "Espelhos ovais e área de lavatório" },
      { image: "salao-3", caption: "Estantes em arco e espera" },
    ],
    specs: [
      { label: "Ambientes", value: "Recepção, atendimento e lavatório" },
      { label: "Escopo", value: "Interiores comerciais" },
      { label: "Imagens", value: "Renderizações digitais" },
    ],
    chapters: [
      {
        eyebrow: "( atendimento )",
        title: "A luz certa para quem senta na cadeira",
        text: "Cada estação tem um espelho oval com LED no contorno, que ilumina o rosto por igual.",
        image: "salao-2",
        layout: "full",
      },
      {
        eyebrow: "( vitrine )",
        title: "Produtos em exposição",
        text: "Estantes em arco ao lado da área de espera transformam o estoque em parte da decoração.",
        image: "salao-3",
        layout: "split",
      },
    ],
  },
  {
    slug: "area-de-lazer",
    index: "09",
    name: "Área de Lazer",
    category: "Áreas externas",
    rooms: "Piscina, deck e jantar externo",
    scope: "Reforma de área externa",
    tagline: "Piscina, deck de madeira e jardim tropical iluminado para a noite.",
    description:
      "Projeto para a área externa de uma casa: piscina com deck de madeira, mesa de jantar ao ar livre, sofá e um muro verde com arandelas que desenham a luz ao entardecer.",
    concept:
      "Transformar o quintal em mais um ambiente da casa. O muro ganhou plantas e luz, e o deck liga a piscina à mesa.",
    materials: ["Deck de madeira", "Piscina revestida", "Arandelas de facho duplo", "Jardim tropical", "Mobiliário externo", "Muro texturizado"],
    cover: "lazer-1",
    gallery: [
      { image: "lazer-1", caption: "Piscina e jantar externo ao entardecer" },
      { image: "lazer-2", caption: "Deck, sofá e jardim iluminado" },
    ],
    specs: [
      { label: "Ambientes", value: "Piscina, deck e jantar externo" },
      { label: "Escopo", value: "Reforma de área externa" },
      { label: "Imagens", value: "Renderizações digitais" },
    ],
    chapters: [
      {
        eyebrow: "( à noite )",
        title: "Um quintal pensado para o fim do dia",
        text: "Arandelas no muro, plantas tropicais e a água iluminada fazem da área de lazer um lugar para ficar depois que escurece.",
        image: "lazer-2",
        layout: "full",
      },
    ],
  },
];

export const featured = projects[0];

/** Segunda imagem do projeto, mostrada ao passar o mouse sobre o card. */
export function secondImage(p: Project) {
  return p.gallery.find((g) => g.image !== p.cover)?.image;
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
