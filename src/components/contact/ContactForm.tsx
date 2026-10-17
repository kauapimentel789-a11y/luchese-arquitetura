"use client";
import { useState } from "react";
import { site } from "@/content/site";

export const projectTypes = ["Interiores", "Reforma de interiores", "Marcenaria sob medida", "Reforma de fachada", "Área externa e de lazer", "Comercial", "Outro"] as const;
export const budgets = ["Prefiro não informar", "Até R$ 50 mil", "R$ 50 a 150 mil", "R$ 150 a 300 mil", "Acima de R$ 300 mil"] as const;
export const timelines = ["Ainda sem data", "Nos próximos 3 meses", "Em 3 a 6 meses", "Em 6 a 12 meses", "Depois de 12 meses"] as const;

type Fields = "name" | "city" | "projectType" | "timeline" | "budget" | "message";

function validate(d: Record<Fields, string>) {
  const e: Partial<Record<Fields, string>> = {};
  if (d.name.trim().length < 2) e.name = "Informe seu nome.";
  if (d.city.trim().length < 2) e.city = "Informe a cidade do projeto.";
  if (!d.projectType) e.projectType = "Escolha o tipo de projeto.";
  if (!d.timeline) e.timeline = "Escolha um prazo estimado.";
  if (d.message.trim().length < 10) e.message = "Conte um pouco sobre o que você quer.";
  return e;
}

/** Monta a mensagem que o cliente envia pelo WhatsApp do escritório. */
function buildMessage(d: Record<Fields, string>) {
  const lines = [
    `Olá! Meu nome é ${d.name.trim()} e gostaria de conversar sobre um projeto.`,
    "",
    `*Tipo de projeto:* ${d.projectType}`,
    `*Cidade:* ${d.city.trim()}`,
    `*Prazo:* ${d.timeline}`,
  ];
  if (d.budget) lines.push(`*Investimento:* ${d.budget}`);
  lines.push("", "*O que eu quero:*", d.message.trim());
  return lines.join("\n");
}

/**
 * Formulário do projeto. Não guarda nada: ao enviar, abre o WhatsApp do escritório
 * com as respostas já escritas, e o cliente só confirma o envio por lá.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [opened, setOpened] = useState(false);
  const number = site.contact.whatsapp?.replace(/\D/g, "");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const d = Object.fromEntries((["name", "city", "projectType", "timeline", "budget", "message"] as Fields[]).map((k) => [k, String(fd.get(k) ?? "")])) as Record<Fields, string>;
    const errs = validate(d);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    if (!number) return;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(buildMessage(d))}`;
    // Sem "noopener" nas opções: com ele o navegador sempre devolve null e não dá para saber se abriu.
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
    setOpened(true);
  }

  const field = (name: Fields, label: string, input: React.ReactNode, opt?: boolean, wide?: boolean) => (
    <div className={`field ${wide ? "md:col-span-2" : ""}`} data-invalid={!!errors[name]}>
      <label htmlFor={`f-${name}`} className="label flex justify-between">
        <span>{label}</span>
        {opt && <span className="muted normal-case tracking-normal">opcional</span>}
      </label>
      {input}
      {errors[name] && (
        <p id={`e-${name}`} className="text-[14px] text-[#a5523c]">
          {errors[name]}
        </p>
      )}
    </div>
  );
  const aria = (name: Fields) => ({ id: `f-${name}`, name, "aria-invalid": !!errors[name] || undefined, "aria-describedby": errors[name] ? `e-${name}` : undefined });
  const options = (list: readonly string[], placeholder = true) => (
    <>
      <option value="" disabled={placeholder}>
        Selecione
      </option>
      {list.map((t) => (
        <option key={t}>{t}</option>
      ))}
    </>
  );

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onInput={(e) => {
        const name = (e.target as HTMLInputElement).name as Fields;
        if (errors[name])
          setErrors((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
          });
      }}
      className="grid gap-x-10 gap-y-10 md:grid-cols-2"
    >
      {field("name", "Nome", <input {...aria("name")} autoComplete="name" required />)}
      {field("city", "Cidade do projeto", <input {...aria("city")} autoComplete="address-level2" required />)}
      {field("projectType", "Tipo de projeto", <select {...aria("projectType")} defaultValue="" required>{options(projectTypes)}</select>)}
      {field("timeline", "Prazo estimado", <select {...aria("timeline")} defaultValue="" required>{options(timelines)}</select>)}
      {field("budget", "Faixa de investimento", <select {...aria("budget")} defaultValue="">{options(budgets, false)}</select>, true, true)}
      {field(
        "message",
        "O que você quer",
        <textarea {...aria("message")} rows={5} placeholder="Conte sobre o imóvel, os ambientes que imagina e o que é importante para você." required />,
        false,
        true,
      )}

      <div className="grid gap-5 md:col-span-2">
        <div>
          <button type="submit" className="btn btn-solid">
            <span>Enviar pelo WhatsApp</span>
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </button>
        </div>
        <p className="muted text-[14px]" role="status">
          {opened
            ? "Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em enviar por lá."
            : `Ao enviar, o WhatsApp abre com as suas respostas já escritas para o escritório${site.contact.phone ? `, no ${site.contact.phone}` : ""}.`}
        </p>
      </div>
    </form>
  );
}
