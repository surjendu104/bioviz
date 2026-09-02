"use client";

import React from "react";

interface ActiveSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActiveSiteModal({ isOpen, onClose }: ActiveSiteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="active-site-title"
    >
      <div
        className="bg-white border border-border max-w-2xl w-full p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4 mb-6">
          <div>
            <div className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
              Active Site Chemistry / 01
            </div>
            <h2 id="active-site-title" className="font-display text-2xl text-foreground font-medium">
              DNA Polymerase III Catalytic Active Site
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-foreground hover:bg-gray-100 transition-colors font-mono text-xs uppercase tracking-wider"
            aria-label="Close active site view"
          >
            ✕ Close
          </button>
        </div>

        {/* Chemical Diagram SVG */}
        <div className="bg-gray-50 border border-border p-4 mb-6 relative">
          <svg viewBox="0 0 600 320" className="w-full h-auto" role="img" aria-label="Two-Metal-Ion Mechanism Diagram">
            {/* Background Grid */}
            <g stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5">
              <line x1="20" y1="80" x2="580" y2="80" />
              <line x1="20" y1="160" x2="580" y2="160" />
              <line x1="20" y1="240" x2="580" y2="240" />
              <line x1="300" y1="20" x2="300" y2="300" />
            </g>

            {/* Template Strand (Top) */}
            <g transform="translate(60, 50)">
              <rect x="0" y="0" width="480" height="24" rx="3" fill="#1e293b" />
              <text x="240" y="16" fill="#fff" textAnchor="middle" className="font-mono text-xs font-semibold">
                Template Strand (3&apos; ── [ T ] ── 5&apos;)
              </text>
            </g>

            {/* Hydrogen Bonds (2 dotted lines for A=T) */}
            <line x1="285" y1="74" x2="285" y2="116" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="295" y1="74" x2="295" y2="116" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" />
            <text x="315" y="98" fill="#059669" className="font-mono text-[10px]">2 H-bonds</text>

            {/* Existing Primer 3'-OH Terminus */}
            <g transform="translate(100, 130)">
              <rect x="-40" y="-12" width="110" height="28" rx="4" fill="var(--dna-new)" />
              <text x="15" y="6" fill="#fff" textAnchor="middle" className="font-mono text-xs font-bold">
                Primer 3&apos;-OH
              </text>
              {/* Nucleophilic attack arrow */}
              <path d="M 70 0 C 110 -10, 160 -10, 190 0" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 2" markerEnd="url(#red-arrow)" />
              <text x="130" y="-16" fill="#dc2626" textAnchor="middle" className="font-mono text-[10px] font-bold">
                Nucleophilic Attack
              </text>
            </g>

            {/* Incoming dNTP (dATP) */}
            <g transform="translate(320, 130)">
              {/* Deoxyribose + Base */}
              <rect x="0" y="-14" width="70" height="32" rx="4" fill="#2563eb" />
              <text x="35" y="6" fill="#fff" textAnchor="middle" className="font-mono text-xs font-bold">
                [ A ] Sugar
              </text>

              {/* Triphosphate chain: alpha, beta, gamma */}
              {/* Alpha Phosphate */}
              <circle cx="95" cy="2" r="14" fill="#d97706" />
              <text x="95" y="6" fill="#fff" textAnchor="middle" className="font-mono text-[11px] font-bold">Pα</text>

              {/* Beta Phosphate */}
              <circle cx="130" cy="2" r="12" fill="#b45309" opacity="0.8" />
              <text x="130" y="6" fill="#fff" textAnchor="middle" className="font-mono text-[10px] font-bold">Pβ</text>

              {/* Gamma Phosphate */}
              <circle cx="160" cy="2" r="12" fill="#b45309" opacity="0.8" />
              <text x="160" y="6" fill="#fff" textAnchor="middle" className="font-mono text-[10px] font-bold">Pγ</text>

              {/* Cleavage site line */}
              <line x1="112" y1="-18" x2="112" y2="24" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="145" y="-14" fill="#b45309" textAnchor="middle" className="font-mono text-[9px]">
                Leaving Group (PPi)
              </text>
            </g>

            {/* Catalytic Magnesium Ions (Mg2+) */}
            <g transform="translate(260, 210)">
              {/* Metal Ion A */}
              <circle cx="0" cy="0" r="16" fill="#0284c7" />
              <text x="0" y="4" fill="#fff" textAnchor="middle" className="font-mono text-[10px] font-bold">Mg²⁺A</text>
              <text x="0" y="26" fill="#0284c7" textAnchor="middle" className="font-mono text-[8px]">
                Lowers 3&apos;-OH pKa
              </text>
            </g>

            <g transform="translate(360, 210)">
              {/* Metal Ion B */}
              <circle cx="0" cy="0" r="16" fill="#0284c7" />
              <text x="0" y="4" fill="#fff" textAnchor="middle" className="font-mono text-[10px] font-bold">Mg²⁺B</text>
              <text x="0" y="26" fill="#0284c7" textAnchor="middle" className="font-mono text-[8px]">
                Stabilizes PPi
              </text>
            </g>

            {/* Invariant Active Site Aspartates */}
            <g transform="translate(310, 280)">
              <rect x="-60" y="-10" width="120" height="20" rx="3" fill="#64748b" />
              <text x="0" y="4" fill="#fff" textAnchor="middle" className="font-mono text-[10px]">
                Asp88 · Asp89 Catalytic Dyad
              </text>
            </g>
          </svg>
        </div>

        {/* Scientific Details Matrix */}
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 border border-border">
              <div className="text-[10px] uppercase text-muted tracking-wider mb-1">Two-Metal-Ion Mechanism</div>
              <p className="text-foreground leading-relaxed">
                Mg²⁺ (Ion A) activates the primer 3&apos;-OH group by facilitating its deprotonation to form a powerful alkoxide nucleophile. Mg²⁺ (Ion B) stabilizes the pentacoordinate transition state and the leaving pyrophosphate (PPi).
              </p>
            </div>
            <div className="p-3 bg-gray-50 border border-border">
              <div className="text-[10px] uppercase text-muted tracking-wider mb-1">Thermodynamic Driving Force</div>
              <p className="text-foreground leading-relaxed">
                Hydrolysis of the released pyrophosphate (PPi + H₂O → 2 Pi) by ubiquitous inorganic pyrophosphatase yields ΔG°′ ≈ -19 kJ/mol, driving polymerization irreversibly forward.
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 border border-blue-200 text-blue-900">
            <div className="text-[10px] uppercase font-bold tracking-wider mb-1 text-blue-700">
              Why Synthesis is Strictly 5&apos; → 3&apos;
            </div>
            <p className="leading-relaxed">
              If synthesis proceeded 3&apos; → 5&apos;, the high-energy triphosphate would sit on the growing strand instead of the incoming monomer. If an incorrect nucleotide was excised by 3&apos;→5&apos; proofreading exonuclease, the growing 5&apos; chain would be left with a dead monophosphate terminus, permanently halting replication.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Return to Replication Fork
          </button>
        </div>
      </div>
    </div>
  );
}
