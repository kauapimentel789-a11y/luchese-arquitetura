# Auditoria do site Luchese Arquitetura — 17/10/2026

## Novo nesta rodada

- **Abertura animada**: o monograma NL é desenhado em duas peças fora do lugar, que deslizam e se encaixam sobre um traçado tracejado de prancha. Em seguida, as letras de LUCHESE chegam soltas e o espaçamento se fecha até a medida do logotipo, com um contador de carregamento real (fontes e página).
- **Escolha de caminho** (inspirada no modelo enviado): o logotipo sobe e a tela se divide em *Arquitetura interna* e *Arquitetura externa*. O painel escolhido ocupa a tela e o site se abre por baixo, já com aquele foco:
  - a imagem e a legenda do hero mudam;
  - na página Projetos, o filtro Interiores já vem ativo para quem escolheu interna.
- A abertura aparece só na primeira página de cada visita. Funciona com teclado e no celular, onde os painéis ficam empilhados. Com "reduzir movimento" vira um fade curto. Tem trava de segurança: se o JavaScript falhar, ela some sozinha.

## Problemas encontrados e corrigidos

| Área | Problema | Correção |
|---|---|---|
| Conteúdo | A seção "Em números" mostrava quatro "—" e "a confirmar", o que parece inacabado. | A seção só aparece quando houver números reais; a numeração das seções foi refeita. |
| Celular | Nos cabeçalhos de seção, o rótulo da direita colidia com o da esquerda (ex.: "05 ( SERVIÇOS )SEIS FRENTES"). | O rótulo da esquerda não quebra mais e o da direita some no celular. |
| Celular | O hero cortava a imagem nas copas das árvores. | O enquadramento no celular foi reposicionado sobre a casa. |
| Acessibilidade | Contraste baixo nos rótulos do estudo solar, no texto do retrato provisório e na assinatura gigante do rodapé. | Contraste aumentado; a assinatura passou a ser decorativa (SVG fora da leitura de tela). |
| Acessibilidade | O título principal saía do mapa de acessibilidade ao rolar (o leitor de tela "perdia" o H1). | O fade de rolagem usa só opacidade. |
| Acessibilidade | Regiões do acordeão de serviços sem nome próprio; os painéis fechados ainda recebiam foco. | Cada região é nomeada pelo seu botão e os painéis fechados ficam inertes. |
| Acessibilidade | Filtros de projetos marcados como "página atual". | Usam `aria-pressed`, e o sublinhado acompanha esse estado. |
| Interação | O rótulo do cursor ("Entrar", "Explorar") ficava preso depois de um clique que removia o elemento. | O rótulo é limpo a cada clique; o cursor também aparece por cima da abertura. |
| Animação | As entradas de título das páginas internas tocavam escondidas atrás da abertura. | Elas esperam a abertura terminar. |
| Qualidade | O lint analisava a pasta de build (5.787 avisos falsos). | A build e as cenas de render foram excluídas do lint; o lint ficou limpo. |
| Pré-visualização | O host recusa pastas iniciadas por "_", e um caractere do polyfill bloqueava a publicação. | O pós-processamento renomeia `_next/` para `assets/` e escapa o caractere. |

## Testes executados (todos rodados de fato nesta sessão)

- `tsc --noEmit`: sem erros.
- `eslint`: sem erros nem avisos.
- `next build` de produção: sucesso.
- Varredura automatizada (Playwright + axe-core) em 8 páginas × 3 telas (1440×900, 820×1180, 390×844), cobrindo:
  - erros de console;
  - requisições falhas;
  - imagens quebradas;
  - rolagem horizontal;
  - contraste e regras WCAG 2 A/AA.
- Resultado da varredura:
  - sem erros, sem imagens quebradas, sem rolagem horizontal e sem violações de contraste;
  - o único 404 é o da página de teste de "não encontrado", como esperado;
  - restou um apontamento, "H1 invisível" na home, que é um artefato do teste: a ferramenta pula a rolagem de uma vez. Com rolagem real, o título volta (verificado).
- Testes de interação em produção, com 14 de 14 aprovados:
  - links internos (11 páginas);
  - menu: abre, prende o foco, fecha com Esc e navega;
  - filtros Interiores e Todos;
  - galeria pela seta, pelo teclado e em tela cheia;
  - acordeão por toque no celular;
  - maquete 3D carrega e separa os pavimentos;
  - formulário: valida e foca o primeiro erro;
  - formulário sem integração: mostra que **não** enviou;
  - abertura e escolha pelo teclado;
  - a abertura não se repete ao navegar.
- Desempenho local (home): conteúdo principal visível em ~0,3 s, 730 KB na carga inicial, uma tarefa longa em 40 passos de rolagem. A maquete 3D só carrega perto da tela.
- Revisão visual por capturas, rolando a página, em computador, tablet e celular, na home e na página da Residência Mirante. A abertura também foi revista quadro a quadro na versão publicada.

## O que ainda depende do escritório

1. **Formulário**: colocar `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (ou `CONTACT_WEBHOOK_URL`) no deploy (Vercel). Sem isso o site avisa que a mensagem não foi enviada.
2. **WhatsApp**: `NEXT_PUBLIC_WHATSAPP_NUMBER`.
3. **Dados**: e-mail, telefone, redes sociais, CNPJ e CAU (`src/content/site.ts`).
4. **Números** do escritório (a seção reaparece sozinha quando preenchidos).
5. **Retrato** da arquiteta e eventuais membros da equipe.
6. **Projetos e fotos reais**: os seis atuais são estudos conceituais renderizados.
7. **Domínio** e `NEXT_PUBLIC_SITE_URL` para SEO e compartilhamento.

## Rodada de desempenho (animações mais fluidas)

Medido com Playwright e Chromium, simulando celular (390×844, CPU 2× e 4× mais lenta) e computador (1440×900), na mesma rolagem da home inteira, antes e depois:

| Teste | Antes | Depois |
|---|---|---|
| Celular (CPU 2×), quadros travados na rolagem da home | 187 (≈5,8 s perdidos) | 16 (≈0,4 s) |
| Computador, média de quadros por segundo rolando | ~48 fps, travadas de até 0,28 s | ~58 fps, maior travada 50 ms |
| Abertura no celular (CPU 4×) | travadas de até 0,5 s no meio do desenho | o desenho começa depois do carregamento, sem travadas longas |

O que mudou:
- **Abertura**: letras e espaçamento animados só com transform (antes recalculava o layout a cada quadro e usava desfoque); os painéis entram deslizando em vez de recorte; a foto de cada painel tem o tamanho da tela, então o hover e a saída não redesenham a imagem; a animação só começa quando a página termina de carregar por baixo.
- **Fundo das seções**: a troca de cor não anima mais a página inteira; uma camada fixa se dissolve por cima.
- **Cabeçalho e filtros**: sem desfoque de fundo (pesava a cada quadro); fundo quase opaco.
- **Celular**: sem parallax preso à rolagem (na tela de toque ele sempre fica um quadro atrás e treme); as imagens se revelam por tempo. A rolagem suave via JavaScript fica só no computador.
- **Maquete 3D**: carrega quando a rolagem para; renderiza só quando algo muda; no celular usa resolução e sombras mais leves.
- Corrigido: a barra de carregamento da abertura não aparecia.

Testes rodados de novo: tsc, eslint, build de produção, varredura axe em 8 páginas × 3 telas (sem violações), interação 14/14.
