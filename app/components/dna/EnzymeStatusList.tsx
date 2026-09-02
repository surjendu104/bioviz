"use client";

import React from "react";
import { StepDefinition, InspectableObject } from "@/lib/types";
import { MOLECULAR_OBJECTS } from "@/lib/biology/enzymes";

interface EnzymeStatusListProps {
  currentStep: StepDefinition;
  selectedObject: InspectableObject | null;
  onSelect: (obj: InspectableObject) => void;
}

export default function EnzymeStatusList({
  currentStep,
  selectedObject,
  onSelect,
}: EnzymeStatusListProps) {
  const enzymeStateMap = new Map(
    currentStep.activeEnzymes.map((e) => [e.id, e.state])
  );

  const enzymeList = [
    { id: "helicase", label: "Helicase (DnaB)", color: "var(--enzyme-helicase)" },
    { id: "topoisomerase", label: "Topoisomerase", color: "var(--enzyme-topoisomerase)" },
    { id: "ssb", label: "SSB Tetramers", color: "var(--enzyme-ssb)" },
    { id: "primase", label: "RNA Primase", color: "var(--enzyme-primase)" },
    { id: "polymerase-lead", label: "Pol III (Leading)", color: "var(--enzyme-polymerase)" },
    { id: "polymerase-lag", label: "Pol III (Lagging)", color: "var(--enzyme-polymerase)" },
    { id: "polymerase-i", label: "Pol I (Exonuclease)", color: "var(--enzyme-polymerase-i)" },
    { id: "ligase", label: "DNA Ligase", color: "var(--enzyme-ligase)" },
  ];

  return (
    <div className="space-y-1.5 font-mono text-xs">
      <div className="text-[10px] text-muted uppercase tracking-widest mb-2">
        Replisome Enzyme Activity Matrix
      </div>
      <div className="grid grid-cols-1 gap-1">
        {enzymeList.map((enz) => {
          const state = enzymeStateMap.get(enz.id) || "waiting";
          const isSelected = selectedObject?.id === enz.id;

          let badgeClass = "bg-gray-100 text-muted";
          let badgeText = "WAITING";
          let dotColor = "bg-gray-400";

          if (state === "active") {
            badgeClass = "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200";
            badgeText = "ACTIVE";
            dotColor = "bg-emerald-500 animate-pulse";
          } else if (state === "complete") {
            badgeClass = "bg-blue-50 text-blue-700 border border-blue-200";
            badgeText = "COMPLETE";
            dotColor = "bg-blue-500";
          } else if (state === "dissociated") {
            badgeClass = "bg-gray-50 text-gray-400";
            badgeText = "RELEASED";
            dotColor = "bg-gray-300";
          }

          return (
            <button
              key={enz.id}
              onClick={() => {
                const obj = MOLECULAR_OBJECTS[enz.id];
                if (obj) onSelect(obj);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 border transition-all text-left group ${
                isSelected
                  ? "border-blue-500 bg-blue-50/40"
                  : "border-transparent hover:border-border hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                <span className="text-foreground group-hover:text-blue-600 transition-colors truncate">
                  {enz.label}
                </span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider ${badgeClass}`}>
                {badgeText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
