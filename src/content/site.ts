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

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lucheseararquitetura.com.br",
  description:
    "Estúdio de arquitetura e interiores. Projetamos espaços com identidade, propósito e uma relação singular entre matéria, luz e paisagem.",

  contact: {
    /** E-mail público exibido no rodapé e na página de contato. `null` = oculto. */
    email: null as string | null,
    /** Telefone público, formato livre para exibição. */
    phone: null as string | null,
    /**
     * Número de WhatsApp no formato internacional, apenas dígitos (ex.: "5511999999999").
     * Pode ser definido também por NEXT_PUBLIC_WHATSAPP_NUMBER. `null` = botão oculto.
     */
    whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null) as string | null,
    whatsappMessage:
      "Olá! Conheci o trabalho do escritório pelo site e gostaria de conversar sobre um projeto.",
    /** Cidade-base do estúdio. Ajuste quando houver endereço confirmado. */
    city: "São Paulo, SP",
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
  { label: "Projetos", href: "/projetos", image: "mirante-pool" },
  { label: "O escritório", href: "/escritorio", image: "jardins-kitchen" },
  { label: "Serviços", href: "/#servicos", image: "atelier-wide" },
  { label: "Processo", href: "/#processo", image: "planos-wide" },
  { label: "Contato", href: "/contato", image: "mirante-dusk" },
] as const;
