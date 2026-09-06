"use client";

import React from "react";
import {
  AnatomicalEntity,
  CirculationMode,
  CIRCULATION_INSPECTABLES,
  CIRCULATION_STEPS,
} from "@/lib/biology/bloodCirculationModel";

interface BloodCirculationInfoPanelProps {
  mode: CirculationMode;
  currentStepIndex: number;
  selectedEntity: AnatomicalEntity | null;
  onSelectEntity: (entity: AnatomicalEntity | null) => void;
  onSelectStep: (stepIndex: number) => void;
}

export default function BloodCirculationInfoPanel({
  mode,
  currentStepIndex,
  selectedEntity,
  onSelectEntity,
  onSelectStep,
}: BloodCirculationInfoPanelProps) {
  const currentStep = CIRCULATION_STEPS[currentStepIndex];

  return (
    <div className="flex flex-col h-full overflow-y-auto divide-y divide-border font-mono text-xs">
      {/* 1. CURRENT STEP / ACTIVE SELECTION SECTION */}
      <section className="p-5 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            {mode === "trace" ? "Circulation Trace Sequence" : "Cardiovascular Inspector"}
          </span>
          {selectedEntity && (
            <button
              type="button"
              onClick={() => onSelectEntity(null)}
              className="text-[10px] text-muted hover:text-foreground uppercase underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {selectedEntity ? (
          /* Active Anatomical Structure Card */
          <div className="border border-border p-4 bg-gray-50/50 space-y-3 animate-in fade-in duration-150">
            <div>
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <h3 className="font-display text-lg font-medium text-foreground">
                  {selectedEntity.name}
                </h3>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase ${
                    selectedEntity.oxygenation === "oxygen-rich"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}
                >
                  {selectedEntity.oxygenSaturation}
                </span>
              </div>
              <div className="text-[10px] text-muted">{selectedEntity.subtitle}</div>
            </div>

            {/* Pressure & Destination Badges */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 bg-white border border-border">
                <div className="text-[8px] text-muted uppercase">Typical Pressure</div>
                <div className="font-bold text-foreground">{selectedEntity.pressureTypical}</div>
              </div>
              <div className="p-2 bg-white border border-border">
                <div className="text-[8px] text-muted uppercase">Patient Position</div>
                <div className="font-bold text-foreground">
                  {selectedEntity.patientSide === "right"
                    ? "Patient Right (Viewer Left)"
                    : selectedEntity.patientSide === "left"
                    ? "Patient Left (Viewer Right)"
                    : "Central / Systemic"}
                </div>
              </div>
            </div>

            {/* Function */}
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5 font-semibold">
                Physiological Function
              </div>
              <p className="text-foreground leading-relaxed text-[11px]">
                {selectedEntity.function}
              </p>
            </div>

            {/* Flow Pathway Connection */}
            <div className="p-2.5 bg-blue-50/60 border border-blue-100 text-[10px] space-y-1">
              <div>
                <span className="font-bold text-blue-900">Upstream Inflow: </span>
                <span className="text-blue-950">{selectedEntity.upstreamSource}</span>
              </div>
              <div>
                <span className="font-bold text-blue-900">Downstream Outflow: </span>
                <span className="text-blue-950">{selectedEntity.downstreamDestination}</span>
              </div>
            </div>

            {/* Key Principle */}
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5 font-semibold">
                Biophysical Principle
              </div>
              <p className="text-muted leading-relaxed text-[11px]">
                {selectedEntity.keyPrinciple}
              </p>
            </div>

            {/* Clinical Significance */}
            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5 font-semibold">
                Clinical Relevance
              </div>
              <p className="text-[10px] text-slate-700 leading-relaxed border-t border-gray-200 pt-1">
                {selectedEntity.clinicalSignificance}
              </p>
            </div>
          </div>
        ) : (
          /* Current Sequence Step Overview */
          <div className="p-3.5 bg-purple-50/60 border border-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-purple-700 font-bold uppercase tracking-wider">
                Current Sequence ({currentStep.step} / {CIRCULATION_STEPS.length})
              </span>
              <span
                className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  currentStep.oxygenation === "oxygen-rich"
                    ? "bg-red-100 text-red-900"
                    : "bg-blue-100 text-blue-900"
                }`}
              >
                {currentStep.oxygenation === "oxygen-rich" ? "Oxygen-Rich" : "Oxygen-Poor"}
              </span>
            </div>
            <h3 className="font-display text-base font-semibold text-purple-950">
              {currentStep.title}: {currentStep.structureName}
            </h3>
            <p className="text-[11px] text-purple-950 leading-relaxed">
              {currentStep.description}
            </p>
            <div className="text-[10px] text-purple-800 font-bold border-t border-purple-200/80 pt-1.5">
              Next: {currentStep.downstreamNext}
            </div>
          </div>
        )}
      </section>

      {/* 2. QUANTITATIVE HEMODYNAMIC GAUGES */}
      <section className="p-5 bg-gray-50/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Hemodynamic Metrics (Resting Adult)
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-foreground font-medium">
            Q = HR × SV
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-white border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Heart Rate (HR)</div>
            <div className="text-base font-bold font-display text-foreground">72 bpm</div>
          </div>
          <div className="p-2.5 bg-white border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Stroke Volume (SV)</div>
            <div className="text-base font-bold font-display text-foreground">70 mL/beat</div>
          </div>
          <div className="p-2.5 bg-white border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Cardiac Output (Q)</div>
            <div className="text-base font-bold font-display text-blue-600">~5.0 L/min</div>
          </div>
          <div className="p-2.5 bg-white border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Systemic BP</div>
            <div className="text-base font-bold font-display text-red-600">120/80 mmHg</div>
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP CIRCULATION PATHWAY LIST */}
      <section className="p-5 bg-white space-y-2.5 flex-grow">
        <div className="text-[10px] text-muted uppercase tracking-widest font-semibold">
          Circulation Sequence (9 Key Milestones)
        </div>

        <div className="grid grid-cols-1 gap-1">
          {CIRCULATION_STEPS.map((st, idx) => {
            const isCurrent = currentStepIndex === idx;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  onSelectStep(idx);
                  onSelectEntity(CIRCULATION_INSPECTABLES[st.id] || null);
                }}
                className={`w-full text-left p-2 border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  isCurrent
                    ? "bg-purple-50 border-purple-500 font-bold text-purple-950"
                    : "bg-white border-border hover:border-foreground text-foreground"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${st.oxygenation === "oxygen-rich" ? "bg-red-600" : "bg-blue-600"}`} />
                  <span className="text-[11px] truncate">{st.step}. {st.structureName}</span>
                </div>
                <span className="text-[9px] text-muted uppercase shrink-0">
                  {st.circuit}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
