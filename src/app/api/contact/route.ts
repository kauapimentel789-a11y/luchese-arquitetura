import { NextResponse } from "next/server";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";

/*
  Recebe o formulário de contato e encaminha por e-mail.

  Integrações suportadas (configure por variáveis de ambiente, ver README):
  1. Resend (e-mail):  RESEND_API_KEY, CONTACT_TO_EMAIL e, opcionalmente, CONTACT_FROM_EMAIL
  2. Webhook genérico: CONTACT_WEBHOOK_URL (Make, Zapier, n8n, Formspree, planilha etc.)

  Sem nenhuma integração configurada, a rota responde 503 e o site informa que o envio
  está indisponível. Nada é registrado como enviado sem uma integração ativa.
*/

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function asText(d: ContactInput) {
  return [
    `Nome: ${d.name}`,
    `E-mail: ${d.email}`,
    `Telefone: ${d.phone || "—"}`,
    `Tipo de projeto: ${d.projectType}`,
    `Cidade: ${d.city}`,
    `Faixa de investimento: ${d.budget || "—"}`,
    `Prazo estimado: ${d.timeline}`,
    "",
    d.message,
  ].join("\n");
}

async function sendResend(d: ContactInput) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Site <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL!.split(",").map((s) => s.trim()),
      reply_to: d.email,
      subject: `Novo contato pelo site: ${d.projectType} em ${d.city}`,
      text: asText(d),
      html: `<pre style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(asText(d))}</pre>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend respondeu ${res.status}: ${await res.text()}`);
}

async function sendWebhook(d: ContactInput) {
  const res = await fetch(process.env.CONTACT_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...d, consent: true, website: undefined, receivedAt: new Date().toISOString(), source: "site" }),
  });
  if (!res.ok) throw new Error(`Webhook respondeu ${res.status}`);
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, code: "rate_limited", message: "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request", message: "Não foi possível ler os dados enviados." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const i of parsed.error.issues) fields[String(i.path[0])] ??= i.message;
    return NextResponse.json({ ok: false, code: "invalid", message: "Revise os campos destacados.", fields }, { status: 422 });
  }
  if (parsed.data.website) {
    // robô: responde como se tivesse aceitado, sem encaminhar
    return NextResponse.json({ ok: true });
  }

  const hasResend = !!(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
  const hasWebhook = !!process.env.CONTACT_WEBHOOK_URL;
  if (!hasResend && !hasWebhook) {
    return NextResponse.json(
      {
        ok: false,
        code: "not_configured",
        message: "O envio pelo site ainda não foi ativado pelo escritório. Sua mensagem não foi enviada.",
      },
      { status: 503 },
    );
  }

  try {
    if (hasResend) await sendResend(parsed.data);
    if (hasWebhook) await sendWebhook(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contato] falha ao encaminhar", e);
    return NextResponse.json(
      { ok: false, code: "delivery_failed", message: "Não conseguimos encaminhar sua mensagem agora. Tente novamente em alguns minutos." },
      { status: 502 },
    );
  }
}
