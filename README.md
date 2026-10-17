# Luchese Arquitetura — site

Site institucional e portfólio em **Next.js 15 + TypeScript + Tailwind CSS 4**, com **GSAP/ScrollTrigger** (animações de rolagem),
**Lenis** (rolagem suave), **React Three Fiber** (maquete 3D) e uma rota de API para o formulário de contato.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # produção
```

## Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| Nome, contatos, WhatsApp, redes, endereço, dados legais, **números do escritório** | `src/content/site.ts` |
| Projetos (textos, ficha técnica, imagens, capítulos da narrativa) | `src/content/projects.ts` |
| Serviços, processo, materiais, equipe, valores | `src/content/studio.ts` |
| Logotipo | `public/brand/` (para usar o logotipo tipográfico temporário "ATELIER", mude `useTemporaryWordmark` em `site.ts`) |

Regras de conteúdo adotadas:

- **Números** (`figures` em `site.ts`) começam como `null` e aparecem como "a confirmar". Preencha só com dados reais; o contador anima automaticamente.
- **Projetos** são estudos conceituais, marcados como tal no site. Ao trocar por obras reais, edite `conceptual`, textos e imagens.
- **Equipe**: `portrait: null` mostra uma moldura de retrato a substituir; `credentials` (formação, CAU) só aparece quando preenchido.
- Campos entre colchetes, como `[a definir] m²`, indicam dados que o escritório precisa informar.

## Abertura e escolha de caminho

- `src/components/layout/Preloader.tsx`: o monograma NL é desenhado em duas peças que se encaixam, LUCHESE se monta letra a letra e, em seguida, a tela se divide em **Arquitetura interna** e **Arquitetura externa**.
- Toca só na primeira página de cada visita (`sessionStorage`). Para rever, abra uma aba anônima ou limpe os dados do site.
- A escolha fica em `html[data-foco]` (`interiores` ou `arquitetura`): muda a imagem e a legenda do hero e, em Projetos, já abre o filtro Interiores. Textos e imagens dos dois painéis estão no topo do arquivo (`CHOICES`).
- Com "reduzir movimento" ativo, a abertura vira um fade curto, sem perder a escolha.

## Números do escritório

A seção "Em números" só aparece quando pelo menos um valor de `figures` em `src/content/site.ts` for preenchido. Não há números inventados.

## Imagens

As imagens atuais são **renderizações digitais originais**, produzidas no Blender (Cycles) para este site a partir de modelos 3D próprios;
não há fotos de terceiros nem restrições de licença. Ficam em `public/images/` (WebP em várias larguras) com o manifesto `src/content/images.json`.

Para usar fotos reais: gere as versões com `python scripts/process_images.py <pasta-com-png>` (requer Pillow e NumPy) — o nome do arquivo
vira a chave usada em `projects.ts` — ou coloque os arquivos manualmente seguindo o padrão `nome-<largura>.webp` e atualize o manifesto.

## Formulário de contato (o que falta configurar)

O formulário envia para `POST /api/contact` (`src/app/api/contact/route.ts`), que valida os dados (mesmo esquema no cliente e no servidor),
tem campo-armadilha contra robôs e limite simples de tentativas. **Sem integração configurada, a rota responde 503 e o site informa que a
mensagem não foi enviada** — nunca simula sucesso.

Escolha uma das integrações e defina as variáveis de ambiente (na Vercel: Project → Settings → Environment Variables):

**Opção A — e-mail via [Resend](https://resend.com)** (plano gratuito disponível)

```
RESEND_API_KEY=re_xxx
CONTACT_TO_EMAIL=contato@seudominio.com.br        # pode ser uma lista separada por vírgulas
CONTACT_FROM_EMAIL="Site Luchese <site@seudominio.com.br>"   # domínio verificado no Resend
```

Sem domínio verificado, o Resend só entrega para o e-mail da própria conta usando `onboarding@resend.dev` (padrão).

**Opção B — webhook** (Make, Zapier, n8n, Formspree, Google Sheets via Apps Script…)

```
CONTACT_WEBHOOK_URL=https://...
```

Recebe um JSON com `name, email, phone, projectType, city, budget, timeline, message, receivedAt`.

As duas podem ser usadas juntas.

### WhatsApp

Defina `NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999` (só dígitos, com DDI e DDD) ou preencha `contact.whatsapp` em `site.ts`.
Os botões de WhatsApp (menu, contato, rodapé, encerramento) só aparecem quando o número existe.

### Outros

- `NEXT_PUBLIC_SITE_URL` — domínio final, usado em SEO, sitemap e Open Graph.

## Publicar

Recomendado: **Vercel** (importe a pasta/repositório; framework Next.js detectado automaticamente; configure as variáveis acima).

Versão estática (sem API, usada na pré-visualização): `./scripts/build-static.sh` gera `out-preview/`, portátil para qualquer subpasta.
Nela o formulário só envia se `NEXT_PUBLIC_CONTACT_ENDPOINT` apontar para um serviço externo (ex.: Formspree).

## Estrutura

```
src/app/                 páginas (início, projetos, projeto, escritório, contato, privacidade) e API
src/components/home/     seções da página inicial (hero, maquete 3D, serviços, processo…)
src/components/project/  galeria, planta, progresso de leitura
src/components/motion/   sistema de movimento (revelações, parallax, transição de página, cursor, rolagem)
src/components/layout/   cabeçalho, menu em tela cheia, rodapé
src/content/             todo o conteúdo editável
scripts/                 processamento de imagens e exportação estática
```

## Acessibilidade e desempenho

- `prefers-reduced-motion` desativa rolagem suave, parallax, revelações e transições.
- Navegação por teclado: link "pular para o conteúdo", menu com foco preso e `Esc`, galeria com setas, foco visível.
- Maquete 3D carregada sob demanda, pausada fora da tela, com imagem estática caso o navegador não tenha WebGL; no celular, sem controle por arraste para não travar a rolagem.
- Imagens com `srcset`, carregamento tardio e placeholder desfocado; fontes via `next/font` (Cormorant Garamond e Jost).
