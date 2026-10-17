import { z } from "zod";

export const projectTypes = ["Residência nova", "Reforma", "Interiores", "Comercial / corporativo", "Hospitalidade", "Estudo de viabilidade", "Outro"] as const;
export const budgets = ["Prefiro não informar", "Até R$ 500 mil", "R$ 500 mil a R$ 1,5 milhão", "R$ 1,5 a 3 milhões", "Acima de R$ 3 milhões"] as const;
export const timelines = ["Ainda sem data", "Nos próximos 3 meses", "Em 3 a 6 meses", "Em 6 a 12 meses", "Depois de 12 meses"] as const;

export const contactSchema = z.object({
  name: z.string({ error: "Informe seu nome." }).trim().min(2, "Informe seu nome.").max(120, "Nome muito longo."),
  email: z.string({ error: "Informe seu e-mail." }).trim().email("Informe um e-mail válido, como nome@dominio.com."),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .refine((v) => !v || v.replace(/\D/g, "").length >= 10, "Telefone incompleto: inclua o DDD."),
  projectType: z.enum(projectTypes, { message: "Escolha o tipo de projeto." }),
  city: z.string({ error: "Informe a cidade do projeto." }).trim().min(2, "Informe a cidade do projeto.").max(120),
  budget: z.enum(budgets).optional(),
  timeline: z.enum(timelines, { message: "Escolha um prazo estimado." }),
  message: z.string({ error: "Escreva uma mensagem." }).trim().min(20, "Conte um pouco mais sobre o projeto (mínimo de 20 caracteres).").max(4000, "Mensagem muito longa."),
  consent: z.literal(true, { message: "É preciso concordar com o uso dos dados para responder ao contato." }),
  /** campo-armadilha contra robôs: precisa ficar vazio */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
