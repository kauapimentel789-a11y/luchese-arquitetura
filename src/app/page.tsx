import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Featured } from "@/components/home/Featured";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { Services } from "@/components/home/Services";
import { Marquee } from "@/components/motion/Marquee";
import { Process } from "@/components/home/Process";
import { Figures } from "@/components/home/Figures";
import { Materials } from "@/components/home/Materials";
import { Studio } from "@/components/home/Studio";
import { ClosingCTA } from "@/components/home/ClosingCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Featured />
      <SelectedWorks />
      <Marquee items={["Interiores", "Marcenaria sob medida", "Reforma de fachadas", "Áreas de lazer", "Espaços comerciais"]} />
      <Services />
      <Process />
      <Figures />
      <Materials />
      <Studio />
      <ClosingCTA />
    </>
  );
}
