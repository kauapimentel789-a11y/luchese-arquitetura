import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionProvider } from "@/components/motion/Transition";
import { Cursor } from "@/components/motion/Cursor";
import { AmbientController } from "@/components/motion/Ambient";
import { Preloader } from "@/components/layout/Preloader";
import { introBootScript } from "@/lib/intro";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · Arquitetura que transforma a maneira de viver`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [{ url: "/images/mirante-hero-1800.webp", width: 1800, height: 1013, alt: "Residência Mirante, renderização conceitual" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/brand/monogram-black.png" },
};

export const viewport: Viewport = {
  themeColor: "#171816",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      </head>
      <body data-ambient="dark">
        <Preloader />
        <TransitionProvider>
          <SmoothScroll />
          <AmbientController />
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <Cursor />
        </TransitionProvider>
      </body>
    </html>
  );
}
