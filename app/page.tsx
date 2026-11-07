import { FeaturedSpaces } from "@/components/home/FeaturedSpaces";
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { Principles } from "@/components/home/Principles";
import { StudioTeaser } from "@/components/home/StudioTeaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <FeaturedSpaces />
      <StudioTeaser />
      <Principles />
    </>
  );
}
