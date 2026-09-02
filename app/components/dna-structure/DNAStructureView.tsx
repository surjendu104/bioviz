"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getVisualizationById } from "@/lib/registry";
import {
  DNA_STRUCTURE_SEQUENCE,
  DNAStructureInspectable,
  DNA_STRUCTURE_INSPECTABLES,
} from "@/lib/biology/dnaStructureModel";
import VisualizationShell from "../shared/VisualizationShell";
import DNASequenceBar from "./DNASequenceBar";
import DNAStructureRenderer from "./DNAStructureRenderer";
import DNAStructureControls from "./DNAStructureControls";
import DNAStructureInfoPanel from "./DNAStructureInfoPanel";

export default function DNAStructureView() {
  const metadata = getVisualizationById("dna-structure")!;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<DNAStructureInspectable | null>(null);
  const [unzipProgress, setUnzipProgress] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<"all" | "at" | "gc">("all");
  const [showDirection, setShowDirection] = useState<boolean>(true);
  const [showHydrogenBonds, setShowHydrogenBonds] = useState<boolean>(true);
  const [showBaseLetters, setShowBaseLetters] = useState<boolean>(true);
  const [showGrooveLabels, setShowGrooveLabels] = useState<boolean>(true);

  // Controlled 3D Helical Rotation Animation
  useEffect(() => {
    if (!isRotating) return;

    let animId: number;
    let lastTime: number | null = null;

    const loop = (time: number) => {
      if (lastTime !== null) {
        const delta = Math.min(50, time - lastTime);
        setRotationAngle((prev) => (prev + delta * 0.001) % (2 * Math.PI));
      }
      lastTime = time;
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRotating]);

  const handleSelectEntityById = useCallback((id: string) => {
    const entity = DNA_STRUCTURE_INSPECTABLES[id];
    if (entity) {
      setSelectedEntity(entity);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSelectedIndex(null);
    setSelectedEntity(null);
    setUnzipProgress(0);
    setRotationAngle(0);
    setIsRotating(false);
    setFilterMode("all");
    setShowDirection(true);
    setShowHydrogenBonds(true);
    setShowBaseLetters(true);
    setShowGrooveLabels(true);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          setSelectedIndex((prev) => {
            if (prev === null) return 0;
            return Math.min(DNA_STRUCTURE_SEQUENCE.top.length - 1, prev + 1);
          });
          break;
        case "ArrowLeft":
          e.preventDefault();
          setSelectedIndex((prev) => {
            if (prev === null) return 0;
            return Math.max(0, prev - 1);
          });
          break;
        case " ":
          e.preventDefault();
          setIsRotating((r) => !r);
          break;
        case "u":
        case "U":
          e.preventDefault();
          setUnzipProgress((p) => (p === 0 ? 1 : 0));
          break;
        case "d":
        case "D":
          e.preventDefault();
          setShowDirection((d) => !d);
          break;
        case "h":
        case "H":
          e.preventDefault();
          setShowHydrogenBonds((h) => !h);
          break;
        case "l":
        case "L":
          e.preventDefault();
          setShowBaseLetters((l) => !l);
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleReset();
          break;
        case "Escape":
          setSelectedIndex(null);
          setSelectedEntity(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleReset]);

  return (
    <VisualizationShell
      metadata={metadata}
      controls={
        <DNAStructureControls
          unzipProgress={unzipProgress}
          setUnzipProgress={setUnzipProgress}
          rotationAngle={rotationAngle}
          setRotationAngle={setRotationAngle}
          isRotating={isRotating}
          setIsRotating={setIsRotating}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          showDirection={showDirection}
          setShowDirection={setShowDirection}
          showHydrogenBonds={showHydrogenBonds}
          setShowHydrogenBonds={setShowHydrogenBonds}
          showBaseLetters={showBaseLetters}
          setShowBaseLetters={setShowBaseLetters}
          showGrooveLabels={showGrooveLabels}
          setShowGrooveLabels={setShowGrooveLabels}
          onReset={handleReset}
        />
      }
      sidebar={
        <DNAStructureInfoPanel
          selectedIndex={selectedIndex}
          selectedEntity={selectedEntity}
          onSelectEntity={setSelectedEntity}
          unzipProgress={unzipProgress}
        />
      }
    >
      <div className="flex flex-col h-full w-full">
        {/* Synchronized Nucleotide Sequence Ribbon */}
        <DNASequenceBar
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
          unzipProgress={unzipProgress}
          filterMode={filterMode}
        />

        {/* Primary Double Helix Structural Renderer */}
        <div className="grow relative min-h-0">
          <DNAStructureRenderer
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
            unzipProgress={unzipProgress}
            rotationAngle={rotationAngle}
            filterMode={filterMode}
            showDirection={showDirection}
            showHydrogenBonds={showHydrogenBonds}
            showBaseLetters={showBaseLetters}
            showGrooveLabels={showGrooveLabels}
            onSelectEntity={handleSelectEntityById}
          />
        </div>
      </div>
    </VisualizationShell>
  );
}
