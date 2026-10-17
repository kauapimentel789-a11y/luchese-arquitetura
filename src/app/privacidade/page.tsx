import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Privacidade", description: "Como tratamos os dados de quem entra em contato com o escritório." };

export default function PrivacidadePage() {
  return (
    <div data-ambient="light" className="wrap pb-[var(--section)] pt-[calc(var(--header-h)+12vh)]">
      <div className="mx-auto max-w-[68ch]">
        <p className="label mb-8">( política de privacidade )</p>
        <h1 className="display t-xl">Privacidade</h1>
        <div className="mt-12 grid gap-6 [&_h2]:label [&_h2]:mt-6">
          <p className="lead">Este site não tem formulário nem cadastro. O contato com o escritório é feito pelo WhatsApp.</p>
          <h2>Quais dados</h2>
          <p>Apenas o que você decidir enviar na conversa pelo WhatsApp, como nome, telefone, informações sobre o projeto e arquivos.</p>
          <h2>Para que usamos</h2>
          <p>Exclusivamente para responder ao seu contato e, se houver interesse mútuo, preparar uma proposta. Não vendemos nem compartilhamos esses dados para fins de marketing.</p>
          <h2>Por quanto tempo</h2>
          <p>Mantemos as mensagens pelo tempo necessário ao atendimento. Você pode pedir a exclusão a qualquer momento.</p>
          <h2>Seus direitos (LGPD)</h2>
          <p>
            Você pode solicitar acesso, correção ou exclusão dos seus dados{site.contact.phone ? ` pelo WhatsApp ${site.contact.phone}` : " pelos canais de contato do escritório"}.
          </p>
          <p className="muted">
            Responsável: {site.legal.company ?? site.name}
            {site.legal.cnpj ? `, CNPJ ${site.legal.cnpj}` : ""}. [Revise este texto com a assessoria jurídica do escritório antes da publicação.]
          </p>
        </div>
      </div>
    </div>
  );
}
