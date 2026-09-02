"use client";

import React from "react";
import {
  DNA_STRUCTURE_SEQUENCE,
  DNAStructureInspectable,
  DNA_STRUCTURE_INSPECTABLES,
  getBaseFullName,
  getHydrogenBondCount,
} from "@/lib/biology/dnaStructureModel";

interface DNAStructureInfoPanelProps {
  selectedIndex: number | null;
  selectedEntity: DNAStructureInspectable | null;
  onSelectEntity: (entity: DNAStructureInspectable | null) => void;
  unzipProgress: number;
}

export default function DNAStructureInfoPanel({
  selectedIndex,
  selectedEntity,
  onSelectEntity,
  unzipProgress,
}: DNAStructureInfoPanelProps) {
  const topStrand = DNA_STRUCTURE_SEQUENCE.top;
  const bottomStrand = DNA_STRUCTURE_SEQUENCE.bottom;

  // Selected base pair details if selectedIndex != null
  const selectedTopBase = selectedIndex !== null ? topStrand[selectedIndex] : null;
  const selectedBottomBase = selectedIndex !== null ? bottomStrand[selectedIndex] : null;

  // Duplex-wide quantitative calculations
  const totalPairs = topStrand.length;
  const aCount = topStrand.filter((b) => b === "A").length + bottomStrand.filter((b) => b === "A").length;
  const tCount = topStrand.filter((b) => b === "T").length + bottomStrand.filter((b) => b === "T").length;
  const gCount = topStrand.filter((b) => b === "G").length + bottomStrand.filter((b) => b === "G").length;
  const cCount = topStrand.filter((b) => b === "C").length + bottomStrand.filter((b) => b === "C").length;

  const totalBases = aCount + tCount + gCount + cCount;
  const gcCount = gCount + cCount;
  const gcPercent = Math.round((gcCount / totalBases) * 100);

  // Total intact hydrogen bonds
  const totalBonds = topStrand.reduce((acc, b) => acc + getHydrogenBondCount(b), 0);
  const brokenBonds = unzipProgress > 0.35 ? Math.round(totalBonds * Math.min(1, (unzipProgress - 0.25) / 0.75)) : 0;
  const intactBonds = totalBonds - brokenBonds;

  return (
    <div className="flex flex-col h-full overflow-y-auto divide-y divide-border font-mono text-xs">
      {/* 1. SELECTION & STRUCTURAL OVERVIEW */}
      <section className="p-5 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Structural Conformation
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-foreground font-medium">
            B-DNA Duplex
          </span>
        </div>

        {selectedIndex !== null && selectedTopBase && selectedBottomBase ? (
          /* Active Base Pair Selected Card */
          <div className="p-3.5 bg-blue-50/60 border border-blue-200 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-blue-700 font-bold">Position #{selectedIndex + 1}</span>
                <h3 className="font-display text-lg font-medium text-blue-950 leading-tight">
                  {selectedTopBase} ═ {selectedBottomBase} Watson-Crick Pair
                </h3>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-blue-600 text-white rounded font-bold">
                {getHydrogenBondCount(selectedTopBase)} H-Bonds
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white border border-blue-100">
                <div className="text-[9px] text-muted uppercase">Top Strand (5′→3′)</div>
                <div className="font-bold text-foreground">{getBaseFullName(selectedTopBase)} ({selectedTopBase})</div>
                <div className="text-[9px] text-muted">{selectedTopBase === "A" || selectedTopBase === "G" ? "Purine (2 rings)" : "Pyrimidine (1 ring)"}</div>
              </div>
              <div className="p-2 bg-white border border-blue-100">
                <div className="text-[9px] text-muted uppercase">Bottom Strand (3′→5′)</div>
                <div className="font-bold text-foreground">{getBaseFullName(selectedBottomBase)} ({selectedBottomBase})</div>
                <div className="text-[9px] text-muted">{selectedBottomBase === "A" || selectedBottomBase === "G" ? "Purine (2 rings)" : "Pyrimidine (1 ring)"}</div>
              </div>
            </div>

            <p className="text-[11px] text-blue-950 leading-relaxed border-t border-blue-100 pt-1.5">
              {getHydrogenBondCount(selectedTopBase) === 2
                ? "Adenine and Thymine pair via 2 hydrogen bonds (N6-H···O4 and N1···H-N3). Standard C1′-C1′ distance = 10.8 Å."
                : "Guanine and Cytosine pair via 3 hydrogen bonds (O6···H-N4, N1-H···N3, and N2-H···O2). Enhances duplex thermal stability."}
            </p>
          </div>
        ) : (
          /* Default Duplex Metric Gauges */
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-gray-50 border border-border">
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Duplex Length</div>
              <div className="text-base font-bold font-display text-foreground">{totalPairs} bp (7.5 nm)</div>
            </div>
            <div className="p-2.5 bg-gray-50 border border-border">
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Helical Turns</div>
              <div className="text-base font-bold font-display text-foreground">~2.1 Turns</div>
            </div>
            <div className="p-2.5 bg-gray-50 border border-border">
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Intact H-Bonds</div>
              <div className={`text-base font-bold font-display ${brokenBonds > 0 ? "text-red-600" : "text-emerald-700"}`}>
                {intactBonds} / {totalBonds} bonds
              </div>
            </div>
            <div className="p-2.5 bg-gray-50 border border-border">
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">GC Content / Tm</div>
              <div className="text-base font-bold font-display text-blue-600">{gcPercent}% (~58°C)</div>
            </div>
          </div>
        )}
      </section>

      {/* 2. CHARGAFF'S EQUIVALENCE RULES BREAKDOWN */}
      <section className="p-5 bg-gray-50/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Chargaff&apos;s Equivalence Rules
          </span>
          <button
            type="button"
            onClick={() => onSelectEntity(DNA_STRUCTURE_INSPECTABLES["chargaff-rules"])}
            className="text-[9px] text-blue-600 underline cursor-pointer hover:text-blue-800"
          >
            Learn Rationale
          </button>
        </div>

        <div className="p-3 bg-white border border-border space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted">Purines (A + G):</span>
            <span className="font-bold text-foreground">{aCount + gCount} ({Math.round(((aCount + gCount) / totalBases) * 100)}%)</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted">Pyrimidines (T + C):</span>
            <span className="font-bold text-foreground">{tCount + cCount} ({Math.round(((tCount + cCount) / totalBases) * 100)}%)</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full flex overflow-hidden">
            <div style={{ width: `${(aCount / totalBases) * 100}%` }} className="bg-amber-500" title={`A: ${aCount}`} />
            <div style={{ width: `${(tCount / totalBases) * 100}%` }} className="bg-blue-500" title={`T: ${tCount}`} />
            <div style={{ width: `${(gCount / totalBases) * 100}%` }} className="bg-emerald-500" title={`G: ${gCount}`} />
            <div style={{ width: `${(cCount / totalBases) * 100}%` }} className="bg-indigo-500" title={`C: ${cCount}`} />
          </div>
          <div className="flex justify-between text-[8px] text-muted uppercase">
            <span>A ({aCount})</span>
            <span>T ({tCount})</span>
            <span>G ({gCount})</span>
            <span>C ({cCount})</span>
          </div>
        </div>
      </section>

      {/* 3. DEEP MOLECULAR COMPONENT INSPECTOR */}
      <section className="p-5 bg-white space-y-3 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Molecular Component Inspector
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
          <div className="border border-border p-3.5 space-y-2.5 bg-gray-50/50 animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-medium text-foreground">
                {selectedEntity.name}
              </h3>
              <span className="text-[9px] px-1.5 py-0.5 bg-gray-200 text-muted uppercase font-semibold">
                {selectedEntity.category}
              </span>
            </div>

            {selectedEntity.formula && (
              <div className="text-[10px] text-muted">
                <span className="font-bold text-foreground">Formula: </span>
                {selectedEntity.formula}
              </div>
            )}

            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Biochemical Role</div>
              <div className="text-foreground leading-relaxed text-[11px]">{selectedEntity.function}</div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Structural Principle</div>
              <div className="text-blue-700 bg-blue-50 p-2 border border-blue-100 text-[11px] leading-relaxed">
                {selectedEntity.keyPrinciple}
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Cellular Significance</div>
              <div className="text-muted leading-relaxed text-[11px]">{selectedEntity.cellularSignificance}</div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-border p-4 text-center text-muted text-[11px] space-y-2">
            <div>Click any base, backbone rung, hydrogen bond, or groove on the helix to inspect its molecular mechanics.</div>
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {Object.values(DNA_STRUCTURE_INSPECTABLES).map((obj) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => onSelectEntity(obj)}
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
