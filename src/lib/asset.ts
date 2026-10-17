/**
 * Caminho de arquivos públicos (/images, /brand).
 * No site normal retorna o próprio caminho. Na exportação estática para pré-visualização,
 * prefixa com a raiz relativa da página (definida em window.__ROOT__ pelo pós-processamento),
 * para que o site funcione dentro de qualquer subpasta.
 */
export function asset(path: string) {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT && typeof window !== "undefined") {
    const root = (window as unknown as { __ROOT__?: string }).__ROOT__;
    if (root !== undefined) return root + path.replace(/^\//, "");
  }
  return path;
}

/** Converte uma rota interna ("/projetos/x", "/#servicos") no arquivo correspondente da exportação estática. */
export function staticHref(href: string) {
  const root = (window as unknown as { __ROOT__?: string }).__ROOT__ ?? "/";
  const [path, hash] = href.split("#");
  let p = (path || "/").replace(/^\//, "");
  if (p === "") p = "inicio/";
  if (!p.endsWith("/")) p += "/";
  return root + p + "index.html" + (hash ? "#" + hash : "");
}

export const isStatic = !!process.env.NEXT_PUBLIC_STATIC_EXPORT;
