"use client";

import React from "react";

interface DNAStructureControlsProps {
  unzipProgress: number;
  setUnzipProgress: (val: number) => void;
  rotationAngle: number;
  setRotationAngle: (val: number) => void;
  isRotating: boolean;
  setIsRotating: (fn: (prev: boolean) => boolean) => void;
  filterMode: "all" | "at" | "gc";
  setFilterMode: (mode: "all" | "at" | "gc") => void;
  showDirection: boolean;
  setShowDirection: (fn: (prev: boolean) => boolean) => void;
  showHydrogenBonds: boolean;
  setShowHydrogenBonds: (fn: (prev: boolean) => boolean) => void;
  showBaseLetters: boolean;
  setShowBaseLetters: (fn: (prev: boolean) => boolean) => void;
  showGrooveLabels: boolean;
  setShowGrooveLabels: (fn: (prev: boolean) => boolean) => void;
  onReset: () => void;
}

export default function DNAStructureControls({
  unzipProgress,
  setUnzipProgress,
  rotationAngle,
  setRotationAngle,
  isRotating,
  setIsRotating,
  filterMode,
  setFilterMode,
  showDirection,
  setShowDirection,
  showHydrogenBonds,
  setShowHydrogenBonds,
  showBaseLetters,
  setShowBaseLetters,
  showGrooveLabels,
  setShowGrooveLabels,
  onReset,
}: DNAStructureControlsProps) {
  const degrees = Math.round(((rotationAngle % (2 * Math.PI)) / (2 * Math.PI)) * 360);
  const unzipPct = Math.round(unzipProgress * 100);

  return (
    <footer className="border-t border-border bg-white p-3 md:px-6 z-10 flex flex-col gap-3 font-mono text-xs select-none">
      {/* 1. PRIMARY EXPERIMENT SLIDERS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-gray-100">
        {/* Strand Separation / Unzip Slider */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] text-muted">
            <span className="font-semibold text-foreground uppercase tracking-wider">
              Strand Separation (Unzip Dynamics)
            </span>
            <span className={`font-bold ${unzipPct > 40 ? "text-red-600" : "text-blue-600"}`}>
              {unzipPct === 0 ? "0% (Intact B-DNA)" : unzipPct === 100 ? "100% (Denatured ssDNA)" : `${unzipPct}% Separated`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={unzipProgress}
            onChange={(e) => setUnzipProgress(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
            aria-label="DNA strand separation unzipping progress"
          />
        </div>

        {/* 3D Helical Angle Rotation */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] text-muted">
            <span className="font-semibold text-foreground uppercase tracking-wider">
              Helical Perspective Angle (360°)
            </span>
            <span className="font-bold text-emerald-700">{degrees}°</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={2 * Math.PI}
              step="0.05"
              value={rotationAngle % (2 * Math.PI)}
              onChange={(e) => setRotationAngle(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
              aria-label="Helical rotation angle"
            />
            <button
              type="button"
              onClick={() => setIsRotating((r) => !r)}
              className={`px-2 py-0.5 border text-[10px] uppercase font-semibold shrink-0 cursor-pointer ${
                isRotating
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {isRotating ? "⏸ Spin" : "▶ Auto"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. PRESETS, FILTERS & DISPLAY TOGGLES */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Unzip Presets */}
        <div className="flex items-center gap-1.5 text-[10px] overflow-x-auto">
          <span className="text-muted uppercase tracking-wider font-semibold mr-1">Unzip:</span>
          <button
            type="button"
            onClick={() => setUnzipProgress(0)}
            className={`px-2 py-1 border transition-all cursor-pointer ${
              unzipProgress === 0
                ? "bg-foreground text-background border-foreground font-semibold"
                : "bg-white text-muted border-border hover:border-foreground"
            }`}
          >
            Intact Duplex
          </button>
          <button
            type="button"
            onClick={() => setUnzipProgress(0.5)}
            className={`px-2 py-1 border transition-all cursor-pointer ${
              unzipProgress === 0.5
                ? "bg-foreground text-background border-foreground font-semibold"
                : "bg-white text-muted border-border hover:border-foreground"
            }`}
          >
            50% Unzipped
          </button>
          <button
            type="button"
            onClick={() => setUnzipProgress(1)}
            className={`px-2 py-1 border transition-all cursor-pointer ${
              unzipProgress === 1
                ? "bg-foreground text-background border-foreground font-semibold"
                : "bg-white text-muted border-border hover:border-foreground"
            }`}
          >
            100% ssDNA
          </button>
        </div>

        {/* Base Pair Highlighting Filters */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-muted uppercase tracking-wider font-semibold mr-1">Focus:</span>
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-2 py-1 border transition-all cursor-pointer ${
              filterMode === "all"
                ? "bg-blue-600 text-white border-blue-600 font-semibold"
                : "bg-white text-muted border-border hover:border-foreground"
            }`}
          >
            All Bases
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("at")}
            className={`px-2 py-1 border transition-all cursor-pointer ${
              filterMode === "at"
                ? "bg-amber-600 text-white border-amber-600 font-semibold"
                : "bg-white text-muted border-border hover:border-foreground"
            }`}
          >
            A═T Only (2 H)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("gc")}
            className={`px-2 py-1 border transition-all cursor-pointer ${
              filterMode === "gc"
                ? "bg-emerald-600 text-white border-emerald-600 font-semibold"
                : "bg-white text-muted border-border hover:border-foreground"
            }`}
          >
            G≡C Only (3 H)
          </button>
        </div>

        {/* Feature Display Toggles & Reset */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={() => setShowDirection((d) => !d)}
            className={`px-2 py-1 border transition-colors cursor-pointer ${
              showDirection
                ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold"
                : "border-border text-muted"
            }`}
            title="Toggle 5' -> 3' directionality arrows"
          >
            5′→3′ Direction
          </button>

          <button
            type="button"
            onClick={() => setShowHydrogenBonds((h) => !h)}
            className={`px-2 py-1 border transition-colors cursor-pointer ${
              showHydrogenBonds
                ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
                : "border-border text-muted"
            }`}
            title="Toggle hydrogen bond rungs"
          >
            H-Bonds
          </button>

          <button
            type="button"
            onClick={() => setShowBaseLetters((l) => !l)}
            className={`px-2 py-1 border transition-colors cursor-pointer ${
              showBaseLetters
                ? "border-foreground bg-gray-100 text-foreground font-semibold"
                : "border-border text-muted"
            }`}
            title="Toggle base single-letter typography"
          >
            A/T/G/C
          </button>

          <button
            type="button"
            onClick={() => setShowGrooveLabels((g) => !g)}
            className={`px-2 py-1 border transition-colors cursor-pointer ${
              showGrooveLabels
                ? "border-purple-600 bg-purple-50 text-purple-800 font-semibold"
                : "border-border text-muted"
            }`}
            title="Toggle major and minor groove dimensional annotations"
          >
            Grooves
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1 border border-border hover:border-foreground text-muted hover:text-foreground uppercase cursor-pointer"
            title="Reset to intact default configuration"
          >
            Reset
          </button>
        </div>
      </div>
    </footer>
  );
}
