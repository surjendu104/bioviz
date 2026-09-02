"use client";

import React from "react";

interface EnzymeControlsProps {
  substrateConc: number;
  setSubstrateConc: (s: number) => void;
  enzymeConc: number;
  setEnzymeConc: (e: number) => void;
  inhibitorType: "none" | "competitive" | "noncompetitive";
  setInhibitorType: (t: "none" | "competitive" | "noncompetitive") => void;
  plotType: "michaelis-menten" | "lineweaver-burk";
  setPlotType: (p: "michaelis-menten" | "lineweaver-burk") => void;
  onReset: () => void;
}

export default function EnzymeControls({
  substrateConc,
  setSubstrateConc,
  enzymeConc,
  setEnzymeConc,
  inhibitorType,
  setInhibitorType,
  plotType,
  setPlotType,
  onReset,
}: EnzymeControlsProps) {
  return (
    <footer className="border-t border-border bg-white p-3 md:px-6 z-10 flex flex-col gap-3 font-mono text-xs select-none">
      {/* 1. SLIDERS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-gray-100">
        {/* Substrate [S] Slider */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] text-muted">
            <span className="font-semibold text-foreground uppercase">Substrate Concentration [S]</span>
            <span className="font-bold text-blue-600">{substrateConc} μM</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="2"
            value={substrateConc}
            onChange={(e) => setSubstrateConc(parseInt(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
            aria-label="Substrate Concentration"
          />
        </div>

        {/* Total Enzyme [E]total Slider */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] text-muted">
            <span className="font-semibold text-foreground uppercase">Enzyme Concentration [E]total</span>
            <span className="font-bold text-emerald-600">{enzymeConc} nM</span>
          </div>
          <input
            type="range"
            min="2"
            max="20"
            step="1"
            value={enzymeConc}
            onChange={(e) => setEnzymeConc(parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
            aria-label="Enzyme Concentration"
          />
        </div>
      </div>

      {/* 2. INHIBITOR & PLOT TOGGLES */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Inhibitor Modes */}
        <div className="flex items-center gap-1.5 text-[10px] overflow-x-auto">
          <span className="text-muted uppercase tracking-wider font-semibold mr-1">Inhibitor:</span>
          <button
            onClick={() => setInhibitorType("none")}
            className={`px-2.5 py-1 border transition-all cursor-pointer ${
              inhibitorType === "none"
                ? "bg-foreground text-background border-foreground font-semibold"
                : "bg-white text-muted border-border hover:border-foreground"
            }`}
          >
            None (Uninhibited)
          </button>
          <button
            onClick={() => setInhibitorType("competitive")}
            className={`px-2.5 py-1 border transition-all cursor-pointer ${
              inhibitorType === "competitive"
                ? "bg-red-600 text-white border-red-600 font-semibold"
                : "bg-white text-muted border-border hover:border-red-600 hover:text-red-600"
            }`}
            title="Competitive Inhibitor: increases Km, Vmax unchanged"
          >
            Competitive (+ Km, same Vmax)
          </button>
          <button
            onClick={() => setInhibitorType("noncompetitive")}
            className={`px-2.5 py-1 border transition-all cursor-pointer ${
              inhibitorType === "noncompetitive"
                ? "bg-red-600 text-white border-red-600 font-semibold"
                : "bg-white text-muted border-border hover:border-red-600 hover:text-red-600"
            }`}
            title="Non-Competitive / Allosteric Inhibitor: lowers Vmax, Km unchanged"
          >
            Non-Competitive (↓ Vmax, same Km)
          </button>
        </div>

        {/* Plot Type & Play/Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlotType(plotType === "michaelis-menten" ? "lineweaver-burk" : "michaelis-menten")}
            className="px-2.5 py-1 border border-border bg-gray-50 hover:bg-white text-[10px] text-foreground cursor-pointer uppercase"
          >
            {plotType === "michaelis-menten" ? "📊 Lineweaver-Burk" : "📈 Michaelis-Menten"}
          </button>

          <button
            onClick={onReset}
            className="px-2.5 py-1 border border-border hover:border-foreground text-muted hover:text-foreground text-[10px] uppercase cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </footer>
  );
}
