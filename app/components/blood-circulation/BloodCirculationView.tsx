"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
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

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export default function BloodCirculationView() {
  const metadata = getVisualizationById("blood-circulation")!;

  const [mode, setMode] = useState<CirculationMode>("full");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedEntity, setSelectedEntity] = useState<AnatomicalEntity | null>(null);
  const [flowSpeed, setFlowSpeed] = useState<number>(1);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showOxygenation, setShowOxygenation] = useState<boolean>(true);

  /**
   * Motion preference is read from the OS through useSyncExternalStore so
   * there is no setState-in-effect and no hydration mismatch. `null` means
   * "follow the OS"; a boolean is an explicit visitor override.
   */
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    // Server renders the paused, static plate; motion starts after hydration
    // unless the visitor's OS asks for reduced motion.
    () => true
  );
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const isPlaying = motionOverride ?? !reducedMotion;

  const setIsPlaying = useCallback(
    (updater: (previous: boolean) => boolean) => {
      setMotionOverride((previous) => updater(previous ?? !reducedMotion));
    },
    [reducedMotion]
  );

  const handleSelectEntity = useCallback((entity: AnatomicalEntity | null) => {
    setSelectedEntity(entity);
    // Inspecting a structure should stop the moving plate so the annotation
    // can be read. Play is one click away to resume.
    if (entity) setMotionOverride(false);
  }, []);

  const handleNextStep = useCallback(() => {
    setMotionOverride(false);
    setSelectedEntity(null);
    setCurrentStepIndex((prev) => (prev + 1) % CIRCULATION_STEPS.length);
  }, []);

  const handlePrevStep = useCallback(() => {
    setMotionOverride(false);
    setSelectedEntity(null);
    setCurrentStepIndex((prev) => (prev === 0 ? CIRCULATION_STEPS.length - 1 : prev - 1));
  }, []);

  const handleSelectStep = useCallback((stepIndex: number) => {
    setMode("trace");
    setCurrentStepIndex(stepIndex);
    setSelectedEntity(null);
    setMotionOverride(false);
  }, []);

  const handleReset = useCallback(() => {
    setMode("full");
    setCurrentStepIndex(0);
    setSelectedEntity(null);
    setMotionOverride(null);
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
      // Let focused HTML controls handle their own keys. When an SVG
      // structure is focused, keep Space/Enter for selection but allow
      // the global shortcuts (arrows, 1–4, V/L/O, R) to keep working.
      const target = e.target instanceof Element ? e.target : null;
      const isHtmlControl = target?.closest(
        "button, a, input, textarea, select"
      );
      const isSvgStructure = target?.closest('svg [role="button"]');

      if (isHtmlControl && e.key !== "Escape") {
        return;
      }
      if (isSvgStructure && (e.key === " " || e.key === "Enter")) {
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
  }, [handleNextStep, handlePrevStep, handleReset, setIsPlaying]);

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
          onSelectEntity={handleSelectEntity}
          onSelectStep={handleSelectStep}
        />
      }
    >
      <AnatomicalHeartRenderer
        mode={mode}
        currentStepIndex={currentStepIndex}
        selectedEntity={selectedEntity}
        onSelectEntity={handleSelectEntity}
        isPlaying={isPlaying}
        flowSpeed={flowSpeed}
        showLabels={showLabels}
        showVectors={showVectors}
        showOxygenation={showOxygenation}
      />
    </VisualizationShell>
  );
}
