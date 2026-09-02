import CellStructureView from "@/app/components/cell-structure/CellStructureView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cell Structure: Eukaryotic Architecture — Interactive Biology Atlas",
  description: "Explore the internal architecture of animal and plant cells: membranes, nuclei, mitochondria, chloroplasts, and endomembrane systems.",
};

export default function CellStructurePage() {
  return (
    <main className="h-full w-full">
      <CellStructureView />
    </main>
  );
}
