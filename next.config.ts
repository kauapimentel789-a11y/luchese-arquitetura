import type { NextConfig } from "next";

/*
  O site não tem servidor (o contato abre o WhatsApp), então pode ser publicado como arquivos estáticos.
  - EXPORT=1 (`npm run build:static`): gera `out/` para a Cloudflare Pages ou qualquer hospedagem estática.
  - STATIC_EXPORT=1 (scripts/build-static.sh): versão portátil, com caminhos relativos, usada na pré-visualização.
  - Sem nenhuma das duas: build padrão do Next (Vercel ou `next start`).
*/
const isStatic = process.env.STATIC_EXPORT === "1";
const isExport = isStatic || process.env.EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" as const } : {}),
  ...(isStatic ? { trailingSlash: true } : {}),
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_STATIC_EXPORT: isStatic ? "1" : "" },
  poweredByHeader: false,
};

export default nextConfig;
