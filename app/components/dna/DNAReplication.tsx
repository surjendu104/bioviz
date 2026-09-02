"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AppState } from "@/lib/types";
import { BIOLOGICAL_STEPS } from "@/lib/biology/dnaModel";
import { PREDICTION_SCENARIOS } from "@/lib/biology/predictions";
import { getVisualizationById } from "@/lib/registry";
import VisualizationShell from "../shared/VisualizationShell";
import ControlBar from "./ControlBar";
import InfoPanel from "./InfoPanel";
import DNARenderer from "./DNARenderer";
import NucleoplasmCanvas from "./NucleoplasmCanvas";
import PredictionModal from "./PredictionModal";
import ActiveSiteModal from "./ActiveSiteModal";

export default function DNAReplication() {
  const metadata = getVisualizationById("dna-replication")!;

  const [state, setState] = useState<AppState>({
    isPlaying: false,
    progress: 0,
    speed: 1,
    selectedObject: null,
    showLabels: true,
    showDirection: true,
    showBaseLetters: true,
    showEnzymes: true,
    showParticles: true,
    showActiveSiteModal: false,
  });

  const [activePredictionId, setActivePredictionId] = useState<string | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<Record<string, { answeredOptionId: string; isCorrect: boolean }>>({});

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Main Animation Lifecycle
  useEffect(() => {
    const updateProgress = (deltaTime: number) => {
      setState((prev) => {
        if (!prev.isPlaying) return prev;

        const deltaProgress = deltaTime * 0.08 * prev.speed;
        const nextProgress = prev.progress + deltaProgress;

        if (nextProgress >= 1000) {
          return { ...prev, progress: 1000, isPlaying: false };
        }

        return { ...prev, progress: nextProgress };
      });
    };

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaTime = Math.min(64, time - lastTimeRef.current);
        updateProgress(deltaTime);
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Determine current biological milestone
  const currentStep =
    BIOLOGICAL_STEPS.slice()
      .reverse()
      .find((step) => state.progress >= step.target - 20) || BIOLOGICAL_STEPS[0];

  // Navigation handlers
  const handleStepForward = useCallback(() => {
    setState((s) => {
      const nextStep = BIOLOGICAL_STEPS.find((step) => step.target > s.progress + 5);
      if (!nextStep) return { ...s, progress: 1000, isPlaying: false };
      return { ...s, progress: nextStep.target, isPlaying: false };
    });
  }, []);

  const handleStepBackward = useCallback(() => {
    setState((s) => {
      const prevSteps = BIOLOGICAL_STEPS.filter((step) => step.target < s.progress - 10);
      const prevStep = prevSteps[prevSteps.length - 1] || BIOLOGICAL_STEPS[0];
      return { ...s, progress: prevStep.target, isPlaying: false };
    });
  }, []);

  const handleReset = useCallback(() => {
    setState((s) => ({
      ...s,
      progress: 0,
      isPlaying: false,
      selectedObject: null,
    }));
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          setState((s) => ({ ...s, isPlaying: !s.isPlaying }));
          break;
        case "ArrowRight":
          e.preventDefault();
          handleStepForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleStepBackward();
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleReset();
          break;
        case "d":
        case "D":
          e.preventDefault();
          setState((s) => ({ ...s, showDirection: !s.showDirection }));
          break;
        case "l":
        case "L":
          e.preventDefault();
          setState((s) => ({ ...s, showLabels: !s.showLabels }));
          break;
        case "s":
        case "S":
          e.preventDefault();
          setState((s) => ({ ...s, showBaseLetters: !s.showBaseLetters }));
          break;
        case "e":
        case "E":
          e.preventDefault();
          setState((s) => ({ ...s, showEnzymes: !s.showEnzymes }));
          break;
        case "z":
        case "Z":
          e.preventDefault();
          setState((s) => ({ ...s, showActiveSiteModal: true, isPlaying: false }));
          break;
        case "Escape":
          setState((s) => ({
            ...s,
            showActiveSiteModal: false,
            selectedObject: null,
          }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleStepForward, handleStepBackward, handleReset]);

  return (
    <VisualizationShell
      metadata={metadata}
      controls={
        <ControlBar
          state={state}
          setState={setState}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onReset={handleReset}
        />
      }
      sidebar={
        <InfoPanel
          state={state}
          setState={setState}
          currentStep={currentStep}
          onOpenActiveSite={() => setState((s) => ({ ...s, showActiveSiteModal: true, isPlaying: false }))}
          onOpenPrediction={(predId) => {
            setState((s) => ({ ...s, isPlaying: false }));
            setActivePredictionId(predId);
          }}
        />
      }
      onOpenActiveSite={() => setState((s) => ({ ...s, showActiveSiteModal: true, isPlaying: false }))}
      activeSiteButtonLabel="🔬 Active Site"
    >
      {/* SCREEN READER ACCESSIBILITY LIVE REGION */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Current step: {currentStep.name}. {currentStep.desc}
      </div>

      {/* Main Visualization Canvas & SVG */}
      <NucleoplasmCanvas state={state} />
      <DNARenderer state={state} setState={setState} />

      {/* Quick Scientific Legend Watermark */}
      <div className="absolute bottom-4 left-4 z-10 hidden md:flex items-center gap-4 bg-white/90 backdrop-blur-xs border border-border px-3 py-2 font-mono text-[10px] text-muted shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-foreground inline-block" />
          <span>Parental DNA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-blue-600 inline-block" />
          <span>New DNA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-pink-600 inline-block stroke-dashed" />
          <span>RNA Primer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
          <span>Polymerase</span>
        </div>
      </div>

      {/* Prediction Hypothesis Modal */}
      {activePredictionId && PREDICTION_SCENARIOS[activePredictionId] && (
        <PredictionModal
          scenario={PREDICTION_SCENARIOS[activePredictionId]}
          historyEntry={predictionHistory[activePredictionId]}
          onAnswer={(scId, optId, isCorr) => {
            setPredictionHistory((prev) => ({
              ...prev,
              [scId]: { answeredOptionId: optId, isCorrect: isCorr },
            }));
          }}
          onClose={() => setActivePredictionId(null)}
          onResume={() => {
            setActivePredictionId(null);
            setState((s) => ({ ...s, isPlaying: true }));
          }}
        />
      )}

      {/* Active Site Mechanism Modal */}
      <ActiveSiteModal
        isOpen={state.showActiveSiteModal || false}
        onClose={() => setState((s) => ({ ...s, showActiveSiteModal: false }))}
      />
    </VisualizationShell>
  );
}
