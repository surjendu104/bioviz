"use client";

import React from "react";
import { BaseType, DNA_STRUCTURE_SEQUENCE, getHydrogenBondCount } from "@/lib/biology/dnaStructureModel";

interface DNASequenceBarProps {
  selectedIndex: number | null;
  onSelectIndex: (index: number | null) => void;
  unzipProgress: number; // 0 to 1
  filterMode: "all" | "at" | "gc";
}

export default function DNASequenceBar({
  selectedIndex,
  onSelectIndex,
  unzipProgress,
  filterMode,
}: DNASequenceBarProps) {
  const topStrand = DNA_STRUCTURE_SEQUENCE.top;
  const bottomStrand = DNA_STRUCTURE_SEQUENCE.bottom;

  return (
    <div className="w-full bg-white border-b border-border px-4 py-2 select-none overflow-x-auto font-mono text-xs">
      <div className="flex items-center justify-between gap-2 min-w-[680px]">
        {/* Left Polarity Tag */}
        <div className="flex flex-col items-center justify-center pr-2 border-r border-border text-[9px] text-muted font-bold">
          <span className="text-blue-600">5&apos;</span>
          <span className="text-gray-300">│</span>
          <span className="text-slate-800">3&apos;</span>
        </div>

        {/* Nucleotide Sequence Rungs */}
        <div className="flex items-center gap-1.5 flex-grow justify-around">
          {topStrand.map((topBase: BaseType, i: number) => {
            const bottomBase = bottomStrand[i];
            const isSelected = selectedIndex === i;
            const hBonds = getHydrogenBondCount(topBase);
            const isAt = hBonds === 2;
            const isGc = hBonds === 3;

            const isDimmed =
              (filterMode === "at" && !isAt) ||
              (filterMode === "gc" && !isGc);

            // Base color styling
            const getBaseColor = (b: BaseType) => {
              switch (b) {
                case "A": return "text-amber-700 bg-amber-50 border-amber-200";
                case "T": return "text-blue-700 bg-blue-50 border-blue-200";
                case "G": return "text-emerald-700 bg-emerald-50 border-emerald-200";
                case "C": return "text-indigo-700 bg-indigo-50 border-indigo-200";
              }
            };

            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelectIndex(isSelected ? null : i)}
                className={`group flex flex-col items-center p-1 rounded-xs border transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50/50 scale-105"
                    : isDimmed
                    ? "opacity-30 border-transparent hover:opacity-100"
                    : "border-transparent hover:border-border hover:bg-gray-50"
                }`}
                aria-label={`Position ${i + 1}: ${topBase} paired with ${bottomBase}`}
              >
                {/* Top Base (5' -> 3') */}
                <span className={`w-5 h-5 flex items-center justify-center font-bold text-[11px] border rounded-xs ${getBaseColor(topBase)}`}>
                  {topBase}
                </span>

                {/* Hydrogen Bond indicator */}
                <span
                  className={`text-[9px] font-bold my-0.5 transition-colors ${
                    unzipProgress > 0.4
                      ? "text-red-400 opacity-40"
                      : isSelected
                      ? "text-blue-600 font-extrabold"
                      : "text-muted"
                  }`}
                  title={`${hBonds} hydrogen bonds`}
                >
                  {unzipProgress > 0.4 ? "✕" : isAt ? "═" : "≡"}
                </span>

                {/* Bottom Base (3' -> 5') */}
                <span className={`w-5 h-5 flex items-center justify-center font-bold text-[11px] border rounded-xs ${getBaseColor(bottomBase)}`}>
                  {bottomBase}
                </span>

                {/* Position Index */}
                <span className="text-[8px] text-muted mt-0.5">{i + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Right Polarity Tag */}
        <div className="flex flex-col items-center justify-center pl-2 border-l border-border text-[9px] text-muted font-bold">
          <span className="text-blue-600">3&apos;</span>
          <span className="text-gray-300">│</span>
          <span className="text-slate-800">5&apos;</span>
        </div>
      </div>
    </div>
  );
}
