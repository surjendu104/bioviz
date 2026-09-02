import ActionPotentialView from "@/app/components/action-potential/ActionPotentialView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Action Potential & Ion Channels — Interactive Biology Atlas",
  description: "Simulate neuronal membrane depolarization, voltage-gated Na+/K+ channel kinetics, and all-or-none spike propagation.",
};

export default function ActionPotentialPage() {
  return (
    <main className="h-full w-full">
      <ActionPotentialView />
    </main>
  );
}
