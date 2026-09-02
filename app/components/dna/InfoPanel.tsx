"use client";

import React from "react";
import { AppState, StepDefinition, InspectableObject } from "@/lib/types";
import { MOLECULAR_OBJECTS } from "@/lib/biology/enzymes";
import EnzymeStatusList from "./EnzymeStatusList";
import MetricsReadout from "./MetricsReadout";

interface InfoPanelProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  currentStep: StepDefinition;
  onOpenActiveSite: () => void;
  onOpenPrediction?: (id: string) => void;
}

export default function InfoPanel({
  state,
  setState,
  currentStep,
  onOpenActiveSite,
  onOpenPrediction,
}: InfoPanelProps) {
  const selectedObject = state.selectedObject;

  const handleSelectObject = (obj: InspectableObject | null) => {
    setState((s) => ({ ...s, selectedObject: obj }));
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto divide-y divide-border">
      {/* 1. CURRENT BIOLOGICAL EVENT NARRATIVE */}
      <section className="p-5 md:p-6 bg-white" aria-labelledby="current-event-heading">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest font-semibold">
            {currentStep.phase}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-100 text-foreground rounded uppercase font-medium">
            Step {currentStep.id} / 8
          </span>
        </div>

        <h2 id="current-event-heading" className="font-display text-xl text-foreground font-medium mb-2 leading-tight">
          {currentStep.name}
        </h2>

        <p className="font-mono text-xs leading-relaxed text-muted mb-3">
          {currentStep.desc}
        </p>

        <div className="p-2.5 bg-blue-50/60 border border-blue-100 text-blue-950 font-mono text-xs leading-snug mb-3">
          <span className="font-bold text-blue-800">Key Mechanism: </span>
          {currentStep.keyTakeaway}
        </div>

        {currentStep.predictionId && onOpenPrediction && (
          <button
            onClick={() => onOpenPrediction(currentStep.predictionId!)}
            className="w-full py-2 px-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors font-mono text-xs font-semibold flex items-center justify-between cursor-pointer"
          >
            <span>💡 Predict Mechanistic Outcome</span>
            <span>→</span>
          </button>
        )}
      </section>

      {/* 2. DEEP MOLECULAR INSPECTOR */}
      <section className="p-5 md:p-6 bg-gray-50/40" aria-labelledby="inspector-heading">
        <div className="flex items-center justify-between mb-3">
          <span id="inspector-heading" className="text-[10px] font-mono text-muted uppercase tracking-widest font-semibold">
            Molecular Inspector
          </span>
          {selectedObject && (
            <button
              onClick={() => handleSelectObject(null)}
              className="font-mono text-[10px] text-muted hover:text-foreground uppercase underline"
            >
              Clear
            </button>
          )}
        </div>

        {selectedObject ? (
          <div className="bg-white border border-border p-4 shadow-xs space-y-3 font-mono text-xs animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-display text-base font-medium text-foreground">
                  {selectedObject.name}
                </h3>
                <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-muted uppercase font-semibold">
                  {selectedObject.category}
                </span>
              </div>
              {selectedObject.systematicName && (
                <div className="text-[10px] text-muted italic">
                  {selectedObject.systematicName}
                </div>
              )}
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Function</div>
              <div className="text-foreground leading-relaxed">{selectedObject.function}</div>
            </div>

            {selectedObject.direction && (
              <div>
                <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Directionality</div>
                <div className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 inline-block rounded-xs">
                  {selectedObject.direction}
                </div>
              </div>
            )}

            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Biochemical Principle</div>
              <div className="text-foreground leading-relaxed">{selectedObject.keyPrinciple}</div>
            </div>

            {selectedObject.reactionEquation && (
              <div className="bg-gray-50 p-2 border border-gray-200">
                <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Reaction Chemistry</div>
                <div className="text-[11px] font-semibold text-foreground break-all">
                  {selectedObject.reactionEquation}
                </div>
              </div>
            )}

            {selectedObject.cofactors && (
              <div>
                <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Cofactors & Requirements</div>
                <div className="text-muted">{selectedObject.cofactors}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/80 border border-dashed border-border p-4 text-center space-y-2">
            <p className="font-mono text-xs text-muted leading-relaxed">
              Click or hover any enzyme, strand, or base pair in the replication fork to inspect its catalytic mechanism.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {['helicase', 'polymerase-lead', 'primase', 'ligase'].map((id) => (
                <button
                  key={id}
                  onClick={() => handleSelectObject(MOLECULAR_OBJECTS[id])}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-foreground font-mono text-[10px] transition-colors rounded-xs"
                >
                  {MOLECULAR_OBJECTS[id]?.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. REPLISOME ENZYME MATRIX */}
      <section className="p-5 md:p-6 bg-white" aria-labelledby="enzymes-heading">
        <EnzymeStatusList
          currentStep={currentStep}
          selectedObject={selectedObject}
          onSelect={handleSelectObject}
        />
      </section>

      {/* 4. QUANTITATIVE METRICS */}
      <section className="p-5 md:p-6 bg-gray-50/40" aria-labelledby="telemetry-heading">
        <div className="text-[10px] font-mono text-muted uppercase tracking-widest mb-2 font-semibold">
          Kinetics & Telemetry
        </div>
        <MetricsReadout state={state} />
      </section>

      {/* 5. ACTIVE LEARNING & DEEP TOOLS BUTTONS */}
      <section className="p-5 md:p-6 bg-white">
        <button
          onClick={onOpenActiveSite}
          className="w-full py-2.5 px-3 border border-border hover:border-foreground hover:bg-gray-50 text-foreground font-mono text-xs transition-colors flex items-center justify-between group"
        >
          <span>🔬 Inspect Active Site Chemistry</span>
          <span className="text-muted group-hover:text-foreground font-bold">Zoom →</span>
        </button>
      </section>
    </div>
  );
}
