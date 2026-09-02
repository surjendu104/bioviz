"use client";

import React, { useState } from "react";
import {
  CellType,
  OrganelleData,
  ORGANELLES,
  ANIMAL_ORGANELLES,
  PLANT_ORGANELLES,
  CELL_COMPARISON_TABLE,
} from "@/lib/biology/cellStructureModel";

interface CellStructureInfoPanelProps {
  cellType: CellType;
  selectedOrganelle: OrganelleData | null;
  onSelectOrganelle: (organelle: OrganelleData | null) => void;
  isFocused: boolean;
  onToggleFocus: () => void;
}

export default function CellStructureInfoPanel({
  cellType,
  selectedOrganelle,
  onSelectOrganelle,
  isFocused,
  onToggleFocus,
}: CellStructureInfoPanelProps) {
  const [activeTab, setActiveTab] = useState<"organelle" | "comparison">("organelle");

  const visibleOrganelleIds = cellType === "animal" ? ANIMAL_ORGANELLES : PLANT_ORGANELLES;

  return (
    <div className="flex flex-col h-full overflow-y-auto divide-y divide-border font-mono text-xs">
      {/* 1. TOP TAB SWITCHER */}
      <div className="flex items-center border-b border-border bg-gray-50/70 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("organelle")}
          className={`flex-1 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
            activeTab === "organelle"
              ? "bg-white text-foreground shadow-xs border border-border"
              : "text-muted hover:text-foreground"
          }`}
        >
          Organelle Inspector
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("comparison")}
          className={`flex-1 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
            activeTab === "comparison"
              ? "bg-white text-foreground shadow-xs border border-border"
              : "text-muted hover:text-foreground"
          }`}
        >
          Animal vs Plant Comparison
        </button>
      </div>

      {activeTab === "organelle" ? (
        <>
          {/* 2. ACTIVE ORGANELLE DETAILS (PROGRESSIVE DISCLOSURE) */}
          <section className="p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
                Ultrastructure Details
              </span>
              {selectedOrganelle && (
                <button
                  type="button"
                  onClick={() => onSelectOrganelle(null)}
                  className="text-[10px] text-muted hover:text-foreground uppercase underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {selectedOrganelle ? (
              <div className="border border-border p-4 bg-gray-50/50 space-y-3 animate-in fade-in duration-150">
                {/* Organelle Title & Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className="font-display text-lg font-medium text-foreground">
                      {selectedOrganelle.name}
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold uppercase">
                      {selectedOrganelle.categoryLabel}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted">{selectedOrganelle.subtitle}</div>
                </div>

                {/* Found In Badge */}
                <div className="text-[10px] text-slate-600 flex items-center gap-1.5">
                  <span className="font-bold text-foreground">Found In:</span>
                  <span
                    className={`px-1.5 py-0.5 rounded font-semibold text-[9px] ${
                      selectedOrganelle.foundIn === "both"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : selectedOrganelle.foundIn === "plant-only"
                        ? "bg-green-100 text-green-900 border border-green-300"
                        : "bg-amber-50 text-amber-900 border border-amber-200"
                    }`}
                  >
                    {selectedOrganelle.foundIn === "both"
                      ? "Animal & Plant Cells"
                      : selectedOrganelle.foundIn === "plant-only"
                      ? "Plant Cells Only"
                      : "Animal Cells Only"}
                  </span>
                </div>

                {/* Function */}
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5 font-semibold">
                    Primary Function
                  </div>
                  <p className="text-foreground leading-relaxed text-[11px]">
                    {selectedOrganelle.function}
                  </p>
                </div>

                {/* Structure */}
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5 font-semibold">
                    Membrane Structure
                  </div>
                  <p className="text-muted leading-relaxed text-[11px]">
                    {selectedOrganelle.structure}
                  </p>
                </div>

                {/* Key Principle */}
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5 font-semibold">
                    Key Biological Principle
                  </div>
                  <div className="p-2.5 bg-blue-50/70 border border-blue-100 text-blue-950 text-[11px] leading-relaxed">
                    {selectedOrganelle.keyPrinciple}
                  </div>
                </div>

                {/* Relationships */}
                {selectedOrganelle.relationships.length > 0 && (
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-muted mb-1 font-semibold">
                      Functional Relationships
                    </div>
                    <div className="space-y-1.5">
                      {selectedOrganelle.relationships.map((rel, idx) => (
                        <div
                          key={`rel-${idx}`}
                          onClick={() => onSelectOrganelle(ORGANELLES[rel.targetId] || null)}
                          className="p-2 bg-white border border-border hover:border-blue-500 cursor-pointer transition-colors text-[10px]"
                        >
                          <div className="font-bold text-blue-700 flex items-center justify-between">
                            <span>→ {rel.targetName}</span>
                            <span className="text-[8px] uppercase text-muted font-normal">{rel.relationshipType}</span>
                          </div>
                          <div className="text-slate-600 mt-0.5">{rel.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Focus Button */}
                <div className="pt-2 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    onClick={onToggleFocus}
                    className="px-3 py-1.5 bg-foreground text-background hover:bg-gray-800 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    {isFocused ? "✕ Return to Whole Cell" : `🔍 Zoom into ${selectedOrganelle.name}`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-border text-center text-muted text-[11px] space-y-2">
                <div>Click any organelle in the cell diagram or select from the catalog below to inspect its architecture.</div>
              </div>
            )}
          </section>

          {/* 3. ORGANELLE CATALOG LIST (FILTERED BY CELL TYPE) */}
          <section className="p-5 bg-gray-50/40 space-y-2.5 flex-grow">
            <div className="text-[10px] text-muted uppercase tracking-widest font-semibold">
              {cellType === "animal" ? "Animal Cell" : "Plant Cell"} Organelle Catalog
            </div>

            <div className="grid grid-cols-1 gap-1">
              {visibleOrganelleIds.map((orgId) => {
                const org = ORGANELLES[orgId];
                if (!org) return null;
                const isThisSelected = selectedOrganelle?.id === orgId;

                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => onSelectOrganelle(org)}
                    className={`w-full text-left p-2 border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isThisSelected
                        ? "bg-blue-50 border-blue-500 font-bold text-blue-900"
                        : "bg-white border-border hover:border-foreground text-foreground"
                    }`}
                  >
                    <span className="text-[11px] truncate">{org.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-muted rounded uppercase font-semibold shrink-0">
                      {org.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        /* 4. ANIMAL VS PLANT COMPARISON MATRIX */
        <section className="p-5 bg-white space-y-4 flex-grow animate-in fade-in duration-150">
          <div>
            <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
              Diagnostic Structural Differences
            </span>
            <h3 className="font-display text-base font-medium text-foreground mt-0.5">
              Eukaryotic Divergence: Animal vs Plant
            </h3>
          </div>

          <div className="space-y-3">
            {CELL_COMPARISON_TABLE.map((row, idx) => (
              <div key={`comp-${idx}`} className="p-3 bg-gray-50 border border-border space-y-1.5 text-[11px]">
                <div className="font-bold text-foreground text-xs">{row.feature}</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-1.5 bg-white border border-gray-200">
                    <span className="font-bold text-amber-800">Animal: </span>
                    <span className="text-slate-700">{row.animalCell}</span>
                  </div>
                  <div className="p-1.5 bg-white border border-gray-200">
                    <span className="font-bold text-emerald-800">Plant: </span>
                    <span className="text-slate-700">{row.plantCell}</span>
                  </div>
                </div>
                <div className="text-[10px] text-muted border-t border-gray-200/60 pt-1">
                  <span className="font-semibold text-slate-800">Significance: </span>
                  {row.significance}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
