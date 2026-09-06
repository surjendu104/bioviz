"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getVisualizationById } from "@/lib/registry";
import {
  AnatomicalEntity,
  CirculationMode,
  CIRCULATION_STEPS,
} from "@/lib/biology/bloodCirculationModel";
import VisualizationShell from "../shared/VisualizationShell";
import AnatomicalHeartRenderer from "./AnatomicalHeartRenderer";
import BloodCirculationControls from "./BloodCirculationControls";
import BloodCirculationInfoPanel from "./BloodCirculationInfoPanel";

export default function BloodCirculationView() {
  const metadata = getVisualizationById("blood-circulation")!;

  const [mode, setMode] = useState<CirculationMode>("full");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedEntity, setSelectedEntity] = useState<AnatomicalEntity | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [flowSpeed, setFlowSpeed] = useState<number>(1);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showOxygenation, setShowOxygenation] = useState<boolean>(true);

  const handleNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => (prev + 1) % CIRCULATION_STEPS.length);
  }, []);

  const handlePrevStep = useCallback(() => {
    setCurrentStepIndex((prev) => (prev === 0 ? CIRCULATION_STEPS.length - 1 : prev - 1));
  }, []);

  const handleReset = useCallback(() => {
    setMode("full");
    setCurrentStepIndex(0);
    setSelectedEntity(null);
    setIsPlaying(true);
    setFlowSpeed(1);
    setShowLabels(true);
    setShowVectors(true);
    setShowOxygenation(true);
  }, []);

  // Automatic Step Trace Cycle if playing in trace mode
  useEffect(() => {
    if (mode !== "trace" || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % CIRCULATION_STEPS.length);
    }, 2200 / flowSpeed);

    return () => clearInterval(timer);
  }, [mode, isPlaying, flowSpeed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          setIsPlaying((p) => !p);
          break;
        case "ArrowRight":
          e.preventDefault();
          setMode("trace");
          handleNextStep();
          break;
        case "ArrowLeft":
          e.preventDefault();
          setMode("trace");
          handlePrevStep();
          break;
        case "1":
          e.preventDefault();
          setMode("full");
          break;
        case "2":
          e.preventDefault();
          setMode("pulmonary");
          break;
        case "3":
          e.preventDefault();
          setMode("systemic");
          break;
        case "4":
          e.preventDefault();
          setMode("trace");
          break;
        case "v":
        case "V":
          e.preventDefault();
          setShowVectors((v) => !v);
          break;
        case "l":
        case "L":
          e.preventDefault();
          setShowLabels((l) => !l);
          break;
        case "o":
        case "O":
          e.preventDefault();
          setShowOxygenation((o) => !o);
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleReset();
          break;
        case "Escape":
          setSelectedEntity(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextStep, handlePrevStep, handleReset]);

  return (
    <VisualizationShell
      metadata={metadata}
      controls={
        <BloodCirculationControls
          mode={mode}
          setMode={setMode}
          currentStepIndex={currentStepIndex}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          flowSpeed={flowSpeed}
          setFlowSpeed={setFlowSpeed}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          showVectors={showVectors}
          setShowVectors={setShowVectors}
          showOxygenation={showOxygenation}
          setShowOxygenation={setShowOxygenation}
          onReset={handleReset}
        />
      }
      sidebar={
        <BloodCirculationInfoPanel
          mode={mode}
          currentStepIndex={currentStepIndex}
          selectedEntity={selectedEntity}
          onSelectEntity={setSelectedEntity}
          onSelectStep={setCurrentStepIndex}
        />
      }
    >
      <AnatomicalHeartRenderer
        mode={mode}
        currentStepIndex={currentStepIndex}
        selectedEntity={selectedEntity}
        onSelectEntity={setSelectedEntity}
        isPlaying={isPlaying}
        showLabels={showLabels}
        showVectors={showVectors}
        showOxygenation={showOxygenation}
      />
    </VisualizationShell>
  );
}
