// Torna a exportação estática (out/) portátil: caminhos relativos e páginas acessíveis por arquivo.
// Uso: node scripts/postprocess-static.mjs
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
const DEST = path.resolve("out-preview");
fs.rmSync(DEST, { recursive: true, force: true });
fs.cpSync(OUT, DEST, { recursive: true });

// a home vai para inicio/ (a raiz recebe um lançador)
fs.mkdirSync(path.join(DEST, "inicio"), { recursive: true });
fs.renameSync(path.join(DEST, "index.html"), path.join(DEST, "inicio", "index.html"));
for (const f of fs.readdirSync(DEST)) if (f.endsWith(".txt")) fs.rmSync(path.join(DEST, f), { force: true });

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(DEST);

for (const f of files) {
  const rel = path.relative(DEST, f);
  if (f.endsWith(".txt") && !rel.startsWith("_next")) {
    fs.rmSync(f);
    continue;
  }
  if (f.endsWith(".html")) {
    const depth = rel.split(path.sep).length - 1;
    const root = depth ? "../".repeat(depth) : "./";
    let route = "/" + rel.replace(/index\.html$/, "").split(path.sep).join("/");
    if (route === "/inicio/") route = "/";
    let s = fs.readFileSync(f, "utf8");
    // atributos e payloads com caminhos absolutos de arquivos
    s = s.replace(/(["'(\s,])\/(_next|images|brand)\//g, `$1${root}$2/`);
    s = s.replace(/\\"\/(_next|images|brand)\//g, `\\"${root}$1/`);
    const boot = `<script>window.__ROOT__=${JSON.stringify(root)};window.__ROUTE__=${JSON.stringify(route)};</script>`;
    s = s.replace(/<head>/, `<head>${boot}`);
    fs.writeFileSync(f, s);
  } else if (f.endsWith(".css")) {
    let s = fs.readFileSync(f, "utf8");
    s = s.replace(/url\(\/_next\/static\/media\//g, "url(../media/");
    fs.writeFileSync(f, s);
  } else if (f.endsWith(".js") && rel.includes("webpack-")) {
    let s = fs.readFileSync(f, "utf8");
    const before = s;
    s = s.replace(/\.p="\/_next\/"/, '.p=(window.__ROOT__||"/")+"_next/"');
    if (s === before) console.warn("! publicPath do webpack não encontrado em", rel);
    fs.writeFileSync(f, s);
  }
}

// alguns hosts reservam nomes iniciados por "_": _next/ vira assets/
fs.renameSync(path.join(DEST, "_next"), path.join(DEST, "assets"));
for (const f of walk(DEST)) {
  if (!/\.(html|js|css|json)$/.test(f)) continue;
  const s = fs.readFileSync(f, "utf8");
  let t = s.replaceAll("_next/", "assets/");
  // o polyfill traz U+FFFD literal; escapado fica equivalente e o host aceita
  if (f.endsWith(".js")) t = t.replaceAll("�", "\\ufffd");
  if (t !== s) fs.writeFileSync(f, t);
}

// lançador da raiz
fs.writeFileSync(
  path.join(DEST, "index.html"),
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Luchese Arquitetura</title><style>body{margin:0;background:#171816;color:#f5f3ee;font:300 14px/1.6 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh}</style><script>location.replace("inicio/index.html")</script></head><body><a href="inicio/index.html" style="color:inherit">Abrir o site</a></body></html>`,
);
console.log("ok", files.length, "arquivos");
