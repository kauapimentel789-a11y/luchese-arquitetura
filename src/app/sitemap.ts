import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projetos", "/escritorio", "/contato", "/privacidade"];
  return [...pages.map((p) => ({ url: site.url + p })), ...projects.map((p) => ({ url: `${site.url}/projetos/${p.slug}` }))];
}
