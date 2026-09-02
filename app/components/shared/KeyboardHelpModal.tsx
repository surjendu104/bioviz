"use client";

import React from "react";

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardHelpModal({ isOpen, onClose }: KeyboardHelpModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Space", desc: "Toggle Play / Pause simulation or animation loop" },
    { key: "→ / ←", desc: "Step forward / backward through milestones or codons" },
    { key: "R", desc: "Reset simulation to baseline parameters" },
    { key: "D / V", desc: "Toggle directional vectors & field annotations" },
    { key: "L", desc: "Toggle structural labels and concentration values" },
    { key: "Esc", desc: "Close active modals or clear selection" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-help-title"
    >
      <div
        className="bg-white border border-border max-w-lg w-full p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
          <div>
            <div className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
              Instrument Controls
            </div>
            <h2 id="keyboard-help-title" className="font-display text-xl text-foreground font-medium">
              Keyboard Navigation & Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground font-mono text-xs uppercase cursor-pointer"
            aria-label="Close shortcuts"
          >
            ✕ Close
          </button>
        </div>

        <div className="space-y-2 mb-6 font-mono text-xs">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <span className="text-muted">{sc.desc}</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded font-bold text-foreground min-w-[36px] text-center text-[11px]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
