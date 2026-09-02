"use client";

import React, { useId } from "react";
import { AppState } from "@/lib/types";
import { MOLECULAR_OBJECTS } from "@/lib/biology/enzymes";
import {
  TOP_TEMPLATE_BASES,
  BOTTOM_TEMPLATE_BASES,
  getComplementaryBase,
  getRNABase,
  getHydrogenBondCount,
} from "@/lib/biology/dnaModel";

interface DNARendererProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

// Precomputed exact spoke coordinates for the 6 hexamer subunits (prevents floating-point hydration mismatches)
const HELICASE_SPOKES = [
  { x: 18, y: 0 },
  { x: 9, y: 15.588 },
  { x: -9, y: 15.588 },
  { x: -18, y: 0 },
  { x: -9, y: -15.588 },
  { x: 9, y: -15.588 },
];

export default function DNARenderer({ state, setState }: DNARendererProps) {
  const glowId = useId();
  const activeHaloId = useId();
  const progress = state.progress;

  // Geometry Constants
  const BASE_SPACING = 20;
  const Y_TOP_UNWOUND = 160;
  const Y_TOP_NEW = 202;
  const Y_TOP_PAIRED = 270;
  const Y_BOTTOM_PAIRED = 330;
  const Y_BOTTOM_NEW = 398;
  const Y_BOTTOM_UNWOUND = 440;

  // Dynamic Fork Position: from X=220 at prog=0 to X=920 at prog=1000
  const forkX = 220 + (progress / 1000) * 700;

  // Leading Strand Dynamics
  // Priming occurs at progress 200-300
  // Synthesis from 300 to 1000
  const leadPrimerStartX = 140;
  const leadPrimerEndX = progress < 200 ? 140 : Math.min(200, 140 + ((progress - 200) / 100) * 60);
  const leadingStrandActive = progress >= 300;
  let leadingDnaEndX = leadPrimerEndX;
  if (leadingStrandActive) {
    const maxLead = Math.max(leadPrimerEndX, forkX - 45);
    const growth = leadPrimerEndX + ((progress - 300) / 700) * (880 - leadPrimerEndX);
    leadingDnaEndX = Math.min(maxLead, growth);
  }

  // Lagging Strand Dynamics (Okazaki Fragments)
  // Fragment 1:
  // Primase places primer at X=460 leftward to X=400 (progress 500-600)
  // Pol III extends from X=400 leftward to X=140 (progress 600-750)
  // Maturation (Pol I replaces primer, Ligase seals): progress 850-1000
  const frag1Active = progress >= 500;
  const frag1PrimerProgress = Math.min(1, Math.max(0, (progress - 500) / 100));
  const frag1PrimerStartX = 460;
  const frag1PrimerEndX = 460 - frag1PrimerProgress * 60; // 460 down to 400

  const frag1DnaProgress = Math.min(1, Math.max(0, (progress - 600) / 150));
  const frag1DnaStartX = 400;
  const frag1DnaEndX = 400 - frag1DnaProgress * 260; // 400 down to 140

  const frag1Matured = progress >= 880;

  // Fragment 2:
  // Primase places primer at X=760 leftward to X=700 (progress 750-840)
  // Pol III extends from X=700 leftward to X=460 (progress 840-960)
  // Ligase seals nick at 460 (progress 960-1000)
  const frag2Active = progress >= 750;
  const frag2PrimerProgress = Math.min(1, Math.max(0, (progress - 750) / 90));
  const frag2PrimerStartX = 760;
  const frag2PrimerEndX = 760 - frag2PrimerProgress * 60; // 760 down to 700

  const frag2DnaProgress = Math.min(1, Math.max(0, (progress - 840) / 120));
  const frag2DnaStartX = 700;
  const frag2DnaEndX = 700 - frag2DnaProgress * 240; // 700 down to 460

  const frag2Matured = progress >= 970;

  // Enzyme Coordinates & Opacities
  // Helicase: at fork apex
  const helicaseX = forkX - 15;
  const helicaseY = 300;
  const helicaseActive = progress > 50 && progress < 980;

  // Topoisomerase: ahead of helicase on paired duplex
  const topoX = Math.min(1040, forkX + 90);
  const topoY = 300;

  // Primase (Leading): active progress 200-320
  const primaseLeadActive = progress >= 180 && progress <= 330;
  const primaseLeadX = progress < 200 ? 140 : 140 + ((progress - 200) / 100) * 60;

  // Primase (Lagging): active progress 500-610 and 750-850
  const primaseLagActive = (progress >= 490 && progress <= 610) || (progress >= 740 && progress <= 850);
  let primaseLagX = 460;
  if (progress >= 490 && progress <= 610) {
    primaseLagX = 460 - frag1PrimerProgress * 60;
  } else if (progress >= 740 && progress <= 850) {
    primaseLagX = 760 - frag2PrimerProgress * 60;
  }

  // Polymerase III (Leading): follows leadingDnaEndX
  const polLeadActive = progress >= 290 && progress < 990;
  const polLeadX = leadingDnaEndX;

  // Polymerase III (Lagging): follows frag1DnaEndX then frag2DnaEndX
  const polLagActive = (progress >= 590 && progress <= 760) || (progress >= 830 && progress <= 970);
  let polLagX = 400;
  if (progress >= 590 && progress <= 760) {
    polLagX = frag1DnaEndX;
  } else if (progress >= 830 && progress <= 970) {
    polLagX = frag2DnaEndX;
  }

  // Polymerase I & Ligase (Maturation enzymes)
  const polIActive = progress >= 850 && progress <= 950;
  const polIX = 430;

  const ligaseActive = (progress >= 740 && progress <= 790) || (progress >= 890 && progress <= 990);
  const ligaseX = progress >= 890 ? 460 : 140;

  // Inspect selection helper
  const handleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const obj = MOLECULAR_OBJECTS[id];
    if (obj) {
      setState((s) => ({ ...s, selectedObject: obj }));
    }
  };

  const isSelected = (id: string) => state.selectedObject?.id === id;

  // SVG Curves for Parental Strands
  const topParentalPath = `M 20 ${Y_TOP_UNWOUND} L ${forkX - 50} ${Y_TOP_UNWOUND} C ${forkX + 15} ${Y_TOP_UNWOUND}, ${forkX + 35} ${Y_TOP_PAIRED}, ${forkX + 80} ${Y_TOP_PAIRED} L 1080 ${Y_TOP_PAIRED}`;
  const bottomParentalPath = `M 20 ${Y_BOTTOM_UNWOUND} L ${forkX - 50} ${Y_BOTTOM_UNWOUND} C ${forkX + 15} ${Y_BOTTOM_UNWOUND}, ${forkX + 35} ${Y_BOTTOM_PAIRED}, ${forkX + 80} ${Y_BOTTOM_PAIRED} L 1080 ${Y_BOTTOM_PAIRED}`;

  return (
    <div
      className="relative w-full h-full select-none"
      onClick={() => setState((s) => ({ ...s, selectedObject: null }))}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1100 600"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Interactive DNA Replication Fork Diagram"
      >
        <defs>
          {/* Subtle Glow Filter */}
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Active Pulsing Halo */}
          <filter id={activeHaloId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.14  0 0 0 0 0.38  0 0 0 0 0.92  0 0 0 0.45 0"
            />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Arrow Markers for Synthesis Vectors */}
          <marker
            id="arrow-leading"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--dna-new)" />
          </marker>

          <marker
            id="arrow-lagging"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--dna-new)" />
          </marker>
        </defs>

        {/* ============================================================ */}
        {/* 1. SCIENTIFIC GRID & INSTRUMENT MEASUREMENT TICKS */}
        {/* ============================================================ */}
        <g stroke="var(--border)" strokeWidth="0.5" opacity="0.35">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`gy-${i}`} x1="30" y1={i * 50 + 25} x2="1070" y2={i * 50 + 25} strokeDasharray="3 6" />
          ))}
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={`gx-${i}`} x1={i * 50 + 25} y1="30" x2={i * 50 + 25} y2="570" strokeDasharray="3 6" />
          ))}
        </g>

        {/* Origin of Replication Marker */}
        <g opacity="0.5">
          <line x1="140" y1="90" x2="140" y2="510" stroke="var(--muted)" strokeWidth="1" strokeDasharray="2 4" />
          <text x="140" y="80" textAnchor="middle" className="font-mono text-[9px] fill-muted uppercase tracking-widest">
            Ori (Origin)
          </text>
        </g>

        {/* ============================================================ */}
        {/* 2. BASE PAIRS & HYDROGEN BONDS LAYER */}
        {/* ============================================================ */}
        <g
          className="cursor-pointer transition-opacity duration-200"
          onClick={(e) => handleSelect("base-pairs", e)}
        >
          {TOP_TEMPLATE_BASES.map((topBase, index) => {
            const x = 50 + index * BASE_SPACING;
            if (x > 1060) return null;
            const bottomBase = BOTTOM_TEMPLATE_BASES[index] || getComplementaryBase(topBase);
            const hBonds = getHydrogenBondCount(topBase, bottomBase);

            // A. UNREPLICATED PAIRED REGION (Ahead of fork)
            if (x > forkX + 75) {
              return (
                <g key={`pair-${index}`} opacity="0.75">
                  {/* Hydrogen bonds lines (2 for A=T, 3 for G≡C) */}
                  {hBonds === 2 ? (
                    <>
                      <line x1={x - 2} y1={Y_TOP_PAIRED + 4} x2={x - 2} y2={Y_BOTTOM_PAIRED - 4} stroke="var(--foreground)" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.4" />
                      <line x1={x + 2} y1={Y_TOP_PAIRED + 4} x2={x + 2} y2={Y_BOTTOM_PAIRED - 4} stroke="var(--foreground)" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.4" />
                    </>
                  ) : (
                    <>
                      <line x1={x - 3} y1={Y_TOP_PAIRED + 4} x2={x - 3} y2={Y_BOTTOM_PAIRED - 4} stroke="var(--foreground)" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.4" />
                      <line x1={x} y1={Y_TOP_PAIRED + 4} x2={x} y2={Y_BOTTOM_PAIRED - 4} stroke="var(--foreground)" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.4" />
                      <line x1={x + 3} y1={Y_TOP_PAIRED + 4} x2={x + 3} y2={Y_BOTTOM_PAIRED - 4} stroke="var(--foreground)" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.4" />
                    </>
                  )}

                  {/* Base letters if toggled on */}
                  {state.showBaseLetters && (
                    <>
                      <text x={x} y={Y_TOP_PAIRED - 8} textAnchor="middle" className="font-mono text-[10px] font-medium fill-foreground">
                        {topBase}
                      </text>
                      <text x={x} y={Y_BOTTOM_PAIRED + 14} textAnchor="middle" className="font-mono text-[10px] font-medium fill-foreground">
                        {bottomBase}
                      </text>
                    </>
                  )}
                </g>
              );
            }

            // B. UNWOUND SINGLE-STRANDED / REPLICATING REGION (Behind fork)
            if (x < forkX - 45) {
              const hasLeadingNew = x >= leadPrimerStartX && x <= leadingDnaEndX;
              const isLeadRNA = hasLeadingNew && x <= leadPrimerEndX && !frag1Matured;
              const leadNewBase = isLeadRNA ? getRNABase(topBase) : getComplementaryBase(topBase);

              // Lagging Fragment Checks
              const hasFrag1RNA = x <= frag1PrimerStartX && x >= frag1PrimerEndX && !frag1Matured;
              const hasFrag1DNA = (x <= frag1DnaStartX && x >= frag1DnaEndX) || (frag1Matured && x <= frag1PrimerStartX && x >= frag1DnaEndX);
              const hasFrag2RNA = x <= frag2PrimerStartX && x >= frag2PrimerEndX && !frag2Matured;
              const hasFrag2DNA = (x <= frag2DnaStartX && x >= frag2DnaEndX) || (frag2Matured && x <= frag2PrimerStartX && x >= frag2DnaEndX);

              const hasLaggingNew = hasFrag1RNA || hasFrag1DNA || hasFrag2RNA || hasFrag2DNA;
              const isLagRNA = (hasFrag1RNA || hasFrag2RNA) && !frag1Matured;
              const lagNewBase = isLagRNA ? getRNABase(bottomBase) : getComplementaryBase(bottomBase);

              return (
                <g key={`unwound-${index}`}>
                  {/* Top Parental Base Nub */}
                  <line x1={x} y1={Y_TOP_UNWOUND} x2={x} y2={Y_TOP_UNWOUND + 8} stroke="var(--foreground)" strokeWidth="1.5" opacity="0.6" />
                  {state.showBaseLetters && (
                    <text x={x} y={Y_TOP_UNWOUND - 8} textAnchor="middle" className="font-mono text-[10px] font-medium fill-foreground">
                      {topBase}
                    </text>
                  )}

                  {/* Top Leading New Base & Hydrogen Bonds */}
                  {hasLeadingNew && (
                    <g>
                      <line
                        x1={x}
                        y1={Y_TOP_UNWOUND + 8}
                        x2={x}
                        y2={Y_TOP_NEW - 8}
                        stroke={isLeadRNA ? "var(--rna-primer)" : "var(--dna-new)"}
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                        opacity="0.75"
                      />
                      <line
                        x1={x}
                        y1={Y_TOP_NEW - 8}
                        x2={x}
                        y2={Y_TOP_NEW}
                        stroke={isLeadRNA ? "var(--rna-primer)" : "var(--dna-new)"}
                        strokeWidth="1.5"
                      />
                      {state.showBaseLetters && (
                        <text
                          x={x}
                          y={Y_TOP_NEW + 14}
                          textAnchor="middle"
                          className="font-mono text-[10px] font-bold"
                          fill={isLeadRNA ? "var(--rna-primer)" : "var(--dna-new)"}
                        >
                          {leadNewBase}
                        </text>
                      )}
                    </g>
                  )}

                  {/* Bottom Parental Base Nub */}
                  <line x1={x} y1={Y_BOTTOM_UNWOUND} x2={x} y2={Y_BOTTOM_UNWOUND - 8} stroke="var(--foreground)" strokeWidth="1.5" opacity="0.6" />
                  {state.showBaseLetters && (
                    <text x={x} y={Y_BOTTOM_UNWOUND + 16} textAnchor="middle" className="font-mono text-[10px] font-medium fill-foreground">
                      {bottomBase}
                    </text>
                  )}

                  {/* Bottom Lagging New Base & Hydrogen Bonds */}
                  {hasLaggingNew && (
                    <g>
                      <line
                        x1={x}
                        y1={Y_BOTTOM_UNWOUND - 8}
                        x2={x}
                        y2={Y_BOTTOM_NEW + 8}
                        stroke={isLagRNA ? "var(--rna-primer)" : "var(--dna-new)"}
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                        opacity="0.75"
                      />
                      <line
                        x1={x}
                        y1={Y_BOTTOM_NEW + 8}
                        x2={x}
                        y2={Y_BOTTOM_NEW}
                        stroke={isLagRNA ? "var(--rna-primer)" : "var(--dna-new)"}
                        strokeWidth="1.5"
                      />
                      {state.showBaseLetters && (
                        <text
                          x={x}
                          y={Y_BOTTOM_NEW - 8}
                          textAnchor="middle"
                          className="font-mono text-[10px] font-bold"
                          fill={isLagRNA ? "var(--rna-primer)" : "var(--dna-new)"}
                        >
                          {lagNewBase}
                        </text>
                      )}
                    </g>
                  )}
                </g>
              );
            }

            return null;
          })}
        </g>

        {/* ============================================================ */}
        {/* 3. PARENTAL TEMPLATE STRANDS (SOLID DARK LINES) */}
        {/* ============================================================ */}
        <g className="transition-all duration-200">
          {/* Top Parental (3' -> 5') */}
          <path
            d={topParentalPath}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={isSelected("parental-top") ? "5" : "3"}
            className="cursor-pointer transition-all"
            filter={isSelected("parental-top") ? `url(#${glowId})` : ""}
            onClick={(e) => handleSelect("parental-top", e)}
          />

          {/* Bottom Parental (5' -> 3') */}
          <path
            d={bottomParentalPath}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={isSelected("parental-bottom") ? "5" : "3"}
            className="cursor-pointer transition-all"
            filter={isSelected("parental-bottom") ? `url(#${glowId})` : ""}
            onClick={(e) => handleSelect("parental-bottom", e)}
          />
        </g>

        {/* ============================================================ */}
        {/* 4. SINGLE-STRAND BINDING PROTEINS (SSBs) */}
        {/* ============================================================ */}
        {progress > 80 && (
          <g
            className="cursor-pointer transition-opacity duration-300"
            onClick={(e) => handleSelect("ssb", e)}
          >
            {/* Top strand SSBs (between leading synthesis end and fork apex) */}
            {Array.from({ length: 4 }).map((_, i) => {
              const ssbX = leadingDnaEndX + 22 + i * 22;
              if (ssbX >= forkX - 45) return null;
              return (
                <g key={`ssb-top-${i}`} transform={`translate(${ssbX}, ${Y_TOP_UNWOUND - 12})`}>
                  <circle cx="0" cy="0" r="7.5" fill="var(--enzyme-ssb)" opacity="0.9" stroke="var(--background)" strokeWidth="1" />
                  <circle cx="-2.5" cy="-2.5" r="2" fill="#fff" opacity="0.6" />
                </g>
              );
            })}

            {/* Bottom strand SSBs (along lagging exposed template) */}
            {Array.from({ length: 6 }).map((_, i) => {
              const ssbX = (frag2Active ? frag2PrimerStartX : frag1PrimerStartX) + 24 + i * 22;
              if (ssbX >= forkX - 45) return null;
              return (
                <g key={`ssb-bot-${i}`} transform={`translate(${ssbX}, ${Y_BOTTOM_UNWOUND + 12})`}>
                  <circle cx="0" cy="0" r="7.5" fill="var(--enzyme-ssb)" opacity="0.9" stroke="var(--background)" strokeWidth="1" />
                  <circle cx="-2.5" cy="-2.5" r="2" fill="#fff" opacity="0.6" />
                </g>
              );
            })}
          </g>
        )}

        {/* ============================================================ */}
        {/* 5. NEWLY SYNTHESIZED DAUGHTER STRANDS & PRIMERS */}
        {/* ============================================================ */}

        {/* --- LEADING STRAND (Continuous 5' -> 3') --- */}
        {leadPrimerEndX > leadPrimerStartX && (
          <g
            className="cursor-pointer"
            onClick={(e) => handleSelect("leading-strand", e)}
          >
            {/* RNA Primer Segment */}
            <path
              d={`M ${leadPrimerStartX} ${Y_TOP_NEW} L ${leadPrimerEndX} ${Y_TOP_NEW}`}
              fill="none"
              stroke="var(--rna-primer)"
              strokeWidth={isSelected("rna-primer") ? "5" : "3.5"}
              strokeDasharray="4 2"
              onClick={(e) => handleSelect("rna-primer", e)}
            />

            {/* DNA Extension Segment */}
            {leadingDnaEndX > leadPrimerEndX && (
              <path
                d={`M ${leadPrimerEndX} ${Y_TOP_NEW} L ${leadingDnaEndX} ${Y_TOP_NEW}`}
                fill="none"
                stroke="var(--dna-new)"
                strokeWidth={isSelected("leading-strand") ? "5" : "3.5"}
                markerEnd={state.showDirection ? "url(#arrow-leading)" : undefined}
                filter={isSelected("leading-strand") ? `url(#${glowId})` : ""}
              />
            )}
          </g>
        )}

        {/* --- LAGGING STRAND: OKAZAKI FRAGMENT 1 --- */}
        {frag1Active && (
          <g
            className="cursor-pointer"
            onClick={(e) => handleSelect("lagging-strand", e)}
          >
            {/* Fragment 1 RNA Primer (Replaced when matured) */}
            {!frag1Matured ? (
              <path
                d={`M ${frag1PrimerStartX} ${Y_BOTTOM_NEW} L ${frag1PrimerEndX} ${Y_BOTTOM_NEW}`}
                fill="none"
                stroke="var(--rna-primer)"
                strokeWidth="3.5"
                strokeDasharray="4 2"
                onClick={(e) => handleSelect("rna-primer", e)}
              />
            ) : (
              // Replaced with DNA by Pol I
              <path
                d={`M ${frag1PrimerStartX} ${Y_BOTTOM_NEW} L ${frag1PrimerEndX} ${Y_BOTTOM_NEW}`}
                fill="none"
                stroke="var(--dna-new)"
                strokeWidth="3.5"
              />
            )}

            {/* Fragment 1 DNA Body */}
            {frag1DnaStartX !== frag1DnaEndX && (
              <path
                d={`M ${frag1DnaStartX} ${Y_BOTTOM_NEW} L ${frag1DnaEndX} ${Y_BOTTOM_NEW}`}
                fill="none"
                stroke="var(--dna-new)"
                strokeWidth={isSelected("lagging-strand") ? "5" : "3.5"}
                markerEnd={state.showDirection && !frag1Matured ? "url(#arrow-lagging)" : undefined}
                filter={isSelected("lagging-strand") ? `url(#${glowId})` : ""}
              />
            )}
          </g>
        )}

        {/* --- LAGGING STRAND: OKAZAKI FRAGMENT 2 --- */}
        {frag2Active && (
          <g
            className="cursor-pointer"
            onClick={(e) => handleSelect("lagging-strand", e)}
          >
            {/* Fragment 2 RNA Primer */}
            {!frag2Matured ? (
              <path
                d={`M ${frag2PrimerStartX} ${Y_BOTTOM_NEW} L ${frag2PrimerEndX} ${Y_BOTTOM_NEW}`}
                fill="none"
                stroke="var(--rna-primer)"
                strokeWidth="3.5"
                strokeDasharray="4 2"
                onClick={(e) => handleSelect("rna-primer", e)}
              />
            ) : (
              <path
                d={`M ${frag2PrimerStartX} ${Y_BOTTOM_NEW} L ${frag2PrimerEndX} ${Y_BOTTOM_NEW}`}
                fill="none"
                stroke="var(--dna-new)"
                strokeWidth="3.5"
              />
            )}

            {/* Fragment 2 DNA Body */}
            {frag2DnaStartX !== frag2DnaEndX && (
              <path
                d={`M ${frag2DnaStartX} ${Y_BOTTOM_NEW} L ${frag2DnaEndX} ${Y_BOTTOM_NEW}`}
                fill="none"
                stroke="var(--dna-new)"
                strokeWidth={isSelected("lagging-strand") ? "5" : "3.5"}
                markerEnd={state.showDirection && !frag2Matured ? "url(#arrow-lagging)" : undefined}
                filter={isSelected("lagging-strand") ? `url(#${glowId})` : ""}
              />
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 6. POLARITY LABELS & 5'/3' END BADGES */}
        {/* ============================================================ */}
        {state.showDirection && (
          <g className="font-mono text-xs font-semibold select-none">
            {/* Top Parental 3' (Left) and 5' (Right) */}
            <g transform={`translate(28, ${Y_TOP_UNWOUND - 14})`}>
              <rect x="-12" y="-10" width="24" height="18" rx="3" fill="var(--foreground)" />
              <text x="0" y="3" textAnchor="middle" fill="var(--background)" className="text-[10px]">
                3&apos;
              </text>
            </g>
            <g transform={`translate(1060, ${Y_TOP_PAIRED - 14})`}>
              <rect x="-12" y="-10" width="24" height="18" rx="3" fill="var(--foreground)" />
              <text x="0" y="3" textAnchor="middle" fill="var(--background)" className="text-[10px]">
                5&apos;
              </text>
            </g>

            {/* Bottom Parental 5' (Left) and 3' (Right) */}
            <g transform={`translate(28, ${Y_BOTTOM_UNWOUND + 18})`}>
              <rect x="-12" y="-10" width="24" height="18" rx="3" fill="var(--foreground)" />
              <text x="0" y="3" textAnchor="middle" fill="var(--background)" className="text-[10px]">
                5&apos;
              </text>
            </g>
            <g transform={`translate(1060, ${Y_BOTTOM_PAIRED + 18})`}>
              <rect x="-12" y="-10" width="24" height="18" rx="3" fill="var(--foreground)" />
              <text x="0" y="3" textAnchor="middle" fill="var(--background)" className="text-[10px]">
                3&apos;
              </text>
            </g>

            {/* Leading Strand 5' Start & 3' Extension Tip */}
            {leadPrimerEndX > leadPrimerStartX && (
              <>
                <g transform={`translate(${leadPrimerStartX - 16}, ${Y_TOP_NEW + 4})`}>
                  <circle cx="0" cy="0" r="8" fill="var(--rna-primer)" />
                  <text x="0" y="3" textAnchor="middle" fill="#fff" className="text-[9px] font-bold">
                    5&apos;
                  </text>
                </g>
                <g transform={`translate(${leadingDnaEndX + 16}, ${Y_TOP_NEW + 4})`}>
                  <polygon points="0,-7 8,0 0,7" fill="var(--dna-new)" />
                  <text x="14" y="3" textAnchor="middle" fill="var(--dna-new)" className="text-[9px] font-bold">
                    3&apos;-OH
                  </text>
                </g>
              </>
            )}

            {/* Lagging Strand 5' / 3'-OH markers */}
            {frag1Active && (
              <>
                <g transform={`translate(${frag1PrimerStartX + 16}, ${Y_BOTTOM_NEW + 4})`}>
                  <circle cx="0" cy="0" r="8" fill="var(--rna-primer)" />
                  <text x="0" y="3" textAnchor="middle" fill="#fff" className="text-[9px] font-bold">
                    5&apos;
                  </text>
                </g>
                <g transform={`translate(${frag1DnaEndX - 16}, ${Y_BOTTOM_NEW + 4})`}>
                  <polygon points="0,-7 -8,0 0,7" fill="var(--dna-new)" />
                  <text x="-16" y="3" textAnchor="middle" fill="var(--dna-new)" className="text-[9px] font-bold">
                    3&apos;-OH
                  </text>
                </g>
              </>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 7. ENZYMES LAYER */}
        {/* ============================================================ */}
        {state.showEnzymes && (
          <g>
            {/* --- TOPOISOMERASE (DNA Gyrase) --- */}
            <g
              transform={`translate(${topoX}, ${topoY})`}
              className="cursor-pointer transition-all duration-200"
              filter={isSelected("topoisomerase") ? `url(#${glowId})` : ""}
              onClick={(e) => handleSelect("topoisomerase", e)}
            >
              {/* Clamping Double Ring */}
              <ellipse cx="0" cy="-25" rx="14" ry="9" fill="var(--enzyme-topoisomerase)" opacity="0.85" />
              <ellipse cx="0" cy="25" rx="14" ry="9" fill="var(--enzyme-topoisomerase)" opacity="0.85" />
              <line x1="-12" y1="-25" x2="-12" y2="25" stroke="var(--enzyme-topoisomerase)" strokeWidth="4" />
              <line x1="12" y1="-25" x2="12" y2="25" stroke="var(--enzyme-topoisomerase)" strokeWidth="4" />
              <circle cx="0" cy="0" r="4" fill="var(--background)" />
              {state.showLabels && (
                <text x="0" y="-40" textAnchor="middle" className="font-mono text-[10px] font-medium fill-foreground">
                  Topoisomerase
                </text>
              )}
            </g>

            {/* --- HELICASE (Hexameric Ring) --- */}
            <g
              transform={`translate(${helicaseX}, ${helicaseY})`}
              className="cursor-pointer transition-all duration-200"
              filter={
                isSelected("helicase")
                  ? `url(#${glowId})`
                  : helicaseActive
                  ? `url(#${activeHaloId})`
                  : ""
              }
              onClick={(e) => handleSelect("helicase", e)}
            >
              {/* Hexameric Ring with 6 Subunits */}
              <g className={helicaseActive && state.isPlaying ? "animate-spin origin-center" : ""}>
                <polygon
                  points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11"
                  fill="var(--enzyme-helicase)"
                  stroke="var(--background)"
                  strokeWidth="2"
                />
                <circle cx="0" cy="0" r="9" fill="var(--background)" />
                {/* 6 Subunit dividing lines */}
                {HELICASE_SPOKES.map((spoke, i) => (
                  <line
                    key={`hex-${i}`}
                    x1={0}
                    y1={0}
                    x2={spoke.x}
                    y2={spoke.y}
                    stroke="var(--background)"
                    strokeWidth="1.5"
                  />
                ))}
              </g>

              {/* Central channel */}
              <circle cx="0" cy="0" r="4" fill="var(--enzyme-helicase)" />

              {state.showLabels && (
                <text x="0" y="-30" textAnchor="middle" className="font-mono text-[10px] font-medium fill-foreground">
                  Helicase (DnaB)
                </text>
              )}
            </g>

            {/* --- RNA PRIMASE (Leading) --- */}
            {primaseLeadActive && (
              <g
                transform={`translate(${primaseLeadX}, ${Y_TOP_UNWOUND + 12})`}
                className="cursor-pointer transition-all duration-200"
                filter={isSelected("primase") ? `url(#${glowId})` : `url(#${activeHaloId})`}
                onClick={(e) => handleSelect("primase", e)}
              >
                <path d="M -14 -10 L 14 -10 L 18 10 L -18 10 Z" fill="var(--enzyme-primase)" rx="3" />
                <circle cx="0" cy="0" r="3" fill="#fff" opacity="0.8" />
                {state.showLabels && (
                  <text x="0" y="-16" textAnchor="middle" className="font-mono text-[10px] font-medium fill-foreground">
                    Primase
                  </text>
                )}
              </g>
            )}

            {/* --- RNA PRIMASE (Lagging) --- */}
            {primaseLagActive && (
              <g
                transform={`translate(${primaseLagX}, ${Y_BOTTOM_UNWOUND - 12})`}
                className="cursor-pointer transition-all duration-200"
                filter={isSelected("primase") ? `url(#${glowId})` : `url(#${activeHaloId})`}
                onClick={(e) => handleSelect("primase", e)}
              >
                <path d="M -14 10 L 14 10 L 18 -10 L -18 -10 Z" fill="var(--enzyme-primase)" rx="3" />
                <circle cx="0" cy="0" r="3" fill="#fff" opacity="0.8" />
                {state.showLabels && (
                  <text x="0" y="24" textAnchor="middle" className="font-mono text-[10px] font-medium fill-foreground">
                    Primase
                  </text>
                )}
              </g>
            )}

            {/* --- DNA POLYMERASE III (Leading Strand) --- */}
            {polLeadActive && (
              <g
                transform={`translate(${polLeadX}, ${Y_TOP_NEW - 2})`}
                className="cursor-pointer transition-all duration-200"
                filter={
                  isSelected("polymerase-lead")
                    ? `url(#${glowId})`
                    : polLeadActive
                    ? `url(#${activeHaloId})`
                    : ""
                }
                onClick={(e) => handleSelect("polymerase-lead", e)}
              >
                {/* Polymerase Hand Cleft Structure */}
                <path
                  d="M -14 -16 C -6 -24, 16 -20, 18 -6 C 20 8, 8 18, -4 18 C -16 18, -22 6, -18 -6 Z"
                  fill="var(--enzyme-polymerase)"
                  stroke="var(--background)"
                  strokeWidth="1.5"
                />
                {/* Active site cleft indicator */}
                <circle cx="2" cy="0" r="4" fill="var(--background)" opacity="0.7" />
                <circle cx="2" cy="0" r="2" fill="var(--enzyme-polymerase)" />

                {/* Beta-sliding clamp ring behind pol */}
                <ellipse cx="-12" cy="0" rx="4" ry="12" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeDasharray="3 2" />

                {state.showLabels && (
                  <text x="0" y="-28" textAnchor="middle" className="font-mono text-[10px] font-bold fill-foreground">
                    DNA Pol III
                  </text>
                )}
              </g>
            )}

            {/* --- DNA POLYMERASE III (Lagging Strand) --- */}
            {polLagActive && (
              <g
                transform={`translate(${polLagX}, ${Y_BOTTOM_NEW + 2})`}
                className="cursor-pointer transition-all duration-200"
                filter={
                  isSelected("polymerase-lag")
                    ? `url(#${glowId})`
                    : polLagActive
                    ? `url(#${activeHaloId})`
                    : ""
                }
                onClick={(e) => handleSelect("polymerase-lag", e)}
              >
                {/* Polymerase Hand Structure (Mirrored) */}
                <path
                  d="M 14 16 C 6 24, -16 20, -18 6 C -20 -8, -8 -18, 4 -18 C 16 -18, 22 -6, 18 6 Z"
                  fill="var(--enzyme-polymerase)"
                  stroke="var(--background)"
                  strokeWidth="1.5"
                />
                <circle cx="-2" cy="0" r="4" fill="var(--background)" opacity="0.7" />
                <circle cx="-2" cy="0" r="2" fill="var(--enzyme-polymerase)" />

                {/* Beta clamp ring */}
                <ellipse cx="12" cy="0" rx="4" ry="12" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeDasharray="3 2" />

                {state.showLabels && (
                  <text x="0" y="34" textAnchor="middle" className="font-mono text-[10px] font-bold fill-foreground">
                    DNA Pol III
                  </text>
                )}
              </g>
            )}

            {/* --- DNA POLYMERASE I (Nick Translation) --- */}
            {polIActive && (
              <g
                transform={`translate(${polIX}, ${Y_BOTTOM_NEW})`}
                className="cursor-pointer transition-all duration-200"
                filter={isSelected("polymerase-i") ? `url(#${glowId})` : `url(#${activeHaloId})`}
                onClick={(e) => handleSelect("polymerase-i", e)}
              >
                <circle cx="0" cy="0" r="14" fill="var(--enzyme-polymerase-i)" stroke="var(--background)" strokeWidth="1.5" />
                <text x="0" y="3" textAnchor="middle" fill="#fff" className="font-mono text-[8px] font-bold">
                  Pol I
                </text>
                {state.showLabels && (
                  <text x="0" y="-20" textAnchor="middle" className="font-mono text-[10px] font-medium fill-foreground">
                    Pol I (Primer Removal)
                  </text>
                )}
              </g>
            )}

            {/* --- DNA LIGASE (Nick Sealing) --- */}
            {ligaseActive && (
              <g
                transform={`translate(${ligaseX}, ${Y_BOTTOM_NEW})`}
                className="cursor-pointer transition-all duration-200"
                filter={isSelected("ligase") ? `url(#${glowId})` : `url(#${activeHaloId})`}
                onClick={(e) => handleSelect("ligase", e)}
              >
                <rect x="-11" y="-11" width="22" height="22" rx="4" fill="var(--enzyme-ligase)" stroke="var(--background)" strokeWidth="1.5" />
                <text x="0" y="3" textAnchor="middle" fill="#fff" className="font-mono text-[8px] font-bold">
                  Lig
                </text>
                {state.showLabels && (
                  <text x="0" y="24" textAnchor="middle" className="font-mono text-[10px] font-medium fill-foreground">
                    DNA Ligase
                  </text>
                )}
              </g>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 8. STRUCTURAL LABELS & ANNOTATIONS */}
        {/* ============================================================ */}
        {state.showLabels && (
          <g className="font-mono text-xs fill-muted select-none pointer-events-none transition-opacity duration-200">
            {/* Parental Duplex Label */}
            {forkX < 850 && (
              <text x={Math.min(1000, forkX + 160)} y={Y_TOP_PAIRED - 20} className="text-[11px] uppercase tracking-wider">
                Parental Duplex (dsDNA)
              </text>
            )}

            {/* Leading Strand Label */}
            {leadingDnaEndX > 240 && (
              <text x="210" y={Y_TOP_NEW - 20} fill="var(--dna-new)" className="text-[11px] font-medium">
                Leading Strand (Continuous 5&apos; → 3&apos;)
              </text>
            )}

            {/* Lagging Strand Label */}
            {frag1Active && (
              <text x="240" y={Y_BOTTOM_NEW + 34} fill="var(--dna-new)" className="text-[11px] font-medium">
                Lagging Strand (Okazaki Fragments)
              </text>
            )}

            {/* Replication Fork Apex Indicator */}
            <g transform={`translate(${forkX}, 48)`}>
              <line x1="0" y1="0" x2="0" y2="40" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 2" />
              <text x="0" y="-6" textAnchor="middle" className="text-[10px] uppercase tracking-widest fill-muted">
                Fork Movement →
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
