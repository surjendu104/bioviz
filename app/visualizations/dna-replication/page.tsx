import DNAReplication from "@/app/components/dna/DNAReplication";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DNA Replication — Interactive Biology Atlas",
  description: "Explore DNA replication fork mechanics, 5'→3' polymerase elongation, and Okazaki fragments.",
};

export default function DNAReplicationPage() {
  return (
    <main className="h-full w-full">
      <DNAReplication />
    </main>
  );
}
