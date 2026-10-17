import type { NextConfig } from "next";

/*
  STATIC_EXPORT=1 gera uma versão estática (pasta `out/`) usada na pré-visualização.
  Nela não há rota de API: o formulário só envia se NEXT_PUBLIC_CONTACT_ENDPOINT estiver definido.
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
