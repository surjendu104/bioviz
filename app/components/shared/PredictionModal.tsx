"use client";

import React, { useState } from "react";
import { PredictionScenario } from "@/lib/types";

interface PredictionModalProps {
  scenario: PredictionScenario;
  historyEntry?: { answeredOptionId: string; isCorrect: boolean };
  onAnswer: (scenarioId: string, optionId: string, isCorrect: boolean) => void;
  onClose: () => void;
  onResume: () => void;
}

export default function PredictionModal({
  scenario,
  historyEntry,
  onAnswer,
  onClose,
  onResume,
}: PredictionModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    historyEntry?.answeredOptionId || null
  );

  const activeOption = scenario.options.find((opt) => opt.id === selectedOptionId);
  const isAnswered = selectedOptionId !== null;
  const isCorrect = activeOption?.isCorrect || false;

  const handleSelect = (optionId: string) => {
    const opt = scenario.options.find((o) => o.id === optionId);
    if (!opt) return;
    setSelectedOptionId(optionId);
    onAnswer(scenario.id, optionId, opt.isCorrect);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prediction-title"
    >
      <div className="bg-white border border-border max-w-xl w-full p-6 md:p-8 shadow-2xl">
        {/* Eyebrow */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-mono text-xs text-muted uppercase tracking-widest">
              Active Learning / Prediction Checkpoint
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground font-mono text-xs uppercase"
            aria-label="Close prediction"
          >
            ✕ Skip
          </button>
        </div>

        {/* Question */}
        <h2 id="prediction-title" className="font-display text-xl md:text-2xl text-foreground font-medium mb-3 leading-snug">
          {scenario.question}
        </h2>

        {/* Biological Context */}
        <p className="font-mono text-xs text-muted leading-relaxed mb-6 bg-gray-50 p-3 border border-border">
          <span className="text-foreground font-semibold">Context: </span>
          {scenario.context}
        </p>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {scenario.options.map((opt) => {
            const isThisSelected = selectedOptionId === opt.id;
            let btnClass = "border-border bg-white hover:bg-gray-50 text-foreground";
            if (isThisSelected) {
              if (opt.isCorrect) {
                btnClass = "border-emerald-500 bg-emerald-50/50 text-emerald-950 font-semibold";
              } else {
                btnClass = "border-red-400 bg-red-50/50 text-red-950";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`w-full text-left p-3.5 border transition-all font-mono text-xs leading-relaxed flex items-start justify-between gap-3 ${btnClass}`}
              >
                <span>{opt.text}</span>
                {isThisSelected && (
                  <span className="shrink-0 font-bold">
                    {opt.isCorrect ? "✓ Correct" : "✗ Review"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Section (appears after selection) */}
        {isAnswered && activeOption && (
          <div
            className={`p-4 border font-mono text-xs leading-relaxed mb-6 animate-in fade-in slide-in-from-top-2 duration-200 ${
              isCorrect
                ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                : "bg-amber-50/70 border-amber-300 text-amber-950"
            }`}
          >
            <div className="font-bold uppercase tracking-wider mb-1 text-[11px]">
              {isCorrect ? "Biochemical Rationale:" : "Misconception Analysis:"}
            </div>
            <p className="mb-2">{activeOption.feedback}</p>
            <p className="text-[11px] opacity-90 border-t border-current/20 pt-2 mt-2">
              {scenario.scientificExplanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border text-muted hover:text-foreground font-mono text-xs uppercase tracking-wider transition-colors"
          >
            Explore Freehand
          </button>
          <button
            onClick={onResume}
            className="px-5 py-2.5 bg-foreground text-background hover:bg-gray-800 font-mono text-xs uppercase tracking-wider transition-colors font-medium"
          >
            Continue Simulation →
          </button>
        </div>
      </div>
    </div>
  );
}
