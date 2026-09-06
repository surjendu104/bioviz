"use client";

import React from "react";
import { CirculationMode, CIRCULATION_STEPS } from "@/lib/biology/bloodCirculationModel";

interface BloodCirculationControlsProps {
  mode: CirculationMode;
  setMode: (mode: CirculationMode) => void;
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  isPlaying: boolean;
  setIsPlaying: (fn: (prev: boolean) => boolean) => void;
  flowSpeed: number;
  setFlowSpeed: (speed: number) => void;
  showLabels: boolean;
  setShowLabels: (fn: (prev: boolean) => boolean) => void;
  showVectors: boolean;
  setShowVectors: (fn: (prev: boolean) => boolean) => void;
  showOxygenation: boolean;
  setShowOxygenation: (fn: (prev: boolean) => boolean) => void;
  onReset: () => void;
}

export default function BloodCirculationControls({
  mode,
  setMode,
  currentStepIndex,
  onNextStep,
  onPrevStep,
  isPlaying,
  setIsPlaying,
  flowSpeed,
  setFlowSpeed,
  showLabels,
  setShowLabels,
  showVectors,
  setShowVectors,
  showOxygenation,
  setShowOxygenation,
  onReset,
}: BloodCirculationControlsProps) {
  const isTraceMode = mode === "trace";

  return (
    <footer className="border-t border-border bg-white p-3 md:px-6 z-10 flex flex-col gap-3 font-mono text-xs select-none">
      {/* 1. CIRCULATION CIRCUIT MODE PICKER */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
          <span className="text-muted uppercase tracking-wider font-semibold mr-1 shrink-0">
            Circulation Circuit:
          </span>
          <button
            type="button"
            onClick={() => setMode("full")}
            className={`px-3 py-1.5 border transition-all cursor-pointer font-semibold ${
              mode === "full"
                ? "bg-foreground text-background border-foreground shadow-xs"
                : "bg-white text-muted border-border hover:border-foreground hover:text-foreground"
            }`}
          >
            Dual Circulation (Full Loop)
          </button>
          <button
            type="button"
            onClick={() => setMode("pulmonary")}
            className={`px-3 py-1.5 border transition-all cursor-pointer font-semibold ${
              mode === "pulmonary"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-white text-muted border-border hover:border-blue-500 hover:text-blue-600"
            }`}
          >
            Pulmonary Loop (Heart ↔ Lungs)
          </button>
          <button
            type="button"
            onClick={() => setMode("systemic")}
            className={`px-3 py-1.5 border transition-all cursor-pointer font-semibold ${
              mode === "systemic"
                ? "bg-red-600 text-white border-red-600 shadow-xs"
                : "bg-white text-muted border-border hover:border-red-500 hover:text-red-600"
            }`}
          >
            Systemic Loop (Heart ↔ Body)
          </button>
          <button
            type="button"
            onClick={() => setMode("trace")}
            className={`px-3 py-1.5 border transition-all cursor-pointer font-semibold ${
              mode === "trace"
                ? "bg-purple-700 text-white border-purple-700 shadow-xs"
                : "bg-white text-muted border-border hover:border-purple-600 hover:text-purple-700"
            }`}
          >
            Step-by-Step Trace (1 → 9)
          </button>
        </div>

        {/* Speed Multiplier */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-muted uppercase tracking-wider font-semibold">Speed:</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFlowSpeed(s)}
              className={`px-2 py-0.5 border cursor-pointer font-semibold ${
                flowSpeed === s
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white text-muted border-border hover:border-foreground"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* 2. PLAYBACK & TRACE STEP CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {isTraceMode ? (
          /* Step-by-Step Stepper Controls */
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevStep}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 border border-border hover:border-foreground disabled:opacity-40 disabled:hover:border-border text-foreground transition-colors cursor-pointer text-xs"
            >
              ← Previous Step
            </button>

            <span className="text-[10px] text-purple-900 font-bold px-2 py-1 bg-purple-50 border border-purple-200">
              Step {currentStepIndex + 1} / {CIRCULATION_STEPS.length}: {CIRCULATION_STEPS[currentStepIndex].structureName}
            </span>

            <button
              type="button"
              onClick={onNextStep}
              disabled={currentStepIndex === CIRCULATION_STEPS.length - 1}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white font-semibold transition-colors cursor-pointer text-xs"
            >
              Next Step →
            </button>
          </div>
        ) : (
          /* Continuous Blood Flow Animation Play/Pause */
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className={`px-3.5 py-1.5 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                isPlaying
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-foreground text-background hover:bg-gray-800"
              }`}
            >
              <span>{isPlaying ? "⏸ Pause Flow" : "▶ Resume Blood Flow"}</span>
            </button>
          </div>
        )}

        {/* Feature Display Toggles & Reset */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={() => setShowVectors((v) => !v)}
            className={`px-2.5 py-1 border transition-colors cursor-pointer ${
              showVectors
                ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold"
                : "border-border text-muted"
            }`}
            title="Toggle flow direction vectors along vessel tracks"
          >
            Flow Vectors
          </button>

          <button
            type="button"
            onClick={() => setShowOxygenation((o) => !o)}
            className={`px-2.5 py-1 border transition-colors cursor-pointer ${
              showOxygenation
                ? "border-indigo-600 bg-indigo-50 text-indigo-800 font-semibold"
                : "border-border text-muted"
            }`}
            title="Toggle oxygen saturation callouts"
          >
            Oxygen Saturation
          </button>

          <button
            type="button"
            onClick={() => setShowLabels((l) => !l)}
            className={`px-2.5 py-1 border transition-colors cursor-pointer ${
              showLabels
                ? "border-foreground bg-gray-100 text-foreground font-semibold"
                : "border-border text-muted"
            }`}
            title="Toggle anatomical structure labels"
          >
            Labels
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1 border border-border hover:border-foreground text-muted hover:text-foreground uppercase cursor-pointer"
            title="Reset to default full circulation view"
          >
            Reset
          </button>
        </div>
      </div>
    </footer>
  );
}
