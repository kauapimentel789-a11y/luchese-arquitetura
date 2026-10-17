import { site } from "@/content/site";

export function whatsappHref(message = site.contact.whatsappMessage) {
  const n = site.contact.whatsapp?.replace(/\D/g, "");
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}
