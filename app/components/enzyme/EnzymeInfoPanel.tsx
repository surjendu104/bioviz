"use client";

import React from "react";
import { EnzymeInspectable, ENZYME_INSPECTABLES } from "@/lib/biology/enzymeModel";

interface EnzymeInfoPanelProps {
  substrateConc: number;
  inhibitorType: string;
  velocity: number;
  km: number;
  apparentKm: number;
  apparentVmax: number;
  selectedObject: EnzymeInspectable | null;
  onSelectObject: (obj: EnzymeInspectable | null) => void;
}

export default function EnzymeInfoPanel({
  substrateConc,
  inhibitorType,
  velocity,
  km,
  apparentKm,
  apparentVmax,
  selectedObject,
  onSelectObject,
}: EnzymeInfoPanelProps) {
  // Saturation percentage: v / Vmax * 100
  const saturationPct = Math.min(100, Math.round((velocity / apparentVmax) * 100));

  return (
    <div className="flex flex-col h-full overflow-y-auto divide-y divide-border font-mono text-xs">
      {/* 1. KINETIC GAUGES */}
      <section className="p-5 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Steady-State Kinetics
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-foreground font-medium">
            Briggs-Haldane
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Reaction Velocity (v₀)</div>
            <div className="text-base font-bold font-display text-blue-600">{velocity.toFixed(2)} μM/min</div>
          </div>

          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Vmax (Saturation)</div>
            <div className="text-base font-bold font-display text-emerald-700">{apparentVmax.toFixed(1)} μM/min</div>
          </div>

          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Michaelis Constant (Km)</div>
            <div className="text-sm font-bold font-display text-foreground">{apparentKm.toFixed(1)} μM</div>
          </div>

          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Active Site Saturation</div>
            <div className="text-sm font-bold font-display text-amber-600">{saturationPct}% occupied</div>
          </div>
        </div>

        {/* Dynamic Kinetic Regime Explainer */}
        <div className="p-3 bg-blue-50/70 border border-blue-100 space-y-1">
          <div className="font-bold text-blue-900 text-xs">
            {substrateConc < apparentKm * 0.3
              ? "First-Order Regime ([S] << Km)"
              : substrateConc > apparentKm * 3
              ? "Zero-Order Saturation Regime ([S] >> Km)"
              : "Mixed-Order Transition Zone ([S] ≈ Km)"}
          </div>
          <div className="text-[11px] text-blue-950 leading-relaxed">
            {substrateConc < apparentKm * 0.3
              ? "Reaction rate is strictly limited by substrate collision frequency. Velocity increases linearly with added [S]."
              : substrateConc > apparentKm * 3
              ? "All enzyme active sites are occupied as ES complexes. Reaction rate reaches asymptotic ceiling Vmax and is independent of [S]."
              : `At [S] = ${apparentKm.toFixed(1)} μM (Km), exactly half of all enzyme active sites are occupied, operating at Vmax / 2.`}
          </div>
        </div>
      </section>

      {/* 2. INHIBITION MECHANISM BREAKDOWN */}
      <section className="p-5 bg-gray-50/40 space-y-2">
        <div className="text-[10px] text-muted uppercase tracking-widest font-semibold">
          Inhibition Mode
        </div>
        <div className="p-3 border bg-white border-border text-[11px] leading-relaxed space-y-1">
          {inhibitorType === "none" ? (
            <div>
              <span className="font-semibold text-foreground">Standard Uninhibited Catalysis: </span>
              Substrate enters the catalytic cleft freely with intrinsic affinity defined by Km = {km} μM.
            </div>
          ) : inhibitorType === "competitive" ? (
            <div>
              <span className="font-semibold text-red-600">Competitive Inhibition: </span>
              Inhibitor competes with substrate for the catalytic active site. Apparent Km increases to {apparentKm.toFixed(1)} μM, but can be outcompeted at saturating [S] to achieve the full Vmax.
            </div>
          ) : (
            <div>
              <span className="font-semibold text-red-600">Non-Competitive / Allosteric Inhibition: </span>
              Inhibitor binds an allosteric regulatory site, reducing catalytic turnover. Vmax drops to {apparentVmax.toFixed(1)} μM/min regardless of high substrate concentration.
            </div>
          )}
        </div>
      </section>

      {/* 3. BIOCHEMICAL INSPECTOR */}
      <section className="p-5 bg-white space-y-3 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Molecular Inspector
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
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Catalytic Function</div>
              <div className="text-foreground leading-relaxed text-[11px]">{selectedObject.function}</div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Key Principle</div>
              <div className="text-blue-700 bg-blue-50 p-2 border border-blue-100 text-[11px] leading-relaxed">
                {selectedObject.keyPrinciple}
              </div>
            </div>

            {selectedObject.equation && (
              <div>
                <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Rate Equation</div>
                <div className="bg-white p-2 border border-border font-mono text-[10px] text-foreground font-semibold">
                  {selectedObject.equation}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-border p-4 text-center text-muted text-[11px] space-y-2">
            <div>Select any biochemical component or equation to inspect its catalytic properties.</div>
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {Object.values(ENZYME_INSPECTABLES).map((obj) => (
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
