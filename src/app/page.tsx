import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Featured } from "@/components/home/Featured";
import { SelectedWorks } from "@/components/home/SelectedWorks";
import { Experience3D } from "@/components/home/Experience3D";
import { Services } from "@/components/home/Services";
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
      <Experience3D />
      <Services />
      <Process />
      <Figures />
      <Materials />
      <Studio />
      <ClosingCTA />
    </>
  );
}
