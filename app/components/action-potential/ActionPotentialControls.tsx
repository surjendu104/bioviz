"use client";

import React from "react";

interface ActionPotentialControlsProps {
  onStimulate: (intensity: "subthreshold" | "suprathreshold") => void;
  blocker: "none" | "ttx" | "tea";
  setBlocker: (b: "none" | "ttx" | "tea") => void;
  onReset: () => void;
  showConductance: boolean;
  setShowConductance: (fn: (prev: boolean) => boolean) => void;
}

export default function ActionPotentialControls({
  onStimulate,
  blocker,
  setBlocker,
  onReset,
  showConductance,
  setShowConductance,
}: ActionPotentialControlsProps) {
  return (
    <footer className="border-t border-border bg-white p-3 md:px-6 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs select-none">
      {/* 1. STIMULUS INJECTION BUTTONS */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={() => onStimulate("suprathreshold")}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
        >
          <span>⚡ Inject Suprathreshold Pulse (+25mV)</span>
        </button>

        <button
          onClick={() => onStimulate("subthreshold")}
          className="px-2.5 py-1.5 border border-border hover:border-foreground bg-gray-50 text-foreground transition-colors cursor-pointer text-xs"
          title="Inject subthreshold pulse (+10mV) to test all-or-none threshold"
        >
          Subthreshold (+10mV)
        </button>
      </div>

      {/* 2. PHARMACOLOGICAL TOXIN TOGGLES */}
      <div className="flex items-center gap-1.5 text-[10px] overflow-x-auto">
        <span className="text-muted uppercase tracking-wider font-semibold">Toxin:</span>
        <button
          onClick={() => setBlocker("none")}
          className={`px-2 py-1 border transition-all cursor-pointer ${
            blocker === "none"
              ? "bg-foreground text-background border-foreground font-semibold"
              : "bg-white text-muted border-border hover:border-foreground"
          }`}
        >
          Control (None)
        </button>
        <button
          onClick={() => setBlocker("ttx")}
          className={`px-2 py-1 border transition-all cursor-pointer ${
            blocker === "ttx"
              ? "bg-red-600 text-white border-red-600 font-semibold"
              : "bg-white text-muted border-border hover:border-red-600 hover:text-red-600"
          }`}
          title="Tetrodotoxin: selectively blocks voltage-gated Na+ channels"
        >
          + TTX (Block Na⁺)
        </button>
        <button
          onClick={() => setBlocker("tea")}
          className={`px-2 py-1 border transition-all cursor-pointer ${
            blocker === "tea"
              ? "bg-red-600 text-white border-red-600 font-semibold"
              : "bg-white text-muted border-border hover:border-red-600 hover:text-red-600"
          }`}
          title="Tetraethylammonium: selectively blocks voltage-gated K+ channels"
        >
          + TEA (Block K⁺)
        </button>
      </div>

      {/* 3. DISPLAY & RESET */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowConductance((c) => !c)}
          className={`px-2 py-1 border text-[10px] uppercase transition-colors cursor-pointer ${
            showConductance
              ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold"
              : "border-border text-muted"
          }`}
        >
          Conductance (g)
        </button>

        <button
          onClick={onReset}
          className="px-2.5 py-1 border border-border hover:border-foreground text-muted hover:text-foreground text-[10px] uppercase cursor-pointer"
        >
          Reset
        </button>
      </div>
    </footer>
  );
}
