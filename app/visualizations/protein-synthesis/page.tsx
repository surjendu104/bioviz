import ProteinSynthesisView from "@/app/components/protein/ProteinSynthesisView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protein Synthesis: Translation — Interactive Biology Atlas",
  description: "Explore ribosomal decoding, aminoacyl-tRNA recruitment, and peptidyl transferase peptide elongation.",
};

export default function ProteinSynthesisPage() {
  return (
    <main className="h-full w-full">
      <ProteinSynthesisView />
    </main>
  );
}
