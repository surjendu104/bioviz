import EnzymeKineticsView from "@/app/components/enzyme/EnzymeKineticsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enzyme Kinetics & Michaelis-Menten — Interactive Biology Atlas",
  description: "Explore substrate saturation, catalytic turnover, and competitive vs non-competitive inhibition.",
};

export default function EnzymeKineticsPage() {
  return (
    <main className="h-full w-full">
      <EnzymeKineticsView />
    </main>
  );
}
