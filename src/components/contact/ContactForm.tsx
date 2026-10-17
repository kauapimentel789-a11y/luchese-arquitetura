"use client";
import { useState } from "react";
import { budgets, contactSchema, projectTypes, timelines } from "@/lib/contact-schema";
import { whatsappHref } from "@/lib/whatsapp";
import { site } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";

/** Destino do envio: endpoint externo (sites estáticos) ou a rota de API do próprio site. */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || (process.env.NEXT_PUBLIC_STATIC_EXPORT ? "" : "/api/contact");

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const wa = whatsappHref();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const data = {
      ...raw,
      phone: raw.phone || undefined,
      budget: raw.budget || undefined,
      projectType: raw.projectType || undefined,
      timeline: raw.timeline || undefined,
      consent: raw.consent === "on",
    };
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const f: Record<string, string> = {};
      for (const i of parsed.error.issues) f[String(i.path[0])] ??= i.message;
      setErrors(f);
      setStatus("idle");
      const first = Object.keys(f)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setErrors({});
    if (!ENDPOINT) {
      setStatus("error");
      setMessage("O envio está desativado nesta versão de demonstração do site, então sua mensagem não foi enviada.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && (json.ok ?? true)) {
        setStatus("sent");
        form.reset();
        return;
      }
      if (json.fields) setErrors(json.fields);
      setStatus("error");
      setMessage(json.message || "Não conseguimos enviar sua mensagem. Tente novamente em alguns minutos.");
    } catch {
      setStatus("error");
      setMessage("Sem conexão com o servidor. Verifique sua internet e tente de novo.");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border-t border-[var(--line-strong)] pt-10">
        <p className="label mb-6 text-bronze">Mensagem enviada</p>
        <p className="display t-lg max-w-[18ch]">Obrigado. Recebemos sua mensagem.</p>
        <p className="mt-6 max-w-[48ch] muted">Vamos ler com atenção e responder pelo e-mail informado em até dois dias úteis.</p>
        <button type="button" className="label link-draw mt-10" onClick={() => setStatus("idle")}>
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  const field = (name: string, label: string, input: React.ReactNode, opt?: boolean, wide?: boolean) => (
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
  const aria = (name: string) => ({ id: `f-${name}`, name, "aria-invalid": !!errors[name] || undefined, "aria-describedby": errors[name] ? `e-${name}` : undefined });

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-x-10 gap-y-10 md:grid-cols-2" aria-busy={status === "sending"}>
      {!ENDPOINT && (
        <p className="border border-[var(--line-strong)] p-4 text-[15px] md:col-span-2">
          Esta é uma versão de demonstração: o envio do formulário ainda não está ativo.{" "}
          {wa ? "Use o WhatsApp para falar com o escritório." : site.contact.email ? `Escreva para ${site.contact.email}.` : ""}
        </p>
      )}
      {field("name", "Nome", <input {...aria("name")} autoComplete="name" required />)}
      {field("email", "E-mail", <input {...aria("email")} type="email" autoComplete="email" inputMode="email" required />)}
      {field("phone", "Telefone", <input {...aria("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 90000-0000" />, true)}
      {field("city", "Cidade do projeto", <input {...aria("city")} autoComplete="address-level2" required />)}
      {field(
        "projectType",
        "Tipo de projeto",
        <select {...aria("projectType")} defaultValue="" required>
          <option value="" disabled>
            Selecione
          </option>
          {projectTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>,
      )}
      {field(
        "timeline",
        "Prazo estimado",
        <select {...aria("timeline")} defaultValue="" required>
          <option value="" disabled>
            Selecione
          </option>
          {timelines.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>,
      )}
      {field(
        "budget",
        "Faixa de investimento",
        <select {...aria("budget")} defaultValue="">
          <option value="">Selecione</option>
          {budgets.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>,
        true,
        true,
      )}
      {field("message", "Mensagem", <textarea {...aria("message")} rows={5} placeholder="Conte sobre o terreno ou imóvel, o programa e o que é importante para você." required />, false, true)}

      <div className="hidden" aria-hidden>
        <label htmlFor="f-website">Não preencha este campo</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="md:col-span-2" data-invalid={!!errors.consent}>
        <label className="flex cursor-pointer items-start gap-4 text-[15px]">
          <input {...aria("consent")} type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#9a8061]" />
          <span className="muted">
            Concordo que o escritório use estes dados apenas para responder a este contato, conforme a{" "}
            <a href="/privacidade" className="underline underline-offset-4">
              política de privacidade
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="e-consent" className="mt-2 text-[14px] text-[#a5523c]">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn btn-solid disabled:cursor-wait disabled:opacity-70">
          <span>{status === "sending" ? "Enviando…" : "Enviar mensagem"}</span>
          <span className="btn-arrow" aria-hidden>
            {status === "sending" ? <span className="inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" /> : "→"}
          </span>
        </button>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="label link-draw">
            Prefere WhatsApp? ↗
          </a>
        )}
      </div>
      {status === "error" && (
        <p role="alert" className="border-l-2 border-[#a5523c] pl-4 text-[15px] md:col-span-2">
          {message}
        </p>
      )}
    </form>
  );
}
