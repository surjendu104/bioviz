import BloodCirculationView from "@/app/components/blood-circulation/BloodCirculationView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blood Circulation & Cardiovascular Circuits — Interactive Biology Atlas",
  description: "Explore pulmonary and systemic circulation through the four chambers, valves, and great vessels of the human heart.",
};

export default function BloodCirculationPage() {
  return (
    <main className="h-full w-full">
      <BloodCirculationView />
    </main>
  );
}
