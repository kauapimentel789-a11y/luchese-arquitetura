import type { NextConfig } from "next";

/*
  STATIC_EXPORT=1 gera uma versão estática (pasta `out/`) usada na pré-visualização.
  O contato é só pelo WhatsApp, então não há rota de API.
  Para o site real, use o build padrão (Vercel ou `next start`).
*/
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStatic ? { output: "export" as const, trailingSlash: true } : {}),
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_STATIC_EXPORT: isStatic ? "1" : "" },
  poweredByHeader: false,
};

export default nextConfig;
