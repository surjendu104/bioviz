"use client";

import React from "react";

interface OsmosisControlsProps {
  leftSoluteConc: number;
  setLeftSoluteConc: (val: number) => void;
  rightSoluteConc: number;
  setRightSoluteConc: (val: number) => void;
  setPermeabilityMode: (mode: "selective" | "impermeable" | "pore-open") => void;
  temperatureK: number;
  setTemperatureK: (val: number) => void;
  isPlaying: boolean;
  setIsPlaying: (fn: (prev: boolean) => boolean) => void;
  onReset: () => void;
  showVectors: boolean;
  setShowVectors: (fn: (prev: boolean) => boolean) => void;
  showLabels: boolean;
  setShowLabels: (fn: (prev: boolean) => boolean) => void;
}

export default function OsmosisControls({
  leftSoluteConc,
  setLeftSoluteConc,
  rightSoluteConc,
  setRightSoluteConc,
  setPermeabilityMode,
  temperatureK,
  setTemperatureK,
  isPlaying,
  setIsPlaying,
  onReset,
  showVectors,
  setShowVectors,
  showLabels,
  setShowLabels,
}: OsmosisControlsProps) {
  // Presets
  const applyPreset = (left: number, right: number, mode: "selective" | "impermeable" | "pore-open") => {
    setLeftSoluteConc(left);
    setRightSoluteConc(right);
    setPermeabilityMode(mode);
  };

  return (
    <footer className="border-t border-border bg-white p-3 md:px-6 z-10 flex flex-col gap-3 font-mono text-xs select-none">
      {/* 1. PHYSICAL EXPERIMENT SLIDERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2 border-b border-gray-100">
        {/* Left Chamber Solute Slider */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] text-muted">
            <span className="font-semibold text-foreground uppercase">Chamber A [Solute]</span>
            <span className="font-bold text-blue-600">{leftSoluteConc.toFixed(2)} M</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={leftSoluteConc}
            onChange={(e) => setLeftSoluteConc(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
            aria-label="Chamber A Solute Concentration"
          />
        </div>

        {/* Right Chamber Solute Slider */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] text-muted">
            <span className="font-semibold text-foreground uppercase">Chamber B [Solute]</span>
            <span className="font-bold text-blue-600">{rightSoluteConc.toFixed(2)} M</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={rightSoluteConc}
            onChange={(e) => setRightSoluteConc(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
            aria-label="Chamber B Solute Concentration"
          />
        </div>

        {/* Temperature Slider */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] text-muted">
            <span className="font-semibold text-foreground uppercase">Thermal Energy (T)</span>
            <span className="font-bold text-amber-600">{temperatureK} K ({temperatureK - 273}°C)</span>
          </div>
          <input
            type="range"
            min="273"
            max="325"
            step="1"
            value={temperatureK}
            onChange={(e) => setTemperatureK(parseInt(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
            aria-label="Temperature"
          />
        </div>
      </div>

      {/* 2. PRESETS & PLAYBACK CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPlaying
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-foreground text-background hover:bg-gray-800"
            }`}
          >
            <span>{isPlaying ? "⏸ Pause Flux" : "▶ Resume Flux"}</span>
          </button>

          <button
            onClick={onReset}
            className="px-3 py-1.5 border border-border hover:border-foreground transition-colors text-muted hover:text-foreground cursor-pointer text-xs"
            title="Reset to 0.50 M isotonic equilibrium"
          >
            Reset
          </button>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
          <span className="text-muted uppercase tracking-wider font-semibold mr-1">Presets:</span>
          <button
            onClick={() => applyPreset(0.2, 0.2, "selective")}
            className="px-2 py-1 border border-border hover:border-foreground bg-gray-50 text-foreground cursor-pointer"
          >
            Isotonic (0.2M : 0.2M)
          </button>
          <button
            onClick={() => applyPreset(0.05, 0.85, "selective")}
            className="px-2 py-1 border border-border hover:border-foreground bg-gray-50 text-foreground cursor-pointer"
          >
            Hypo → Hyper Influx
          </button>
          <button
            onClick={() => applyPreset(0.9, 0.1, "selective")}
            className="px-2 py-1 border border-border hover:border-foreground bg-gray-50 text-foreground cursor-pointer"
          >
            Reverse Gradient
          </button>
          <button
            onClick={() => applyPreset(0.1, 0.8, "impermeable")}
            className="px-2 py-1 border border-border hover:border-foreground bg-gray-50 text-muted cursor-pointer"
          >
            Impermeable Barrier
          </button>
        </div>

        {/* Display Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVectors((v) => !v)}
            className={`px-2 py-1 border text-[10px] uppercase transition-colors cursor-pointer ${
              showVectors
                ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold"
                : "border-border text-muted"
            }`}
          >
            Vectors
          </button>
          <button
            onClick={() => setShowLabels((l) => !l)}
            className={`px-2 py-1 border text-[10px] uppercase transition-colors cursor-pointer ${
              showLabels
                ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold"
                : "border-border text-muted"
            }`}
          >
            Labels
          </button>
        </div>
      </div>
    </footer>
  );
}
