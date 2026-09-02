"use client";

import React from "react";
import { AppState } from "@/lib/types";
import { BIOLOGICAL_STEPS } from "@/lib/biology/dnaModel";

interface ControlBarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
}

export default function ControlBar({
  state,
  setState,
  onStepForward,
  onStepBackward,
  onReset
}: ControlBarProps) {
  const togglePlay = () => setState((s) => ({ ...s, isPlaying: !s.isPlaying }));

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setState((s) => ({ ...s, progress: val }));
  };

  const handleJumpToStep = (target: number) => {
    setState((s) => ({ ...s, progress: target, isPlaying: false }));
  };

  return (
    <footer className="border-t border-border bg-white p-3 md:px-6 z-10 flex flex-col gap-3 font-mono text-xs select-none">
      {/* 1. TIMELINE & MILESTONE SCRUBBER */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px] text-muted uppercase tracking-wider">
          <span>Replication Timeline / Milestones</span>
          <span>{Math.round((state.progress / 1000) * 100)}% Complete</span>
        </div>

        {/* Milestone Steps Bar */}
        <div className="relative w-full flex items-center py-1">
          <input
            type="range"
            min="0"
            max="1000"
            step="1"
            value={state.progress}
            onChange={handleSeek}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
            aria-label="Replication progress timeline"
          />
        </div>

        {/* Step Tick Marks */}
        <div className="flex justify-between items-center px-1">
          {BIOLOGICAL_STEPS.map((step) => {
            const isPassed = state.progress >= step.target;
            const isCurrent = Math.abs(state.progress - step.target) < 60;

            return (
              <button
                key={step.id}
                onClick={() => handleJumpToStep(step.target)}
                title={`${step.phase}: ${step.name}`}
                className={`group flex flex-col items-center cursor-pointer transition-all ${
                  isCurrent
                    ? "text-blue-600 font-bold scale-110"
                    : isPassed
                      ? "text-foreground opacity-80"
                      : "text-muted opacity-40 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-colors mb-0.5 ${
                    isCurrent
                      ? "bg-blue-600 ring-2 ring-blue-200"
                      : isPassed
                        ? "bg-foreground"
                        : "bg-gray-300 group-hover:bg-gray-400"
                  }`}
                />
                <span className="text-[9px] hidden sm:inline-block">
                  0{step.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PRIMARY ACTION CONTROLS & TOGGLES */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-gray-100">
        {/* Play / Step Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={togglePlay}
            className="px-4 py-2 bg-foreground text-background hover:bg-gray-800 transition-colors uppercase tracking-wider font-semibold flex items-center gap-1.5 min-w-[90px] justify-center"
            aria-label={
              state.isPlaying ? "Pause simulation" : "Play simulation"
            }
          >
            <span>{state.isPlaying ? "⏸ Pause" : "▶ Play"}</span>
          </button>

          <button
            onClick={onStepBackward}
            disabled={state.progress <= 0}
            className="px-2.5 py-2 border border-border hover:bg-gray-50 transition-colors disabled:opacity-30 uppercase"
            title="Previous Milestone (←)"
            aria-label="Previous step"
          >
            ← Prev
          </button>

          <button
            onClick={onStepForward}
            disabled={state.progress >= 1000}
            className="px-3 py-2 border border-border hover:bg-gray-50 transition-colors disabled:opacity-30 uppercase font-medium"
            title="Next Milestone (→)"
            aria-label="Next step"
          >
            Next Step →
          </button>

          <button
            onClick={onReset}
            className="px-2.5 py-2 text-muted hover:text-foreground hover:bg-gray-50 border border-transparent hover:border-border transition-colors uppercase"
            title="Reset to origin (R)"
            aria-label="Reset simulation"
          >
            ↺ Reset
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2">
          <span className="text-muted text-[11px] uppercase tracking-wider hidden sm:inline">
            Speed
          </span>
          <div className="flex border border-border divide-x divide-border">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setState((st) => ({ ...st, speed: s }))}
                className={`px-2 py-1 text-[10px] transition-colors ${
                  state.speed === s
                    ? "bg-foreground text-background font-bold"
                    : "bg-white text-muted hover:text-foreground"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* View Switches & Toggles */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Direction 5'/3' toggle */}
          <button
            onClick={() =>
              setState((s) => ({ ...s, showDirection: !s.showDirection }))
            }
            className={`px-2 py-1 border text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 ${
              state.showDirection
                ? "border-blue-600 bg-blue-50/70 text-blue-900 font-bold"
                : "border-border text-muted hover:text-foreground"
            }`}
            title="Toggle 5' → 3' Polarity Vectors (D)"
          >
            <span>5&apos;→3&apos; Polarity</span>
          </button>

          {/* Base Sequence (A/T/G/C) toggle */}
          <button
            onClick={() =>
              setState((s) => ({ ...s, showBaseLetters: !s.showBaseLetters }))
            }
            className={`px-2 py-1 border text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 ${
              state.showBaseLetters
                ? "border-blue-600 bg-blue-50/70 text-blue-900 font-bold"
                : "border-border text-muted hover:text-foreground"
            }`}
            title="Toggle Nucleotide Letters (S)"
          >
            <span>Bases (A/T/G/C)</span>
          </button>

          {/* Enzyme Annotations toggle */}
          <button
            onClick={() =>
              setState((s) => ({ ...s, showLabels: !s.showLabels }))
            }
            className={`px-2 py-1 border text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 ${
              state.showLabels
                ? "border-blue-600 bg-blue-50/70 text-blue-900 font-bold"
                : "border-border text-muted hover:text-foreground"
            }`}
            title="Toggle Structural Labels (L)"
          >
            <span>Labels</span>
          </button>

          {/* Substrates / Particle Pool toggle */}
          <button
            onClick={() =>
              setState((s) => ({ ...s, showParticles: !s.showParticles }))
            }
            className={`px-2 py-1 border text-[10px] uppercase tracking-wider transition-colors hidden md:flex items-center gap-1 ${
              state.showParticles
                ? "border-blue-600 bg-blue-50/70 text-blue-900 font-bold"
                : "border-border text-muted hover:text-foreground"
            }`}
            title="Toggle dNTP Substrates Pool"
          >
            <span>dNTP Pool</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
