import DNAStructureView from "@/app/components/dna-structure/DNAStructureView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DNA Structure: Double Helix & Base Pairing — Interactive Biology Atlas",
  description: "Explore the molecular architecture of DNA — antiparallel strands, complementary A–T and G–C hydrogen bonding, and sugar-phosphate backbones.",
};

export default function DNAStructurePage() {
  return (
    <main className="h-full w-full">
      <DNAStructureView />
    </main>
  );
}
