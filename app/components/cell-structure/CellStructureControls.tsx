"use client";

import React from "react";
import { CellType, OrganelleData } from "@/lib/biology/cellStructureModel";

interface CellStructureControlsProps {
  cellType: CellType;
  setCellType: (type: CellType) => void;
  selectedOrganelle: OrganelleData | null;
  isFocused: boolean;
  setIsFocused: (fn: (prev: boolean) => boolean) => void;
  showLabels: boolean;
  setShowLabels: (fn: (prev: boolean) => boolean) => void;
  showRelationships: boolean;
  setShowRelationships: (fn: (prev: boolean) => boolean) => void;
  showBoundaries: boolean;
  setShowBoundaries: (fn: (prev: boolean) => boolean) => void;
  onReset: () => void;
}

export default function CellStructureControls({
  cellType,
  setCellType,
  selectedOrganelle,
  isFocused,
  setIsFocused,
  showLabels,
  setShowLabels,
  showRelationships,
  setShowRelationships,
  showBoundaries,
  setShowBoundaries,
  onReset,
}: CellStructureControlsProps) {
  return (
    <footer className="border-t border-border bg-white p-3 md:px-6 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs select-none">
      {/* 1. CELL TYPE SWITCH & FOCUS ZOOM */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted uppercase tracking-wider font-semibold mr-1">
          Cell Architecture:
        </span>
        <button
          type="button"
          onClick={() => setCellType("animal")}
          className={`px-3 py-1.5 border transition-all cursor-pointer font-semibold ${
            cellType === "animal"
              ? "bg-foreground text-background border-foreground shadow-xs"
              : "bg-white text-muted border-border hover:border-foreground hover:text-foreground"
          }`}
        >
          Animal Cell
        </button>
        <button
          type="button"
          onClick={() => setCellType("plant")}
          className={`px-3 py-1.5 border transition-all cursor-pointer font-semibold ${
            cellType === "plant"
              ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
              : "bg-white text-muted border-border hover:border-emerald-600 hover:text-emerald-700"
          }`}
        >
          Plant Cell
        </button>

        {/* Focus Ultrastructure Button */}
        {selectedOrganelle && (
          <button
            type="button"
            onClick={() => setIsFocused((f) => !f)}
            className={`ml-2 px-3 py-1.5 border transition-colors cursor-pointer font-semibold flex items-center gap-1.5 ${
              isFocused
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            }`}
          >
            <span>{isFocused ? "✕ Whole Cell" : `🔍 Zoom into ${selectedOrganelle.name}`}</span>
          </button>
        )}
      </div>

      {/* 2. DISPLAY & RELATIONSHIP TOGGLES */}
      <div className="flex items-center gap-1.5 text-[10px]">
        <button
          type="button"
          onClick={() => setShowRelationships((r) => !r)}
          className={`px-2.5 py-1 border transition-colors cursor-pointer ${
            showRelationships
              ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold"
              : "border-border text-muted"
          }`}
          title="Highlight endomembrane trafficking and metabolic flow pathways"
        >
          Flow Pathways
        </button>

        <button
          type="button"
          onClick={() => setShowBoundaries((b) => !b)}
          className={`px-2.5 py-1 border transition-colors cursor-pointer ${
            showBoundaries
              ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
              : "border-border text-muted"
          }`}
          title="Highlight cell wall vs plasma membrane boundary layers"
        >
          Boundaries
        </button>

        <button
          type="button"
          onClick={() => setShowLabels((l) => !l)}
          className={`px-2.5 py-1 border transition-colors cursor-pointer ${
            showLabels
              ? "border-foreground bg-gray-100 text-foreground font-semibold"
              : "border-border text-muted"
          }`}
          title="Toggle persistent organelle labels"
        >
          Labels
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-2.5 py-1 border border-border hover:border-foreground text-muted hover:text-foreground uppercase cursor-pointer"
          title="Reset to default whole animal cell"
        >
          Reset
        </button>
      </div>
    </footer>
  );
}
