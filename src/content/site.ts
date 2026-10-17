/**
 * Configuração central do site.
 * Tudo que é dado do escritório (contatos, redes, números, endereço) fica aqui.
 * Campos com `null` não são exibidos ou aparecem como "a confirmar" — nunca invente valores.
 */

export const site = {
  /** Nome exibido no título das páginas e no rodapé. */
  name: "Luchese Arquitetura",
  shortName: "Luchese",
  /** Descritor usado ao lado do logotipo. */
  descriptor: "Arquitetura & Interiores",
  /** Quando `true`, o cabeçalho usa o logotipo tipográfico temporário em vez das imagens da marca. */
  useTemporaryWordmark: false,
  temporaryWordmark: { name: "ATELIER", descriptor: "Architecture & Design" },

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://luchese-arquitetura.kaua-pimentel789.workers.dev",
  description:
    "Estúdio de arquitetura e interiores em Joinville, SC. Interiores, marcenaria sob medida, reforma de fachadas e áreas externas.",

  contact: {
    /** Telefone público, formato livre para exibição. */
    phone: "(47) 99266-8181" as string | null,
    /**
     * Número de WhatsApp no formato internacional, apenas dígitos (ex.: "5511999999999").
     * Pode ser definido também por NEXT_PUBLIC_WHATSAPP_NUMBER. `null` = botão oculto.
     */
    whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5547992668181") as string | null,
    whatsappMessage:
      "Olá! Conheci o trabalho do escritório pelo site e gostaria de conversar sobre um projeto.",
    /** Cidade-base do estúdio. Ajuste quando houver endereço confirmado. */
    city: "Joinville, SC",
    address: null as string | null,
    hours: "Atendimento com hora marcada",
  },

  social: [
    { label: "Instagram", href: null as string | null },
    { label: "LinkedIn", href: null as string | null },
    { label: "Pinterest", href: null as string | null },
  ],

  legal: {
    /** Razão social e CNPJ, quando informados. */
    company: null as string | null,
    cnpj: null as string | null,
    /** Registro do responsável técnico (CAU), quando informado. */
    cau: null as string | null,
  },
};

/**
 * Indicadores. `value: null` significa que o escritório ainda não informou o número —
 * o site mostra o campo como "a confirmar", sem animar ou inventar dados.
 */
export const figures: {
  label: string;
  value: number | null;
  prefix?: string;
  suffix?: string;
  note: string;
}[] = [
  { label: "Projetos desenvolvidos", value: null, suffix: "+", note: "residenciais, comerciais e interiores" },
  { label: "Anos de experiência", value: null, note: "de prática em arquitetura" },
  { label: "Cidades atendidas", value: null, note: "no Brasil" },
  { label: "Área projetada", value: null, suffix: " m²", note: "somando todos os projetos" },
];

export const nav = [
  { label: "Projetos", href: "/projetos", image: "cozinha-1" },
  { label: "O escritório", href: "/escritorio", image: "living-1" },
  { label: "Serviços", href: "/#servicos", image: "suite-closet-1" },
  { label: "Processo", href: "/#processo", image: "quarto-office-2" },
  { label: "Contato", href: "/contato", image: "lazer-1" },
] as const;
