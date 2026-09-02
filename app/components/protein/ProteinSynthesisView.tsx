"use client";

import React, { useState, useEffect } from "react";
import { getVisualizationById } from "@/lib/registry";
import { mRNA_SEQUENCE, ProteinInspectable, PROTEIN_INSPECTABLES } from "@/lib/biology/proteinModel";
import VisualizationShell from "../shared/VisualizationShell";
import ProteinSynthesisRenderer from "./ProteinSynthesisRenderer";
import ProteinControls from "./ProteinControls";
import ProteinInfoPanel from "./ProteinInfoPanel";

export default function ProteinSynthesisView() {
  const metadata = getVisualizationById("protein-synthesis")!;

  const [currentCodonIndex, setCurrentCodonIndex] = useState<number>(0);
  const [subStage] = useState<"loading_a" | "peptide_bond" | "translocation">("loading_a");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showCodonLetters, setShowCodonLetters] = useState<boolean>(true);
  const [showSites, setShowSites] = useState<boolean>(true);
  const [selectedObject, setSelectedObject] = useState<ProteinInspectable | null>(null);

  const handleNextCodon = () => {
    if (currentCodonIndex < mRNA_SEQUENCE.length - 1) {
      setCurrentCodonIndex((prev) => prev + 1);
    }
  };

  const handlePrevCodon = () => {
    if (currentCodonIndex > 0) {
      setCurrentCodonIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentCodonIndex(0);
    setIsPlaying(false);
    setSelectedObject(null);
  };

  // Automated translation cycle
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentCodonIndex((prev) => {
        if (prev >= mRNA_SEQUENCE.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1600);

    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <VisualizationShell
      metadata={metadata}
      controls={
        <ProteinControls
          currentCodonIndex={currentCodonIndex}
          onNextCodon={handleNextCodon}
          onPrevCodon={handlePrevCodon}
          onReset={handleReset}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          showCodonLetters={showCodonLetters}
          setShowCodonLetters={setShowCodonLetters}
          showSites={showSites}
          setShowSites={setShowSites}
        />
      }
      sidebar={
        <ProteinInfoPanel
          currentCodonIndex={currentCodonIndex}
          selectedObject={selectedObject}
          onSelectObject={setSelectedObject}
        />
      }
    >
      <ProteinSynthesisRenderer
        currentCodonIndex={currentCodonIndex}
        subStage={subStage}
        isPlaying={isPlaying}
        onSelectObject={(id) => setSelectedObject(PROTEIN_INSPECTABLES[id] || null)}
        showCodonLetters={showCodonLetters}
        showSites={showSites}
      />
    </VisualizationShell>
  );
}
