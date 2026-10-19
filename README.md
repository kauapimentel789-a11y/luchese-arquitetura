# Luchese Arquitetura — site

Site institucional e portfólio em **Next.js 15 + TypeScript + Tailwind CSS 4**, com **GSAP/ScrollTrigger** (animações de rolagem),
**Lenis** (rolagem suave), **React Three Fiber** (maquete 3D) O contato é só pelo WhatsApp: o formulário monta a mensagem e abre o WhatsApp do escritório (sem e-mail e sem servidor).

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

## Contato

### WhatsApp

Defina `NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999` (só dígitos, com DDI e DDD) ou preencha `contact.whatsapp` em `site.ts`.
Os botões de WhatsApp (menu, contato, rodapé, encerramento) só aparecem quando o número existe.

### Outros

- `NEXT_PUBLIC_SITE_URL` — domínio final, usado em SEO, sitemap e Open Graph.

## Publicar

O site é todo estático (não há servidor), então roda em qualquer hospedagem de arquivos.

**Cloudflare (recomendado, plano grátis permite uso comercial)**: Workers & Pages → Create → importar o repositório do GitHub.
Na tela de Workers: build command `npm run build:static`; deploy command `npx wrangler deploy` (lê `wrangler.jsonc`, que publica a pasta `out`).
Com `npm run build` (sem `:static`) a pasta `out` não é gerada e a publicação falha. Se os tokens da conta forem apagados, reconecte o repositório em Settings → Build para a Cloudflare gerar um token novo.
Na tela de Pages, se usada:
- Framework preset: *None*
- Build command: `npm run build:static`
- Build output directory: `out`
- Variável opcional: `NEXT_PUBLIC_SITE_URL` com o domínio final.

O arquivo `public/_headers` define cache e cabeçalhos de segurança na Cloudflare, e `.node-version` fixa o Node 22.
As fontes ficam em `src/app/fonts/`, então o build não depende do Google Fonts.

**Vercel**: também funciona com o build padrão (`npm run build`), mas o plano Hobby é só para uso não comercial.

Versão estática (usada na pré-visualização): `./scripts/build-static.sh` gera `out-preview/`, portátil para qualquer subpasta.

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
