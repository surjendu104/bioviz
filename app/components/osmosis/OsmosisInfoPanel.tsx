"use client";

import React from "react";
import { OsmosisInspectableObject, OSMOSIS_INSPECTABLES } from "@/lib/biology/osmosisModel";

interface OsmosisInfoPanelProps {
  leftSoluteConc: number;
  rightSoluteConc: number;
  temperatureK: number;
  selectedObject: OsmosisInspectableObject | null;
  onSelectObject: (obj: OsmosisInspectableObject | null) => void;
}

export default function OsmosisInfoPanel({
  leftSoluteConc,
  rightSoluteConc,
  temperatureK,
  selectedObject,
  onSelectObject,
}: OsmosisInfoPanelProps) {
  // Gas constant R = 0.08206 L·atm/(mol·K)
  const R = 0.08206;
  const deltaC = rightSoluteConc - leftSoluteConc;
  const leftPiAtm = leftSoluteConc * R * temperatureK;
  const rightPiAtm = rightSoluteConc * R * temperatureK;
  const deltaPiAtm = (rightSoluteConc - leftSoluteConc) * R * temperatureK;

  // Determine RBC Tonicity State
  let rbcTonicity = "Isotonic (Equilibrium)";
  let rbcStatusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let rbcVisualDesc = "Normal biconcave disc shape. Water influx equals water efflux.";

  if (deltaC > 0.25) {
    rbcTonicity = "Hypertonic Bath (Right Chamber)";
    rbcStatusColor = "text-amber-800 bg-amber-50 border-amber-200";
    rbcVisualDesc = "Water is drawn outward into the hypertonic solution. Cells undergo crenation (shrinkage) and loss of turgor pressure.";
  } else if (deltaC < -0.25) {
    rbcTonicity = "Hypotonic Bath (Right Chamber)";
    rbcStatusColor = "text-red-800 bg-red-50 border-red-200";
    rbcVisualDesc = "Water surges inward down its chemical potential gradient. Unwalled animal cells swell and risk osmotic lysis.";
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto divide-y divide-border font-mono text-xs">
      {/* 1. QUANTITATIVE THERMODYNAMIC READOUTS */}
      <section className="p-5 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            van &apos;t Hoff Thermodynamics
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-foreground font-medium">
            Π = i·M·R·T
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Chamber A (Left) Π</div>
            <div className="text-base font-bold font-display text-foreground">{leftPiAtm.toFixed(1)} atm</div>
          </div>
          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Chamber B (Right) Π</div>
            <div className="text-base font-bold font-display text-foreground">{rightPiAtm.toFixed(1)} atm</div>
          </div>
          <div className="col-span-2 p-2.5 bg-blue-50/70 border border-blue-100">
            <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-blue-900 mb-0.5 font-bold">
              <span>Osmotic Pressure Difference (ΔΠ)</span>
              <span>{Math.abs(deltaPiAtm).toFixed(2)} atm</span>
            </div>
            <div className="text-[11px] text-blue-950 leading-snug">
              {deltaC === 0 ? (
                "Equilibrium: Water chemical potentials (μ_w) are equal. Zero net solvent flux."
              ) : deltaC > 0 ? (
                `Net water flux Jv drives solvent into Chamber B until hydrostatic head Δh balances ${deltaPiAtm.toFixed(1)} atm.`
              ) : (
                `Net water flux Jv drives solvent into Chamber A until hydrostatic head Δh balances ${Math.abs(deltaPiAtm).toFixed(1)} atm.`
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CELLULAR TONICITY & PHYSIOLOGY */}
      <section className="p-5 bg-gray-50/40 space-y-2">
        <div className="text-[10px] text-muted uppercase tracking-widest font-semibold">
          Cellular Tonicity Consequence
        </div>
        <div className={`p-3 border ${rbcStatusColor} space-y-1`}>
          <div className="font-display font-medium text-sm">{rbcTonicity}</div>
          <div className="text-[11px] leading-relaxed">{rbcVisualDesc}</div>
        </div>
      </section>

      {/* 3. MOLECULAR INSPECTOR */}
      <section className="p-5 bg-white space-y-3 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Biophysical Inspector
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
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Biophysical Mechanism</div>
              <div className="text-foreground leading-relaxed text-[11px]">{selectedObject.function}</div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Core Principle</div>
              <div className="text-blue-700 bg-blue-50 p-2 border border-blue-100 text-[11px] leading-relaxed">
                {selectedObject.keyPrinciple}
              </div>
            </div>

            {selectedObject.equation && (
              <div>
                <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Governing Equation</div>
                <div className="bg-white p-2 border border-border font-mono text-[10px] text-foreground font-semibold">
                  {selectedObject.equation}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-border p-4 text-center text-muted text-[11px] space-y-2">
            <div>Click any entity in the simulation to inspect its molecular mechanics.</div>
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {Object.values(OSMOSIS_INSPECTABLES).map((obj) => (
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
