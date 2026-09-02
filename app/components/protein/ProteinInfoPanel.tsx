"use client";

import React from "react";
import { mRNA_SEQUENCE, ProteinInspectable, PROTEIN_INSPECTABLES } from "@/lib/biology/proteinModel";

interface ProteinInfoPanelProps {
  currentCodonIndex: number;
  selectedObject: ProteinInspectable | null;
  onSelectObject: (obj: ProteinInspectable | null) => void;
}

export default function ProteinInfoPanel({
  currentCodonIndex,
  selectedObject,
  onSelectObject,
}: ProteinInfoPanelProps) {
  const currentCodon = mRNA_SEQUENCE[currentCodonIndex];
  const peptideLength = currentCodon.isStop ? currentCodonIndex : currentCodonIndex + 1;

  return (
    <div className="flex flex-col h-full overflow-y-auto divide-y divide-border font-mono text-xs">
      {/* 1. TRANSLATION CYCLE STATUS */}
      <section className="p-5 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Ribosomal Decoding Center
          </span>
          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-foreground font-medium">
            Codon {currentCodonIndex + 1} / {mRNA_SEQUENCE.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Active mRNA Codon</div>
            <div className="text-xl font-bold font-display text-blue-600">{currentCodon.triplet}</div>
          </div>

          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Matching Anticodon</div>
            <div className="text-xl font-bold font-display text-emerald-700">{currentCodon.anticodon}</div>
          </div>

          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Encoded Amino Acid</div>
            <div className="text-sm font-bold font-display text-foreground">{currentCodon.name} ({currentCodon.aminoAcid})</div>
          </div>

          <div className="p-2.5 bg-gray-50 border border-border">
            <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Polypeptide Length</div>
            <div className="text-sm font-bold font-display text-amber-600">{peptideLength} residues</div>
          </div>
        </div>

        {/* Translation Phase Explainer */}
        <div className="p-3 bg-blue-50/70 border border-blue-100 space-y-1">
          <div className="font-bold text-blue-900 text-xs">
            {currentCodon.isStart
              ? "Initiation Phase: AUG Start Codon"
              : currentCodon.isStop
              ? "Termination Phase: Stop Codon (Release Factor)"
              : "Elongation Cycle: Peptidyl Transfer & Translocation"}
          </div>
          <div className="text-[11px] text-blue-950 leading-relaxed">
            {currentCodon.isStart
              ? "Initiator Met-tRNA binds the P site directly at the AUG start codon. The 50S large subunit joins to form the intact 70S monosome."
              : currentCodon.isStop
              ? "Stop codon (UAA) recruits class-I Release Factor (RF) instead of tRNA, triggering ester bond hydrolysis and release of the completed protein."
              : `Cognate aminoacyl-tRNA delivering ${currentCodon.name} enters the A site. 23S rRNA in the large subunit catalyzes peptide bond synthesis, and EF-G hydrolyzes GTP to advance the ribosome by 3 nucleotides.`}
          </div>
        </div>
      </section>

      {/* 2. TRANSLATED PEPTIDE SEQUENCE */}
      <section className="p-5 bg-gray-50/40 space-y-2">
        <div className="text-[10px] text-muted uppercase tracking-widest font-semibold">
          Growing Polypeptide Sequence (N → C)
        </div>
        <div className="flex flex-wrap gap-1 bg-white p-2.5 border border-border">
          {mRNA_SEQUENCE.slice(0, peptideLength).map((c, i) => (
            <span
              key={i}
              className={`px-1.5 py-0.5 text-[10px] border ${
                i === currentCodonIndex
                  ? "bg-blue-600 text-white font-bold border-blue-600"
                  : "bg-gray-100 text-foreground border-gray-200"
              }`}
            >
              {c.aminoAcid}
            </span>
          ))}
        </div>
      </section>

      {/* 3. MOLECULAR INSPECTOR */}
      <section className="p-5 bg-white space-y-3 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
            Translation Complex Inspector
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
              <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Biochemical Principle</div>
              <div className="text-purple-700 bg-purple-50 p-2 border border-purple-100 text-[11px] leading-relaxed">
                {selectedObject.keyPrinciple}
              </div>
            </div>

            {selectedObject.equation && (
              <div>
                <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Reaction Equation</div>
                <div className="bg-white p-2 border border-border font-mono text-[10px] text-foreground font-semibold">
                  {selectedObject.equation}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-border p-4 text-center text-muted text-[11px] space-y-2">
            <div>Click any ribosomal component or active site to inspect its molecular mechanics.</div>
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {Object.values(PROTEIN_INSPECTABLES).map((obj) => (
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
