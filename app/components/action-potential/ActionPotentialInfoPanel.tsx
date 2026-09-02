"use client";

import React from "react";
import { ActionPotentialInspectable, ACTION_POTENTIAL_INSPECTABLES } from "@/lib/biology/actionPotentialModel";

interface ActionPotentialInfoPanelProps {
  vm: number;
  phase: string;
  gNa: number;
  gK: number;
  selectedObject: ActionPotentialInspectable | null;
  onSelectObject: (obj: ActionPotentialInspectable | null) => void;
}

export default function ActionPotentialInfoPanel({
  vm,
  phase,
  gNa,
  gK,
  selectedObject,
  onSelectObject,
}: ActionPotentialInfoPanelProps) {
  // Phase explanations
  const getPhaseExplanation = () => {
    if (phase.includes("Depolarization")) {
      return "Nav activation m-gates open in response to threshold voltage (-55mV). Massive Na⁺ influx down electrochemical gradient drives membrane toward E_Na (+60mV).";
    }
    if (phase.includes("Overshoot")) {
      return "Membrane polarity temporarily reverses (+35mV). Nav inactivation h-gates (ball-and-chain) plug the pore, terminating inward Na⁺ current.";
    }
    if (phase.includes("Repolarization")) {
      return "Delayed rectifier Kv1.1 channels open. Outward K⁺ efflux down electrochemical gradient rapidly repolarizes the axon membrane.";
    }
    if (phase.includes("Hyperpolarization")) {
      return "High residual K⁺ conductance pulls Vm below resting level (-85mV) toward E_K (-90mV). Relative refractory period enforces unidirectional propagation.";
    }
    return "Resting potential (-70mV) maintained by Na⁺/K⁺ ATPase pump and non-gated K⁺ leak channels. Ready to fire.";
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto divide-y divide-border font-mono text-xs">
      {/* 1. REAL-TIME INSTRUMENT READOUTS */}
      <section className="p-5 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Membrane Electrophysiology
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-foreground font-medium">
            Hodgkin-Huxley
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Membrane Potential (Vm)</div>
            <div className={`text-lg font-bold font-display ${vm > -55 ? "text-blue-600" : "text-foreground"}`}>
              {vm > 0 ? `+${vm.toFixed(1)}` : vm.toFixed(1)} mV
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Threshold / Rest</div>
            <div className="text-xs font-semibold text-foreground pt-1">
              -55 mV / -70 mV
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Na⁺ Conductance (gNa)</div>
            <div className="text-sm font-bold text-sky-600 font-display">{gNa.toFixed(1)} mS/cm²</div>
          </div>

          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">K⁺ Conductance (gK)</div>
            <div className="text-sm font-bold text-emerald-600 font-display">{gK.toFixed(1)} mS/cm²</div>
          </div>
        </div>

        {/* Phase Breakdown */}
        <div className="p-3 bg-blue-50/70 border border-blue-100 space-y-1">
          <div className="font-bold text-blue-900 text-xs">
            {phase}
          </div>
          <div className="text-[11px] text-blue-950 leading-relaxed">
            {getPhaseExplanation()}
          </div>
        </div>
      </section>

      {/* 2. MOLECULAR & BIOPHYSICAL INSPECTOR */}
      <section className="p-5 bg-white space-y-3 grow">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Ion Channel Inspector
          </span>
          {selectedObject && (
            <button
              onClick={() => onSelectObject(null)}
              className="text-[10px] text-muted hover:text-foreground uppercase underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {selectedObject ? (
          <div className="border border-border p-3.5 space-y-2.5 bg-gray-50/50">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-medium text-foreground">
                {selectedObject.name}
              </h3>
              <span className="text-[9px] px-1.5 py-0.5 bg-gray-200 text-muted uppercase font-semibold">
                {selectedObject.category}
              </span>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Function</div>
              <div className="text-foreground leading-relaxed text-[11px]">{selectedObject.function}</div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Gating Kinetics</div>
              <div className="text-blue-700 bg-blue-50 p-2 border border-blue-100 text-[11px] leading-relaxed">
                {selectedObject.keyPrinciple}
              </div>
            </div>

            {selectedObject.equation && (
              <div>
                <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Current Equation</div>
                <div className="bg-white p-2 border border-border font-mono text-[10px] text-foreground font-semibold">
                  {selectedObject.equation}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-border p-4 text-center text-muted text-[11px] space-y-2">
            <div>Select a channel or transport mechanism to inspect its voltage-dependent gating kinetics.</div>
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {Object.values(ACTION_POTENTIAL_INSPECTABLES).map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => onSelectObject(obj)}
                  className="px-2 py-0.5 border border-border hover:border-foreground bg-white text-[10px] text-foreground cursor-pointer"
                >
                  {obj.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
