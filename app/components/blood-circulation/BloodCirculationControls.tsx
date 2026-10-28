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

const MODES: Array<{
  id: CirculationMode;
  label: string;
  shortLabel: string;
  activeClass: string;
  idleClass: string;
}> = [
  {
    id: "full",
    label: "Dual Circulation (Full Loop)",
    shortLabel: "Full Loop",
    activeClass: "bg-foreground text-background border-foreground",
    idleClass: "bg-white text-muted border-border hover:border-foreground hover:text-foreground",
  },
  {
    id: "pulmonary",
    label: "Pulmonary Loop (Heart ↔ Lungs)",
    shortLabel: "Pulmonary",
    activeClass: "bg-blue-600 text-white border-blue-600",
    idleClass: "bg-white text-muted border-border hover:border-blue-500 hover:text-blue-700",
  },
  {
    id: "systemic",
    label: "Systemic Loop (Heart ↔ Body)",
    shortLabel: "Systemic",
    activeClass: "bg-red-600 text-white border-red-600",
    idleClass: "bg-white text-muted border-border hover:border-red-500 hover:text-red-700",
  },
  {
    id: "trace",
    label: "Step-by-Step Trace (1 → 9)",
    shortLabel: "Trace 1→9",
    activeClass: "bg-slate-800 text-white border-slate-800",
    idleClass: "bg-white text-muted border-border hover:border-slate-700 hover:text-slate-800",
  },
];

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
  const currentStep = CIRCULATION_STEPS[currentStepIndex];

  return (
    <footer className="flex shrink-0 select-none flex-col gap-2 border-t border-border bg-white p-2 font-mono text-xs sm:gap-2.5 sm:p-3 md:px-6">
      {/* 1. CIRCUIT MODE + SPEED */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <span className="hidden mr-1 shrink-0 font-semibold uppercase tracking-wider text-muted sm:inline">
          Circuit
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-0.5">
          <div
            className="flex shrink-0 items-center gap-1"
            role="group"
            aria-label="Circulation circuit"
          >
            {MODES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setMode(entry.id)}
                aria-pressed={mode === entry.id}
                title={entry.label}
                className={`shrink-0 cursor-pointer border px-2 py-1.5 font-semibold transition-colors sm:px-2.5 ${
                  mode === entry.id ? entry.activeClass : entry.idleClass
                }`}
              >
                <span className="hidden xl:inline">{entry.label}</span>
                <span className="xl:hidden">{entry.shortLabel}</span>
              </button>
            ))}
          </div>

          <div
            className="ml-auto flex shrink-0 items-center gap-1.5 text-[10px]"
            role="group"
            aria-label="Flow speed"
          >
            <span className="hidden font-semibold uppercase tracking-wider text-muted sm:inline">
              Speed
            </span>
            {[0.5, 1, 2].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => setFlowSpeed(speed)}
                aria-pressed={flowSpeed === speed}
                aria-label={`Flow speed ${speed} times`}
                className={`cursor-pointer border px-2 py-0.5 font-semibold transition-colors ${
                  flowSpeed === speed
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-white text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PLAYBACK / STEP + DISPLAY TOGGLES */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
          {isTraceMode && (
            <>
              <button
                type="button"
                onClick={onPrevStep}
                className="cursor-pointer border border-border px-2 py-1.5 text-[11px] text-foreground transition-colors hover:border-foreground sm:px-2.5"
                title="Previous circulation step (←)"
              >
                ← Prev
              </button>
              <span
                className="max-w-[150px] truncate border border-border bg-slate-50 px-2 py-1.5 text-[10px] font-semibold text-foreground sm:max-w-[260px]"
                aria-live="polite"
              >
                {currentStep.step} / {CIRCULATION_STEPS.length} ·{" "}
                {currentStep.structureName}
              </span>
              <button
                type="button"
                onClick={onNextStep}
                className="cursor-pointer border border-foreground bg-foreground px-2 py-1.5 text-[11px] font-semibold text-background transition-colors hover:bg-slate-800 sm:px-2.5"
                title="Next circulation step (→)"
              >
                Next →
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsPlaying((previous) => !previous)}
            aria-pressed={isPlaying}
            className={`flex cursor-pointer items-center gap-1.5 border px-2 py-1.5 text-[11px] font-semibold transition-colors sm:px-2.5 ${
              isPlaying
                ? "border-border bg-white text-foreground hover:border-foreground"
                : "border-foreground bg-foreground text-background hover:bg-slate-800"
            }`}
            title={
              isTraceMode
                ? isPlaying
                  ? "Pause automatic step advance (Space)"
                  : "Resume automatic step advance (Space)"
                : isPlaying
                  ? "Pause flow animation (Space)"
                  : "Resume flow animation (Space)"
            }
          >
            <span aria-hidden="true">{isPlaying ? "❚❚" : "▶"}</span>
            <span className="hidden sm:inline">
              {isTraceMode
                ? isPlaying
                  ? "Pause trace"
                  : "Auto-advance"
                : isPlaying
                  ? "Pause flow"
                  : "Resume flow"}
            </span>
            <span className="sm:hidden">{isPlaying ? "Pause" : "Play"}</span>
          </button>
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 text-[10px] sm:flex">
          <button
            type="button"
            onClick={() => setShowVectors((value) => !value)}
            aria-pressed={showVectors}
            className={`cursor-pointer border px-2.5 py-1 transition-colors ${
              showVectors
                ? "border-blue-600 bg-blue-50 font-semibold text-blue-800"
                : "border-border bg-white text-muted hover:border-foreground hover:text-foreground"
            }`}
            title="Show or hide the continuous circulation pathway"
          >
            Flow Path
          </button>

          <button
            type="button"
            onClick={() => setShowOxygenation((value) => !value)}
            aria-pressed={showOxygenation}
            className={`cursor-pointer border px-2.5 py-1 transition-colors ${
              showOxygenation
                ? "border-red-600 bg-red-50 font-semibold text-red-800"
                : "border-border bg-white text-muted hover:border-foreground hover:text-foreground"
            }`}
            title="Show or hide oxygen-saturation values"
          >
            O₂ Saturation
          </button>

          <button
            type="button"
            onClick={() => setShowLabels((value) => !value)}
            aria-pressed={showLabels}
            className={`cursor-pointer border px-2.5 py-1 transition-colors ${
              showLabels
                ? "border-foreground bg-slate-100 font-semibold text-foreground"
                : "border-border bg-white text-muted hover:border-foreground hover:text-foreground"
            }`}
            title="Show or hide anatomical labels"
          >
            Labels
          </button>

          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer border border-border px-2.5 py-1 uppercase tracking-wider text-muted transition-colors hover:border-foreground hover:text-foreground"
            title="Reset to the default full-circulation view (R)"
          >
            Reset
          </button>
        </div>
      </div>
    </footer>
  );
}
