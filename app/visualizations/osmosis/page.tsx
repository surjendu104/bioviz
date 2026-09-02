import OsmosisView from "@/app/components/osmosis/OsmosisView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Osmosis & Osmotic Pressure — Interactive Biology Atlas",
  description: "Simulate thermodynamic solvent movement across a selectively permeable membrane and calculate osmotic pressure.",
};

export default function OsmosisPage() {
  return (
    <main className="h-full w-full">
      <OsmosisView />
    </main>
  );
}
