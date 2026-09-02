"use client";

import React from "react";
import { mRNA_SEQUENCE } from "@/lib/biology/proteinModel";

interface ProteinControlsProps {
  currentCodonIndex: number;
  onNextCodon: () => void;
  onPrevCodon: () => void;
  onReset: () => void;
  isPlaying: boolean;
  setIsPlaying: (fn: (prev: boolean) => boolean) => void;
  showCodonLetters: boolean;
  setShowCodonLetters: (fn: (prev: boolean) => boolean) => void;
  showSites: boolean;
  setShowSites: (fn: (prev: boolean) => boolean) => void;
}

export default function ProteinControls({
  currentCodonIndex,
  onNextCodon,
  onPrevCodon,
  onReset,
  isPlaying,
  setIsPlaying,
  showCodonLetters,
  setShowCodonLetters,
  showSites,
  setShowSites,
}: ProteinControlsProps) {
  const isFinished = currentCodonIndex >= mRNA_SEQUENCE.length - 1;

  return (
    <footer className="border-t border-border bg-white p-3 md:px-6 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs select-none">
      {/* 1. TRANSLATION STEPPING BUTTONS */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className={`px-3 py-1.5 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
            isPlaying
              ? "bg-amber-600 text-white hover:bg-amber-700"
              : "bg-foreground text-background hover:bg-gray-800"
          }`}
        >
          <span>{isPlaying ? "⏸ Pause Translation" : "▶ Translate Automatically"}</span>
        </button>

        <button
          onClick={onPrevCodon}
          disabled={currentCodonIndex === 0}
          className="px-2.5 py-1.5 border border-border hover:border-foreground disabled:opacity-40 disabled:hover:border-border text-foreground transition-colors cursor-pointer text-xs"
        >
          ← Previous Codon
        </button>

        <button
          onClick={onNextCodon}
          disabled={isFinished}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold transition-colors cursor-pointer text-xs"
        >
          {isFinished ? "✓ Polypeptide Complete" : "Next Codon / Translocate →"}
        </button>
      </div>

      {/* 2. CODON PROGRESS BAR */}
      <div className="flex items-center gap-2 text-[10px] text-muted">
        <span>Codon {currentCodonIndex + 1} / {mRNA_SEQUENCE.length}</span>
        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${((currentCodonIndex + 1) / mRNA_SEQUENCE.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3. DISPLAY TOGGLES & RESET */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSites((s) => !s)}
          className={`px-2 py-1 border text-[10px] uppercase transition-colors cursor-pointer ${
            showSites
              ? "border-purple-600 bg-purple-50 text-purple-800 font-semibold"
              : "border-border text-muted"
          }`}
        >
          A/P/E Sites
        </button>

        <button
          onClick={() => setShowCodonLetters((c) => !c)}
          className={`px-2 py-1 border text-[10px] uppercase transition-colors cursor-pointer ${
            showCodonLetters
              ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold"
              : "border-border text-muted"
          }`}
        >
          Codon Text
        </button>

        <button
          onClick={onReset}
          className="px-2.5 py-1 border border-border hover:border-foreground text-muted hover:text-foreground text-[10px] uppercase cursor-pointer"
        >
          Reset
        </button>
      </div>
    </footer>
  );
}
