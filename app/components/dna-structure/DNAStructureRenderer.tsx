"use client";

import React, { useId } from "react";
import {
  BaseType,
  DNA_STRUCTURE_SEQUENCE,
  getHydrogenBondCount,
} from "@/lib/biology/dnaStructureModel";

interface DNAStructureRendererProps {
  selectedIndex: number | null;
  onSelectIndex: (index: number | null) => void;
  unzipProgress: number; // 0 to 1
  rotationAngle: number; // radians (0 to 2*PI)
  filterMode: "all" | "at" | "gc";
  showDirection: boolean;
  showHydrogenBonds: boolean;
  showBaseLetters: boolean;
  showGrooveLabels: boolean;
  onSelectEntity: (entityId: string) => void;
}

export default function DNAStructureRenderer({
  selectedIndex,
  onSelectIndex,
  unzipProgress,
  rotationAngle,
  filterMode,
  showDirection,
  showHydrogenBonds,
  showBaseLetters,
  showGrooveLabels,
  onSelectEntity,
}: DNAStructureRendererProps) {
  const glowId = useId();
  const topStrand = DNA_STRUCTURE_SEQUENCE.top;
  const bottomStrand = DNA_STRUCTURE_SEQUENCE.bottom;

  // Geometry Constants
  const TOTAL_PAIRS = topStrand.length; // 22 base pairs
  const BASE_SPACING = 46;
  const START_X = 65;
  const CENTER_Y = 260;
  const BASE_AMPLITUDE = 85;

  // Helical rate: ~10.5 base pairs per 360° turn
  const RAD_PER_PAIR = (2 * Math.PI) / 10.5;

  // Unzipping vertical displacement
  const unzipDisplacement = unzipProgress * 115;

  // Compute 3D Projected Coordinates for each Base Pair
  const pairCoords = topStrand.map((topBase: BaseType, i: number) => {
    const bottomBase = bottomStrand[i];
    const x = START_X + i * BASE_SPACING;
    const phase = i * RAD_PER_PAIR + rotationAngle;
    const sinVal = Math.sin(phase);
    const cosVal = Math.cos(phase);

    // Unzipping separates top strand upward and bottom strand downward
    const yTop = CENTER_Y + sinVal * BASE_AMPLITUDE - unzipDisplacement;
    const yBottom = CENTER_Y - sinVal * BASE_AMPLITUDE + unzipDisplacement;

    const hBonds = getHydrogenBondCount(topBase);
    const isAt = hBonds === 2;
    const isGc = hBonds === 3;
    const isSelected = selectedIndex === i;

    const isFilteredOut =
      (filterMode === "at" && !isAt) ||
      (filterMode === "gc" && !isGc);

    return {
      index: i,
      x,
      yTop,
      yBottom,
      topBase,
      bottomBase,
      sinVal,
      cosVal, // > 0 is front, < 0 is back
      hBonds,
      isAt,
      isGc,
      isSelected,
      isFilteredOut,
    };
  });

  // Generate SVG path for Top Sugar-Phosphate Backbone (5' -> 3')
  const topBackbonePath = pairCoords.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.yTop}` : `${acc} L ${pt.x} ${pt.yTop}`;
  }, "");

  // Generate SVG path for Bottom Sugar-Phosphate Backbone (3' -> 5')
  const bottomBackbonePath = pairCoords.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.yBottom}` : `${acc} L ${pt.x} ${pt.yBottom}`;
  }, "");

  const getBaseFill = (b: BaseType) => {
    switch (b) {
      case "A": return "#d97706"; // Amber
      case "T": return "#2563eb"; // Blue
      case "G": return "#059669"; // Emerald
      case "C": return "#4f46e5"; // Indigo
    }
  };

  const getBaseBg = (b: BaseType) => {
    switch (b) {
      case "A": return "rgba(217, 119, 6, 0.15)";
      case "T": return "rgba(37, 99, 235, 0.15)";
      case "G": return "rgba(5, 150, 105, 0.15)";
      case "C": return "rgba(79, 70, 229, 0.15)";
    }
  };

  return (
    <div
      className="relative w-full h-full select-none"
      onClick={() => onSelectIndex(null)}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1100 520"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Interactive DNA Molecular Structure and Base Pairing Diagram"
      >
        <defs>
          {/* Subtle Primary Selection Glow */}
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Directional Arrow Markers */}
          <marker
            id="arrow-5to3"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
          </marker>

          <marker
            id="arrow-3to5"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0f172a" />
          </marker>
        </defs>

        {/* 1. COORDINATE REFERENCE GRID (SUBTLE) */}
        <g stroke="var(--border)" strokeWidth="0.5" opacity="0.4">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`gy-${i}`} x1="30" y1={i * 60 + 20} x2="1070" y2={i * 60 + 20} strokeDasharray="3 6" />
          ))}
          {Array.from({ length: 23 }).map((_, i) => (
            <line key={`gx-${i}`} x1={i * 46 + 45} y1="30" x2={i * 46 + 45} y2="490" strokeDasharray="3 6" />
          ))}
          {/* Central Helical Axis */}
          <line x1="40" y1={CENTER_Y} x2="1060" y2={CENTER_Y} stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
        </g>

        {/* 2. MAJOR AND MINOR GROOVE ANNOTATIONS */}
        {showGrooveLabels && unzipProgress < 0.25 && (
          <g className="font-mono text-[9px] fill-muted uppercase tracking-wider" opacity="0.85">
            {/* Major Groove 1 (Turn 1) */}
            <path d="M 160 110 Q 230 90 300 110" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
            <text x="230" y="82" textAnchor="middle" className="font-bold fill-slate-700 cursor-pointer" onClick={() => onSelectEntity("major-minor-groove")}>
              Major Groove (~12 Å / Wide)
            </text>

            {/* Minor Groove 1 (Turn 1) */}
            <path d="M 390 140 Q 440 120 490 140" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
            <text x="440" y="112" textAnchor="middle" className="font-bold fill-slate-700 cursor-pointer" onClick={() => onSelectEntity("major-minor-groove")}>
              Minor Groove (~6 Å / Narrow)
            </text>

            {/* Major Groove 2 (Turn 2) */}
            <path d="M 640 110 Q 710 90 780 110" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
            <text x="710" y="82" textAnchor="middle" className="font-bold fill-slate-700 cursor-pointer" onClick={() => onSelectEntity("major-minor-groove")}>
              Major Groove (~12 Å)
            </text>
          </g>
        )}

        {/* 3. BASE PAIR RUNGS & HYDROGEN BONDS */}
        <g id="base-pairs-layer">
          {pairCoords.map((pt) => {
            const isPurineTop = pt.topBase === "A" || pt.topBase === "G";
            const isPurineBottom = pt.bottomBase === "A" || pt.bottomBase === "G";

            // Inward base length projection
            const topBaseHeight = isPurineTop ? 28 : 20;
            const bottomBaseHeight = isPurineBottom ? 28 : 20;

            const topBaseDir = pt.yTop < CENTER_Y ? 1 : -1;
            const bottomBaseDir = pt.yBottom < CENTER_Y ? 1 : -1;

            const topBaseEndY = pt.yTop + topBaseDir * topBaseHeight;
            const bottomBaseEndY = pt.yBottom + bottomBaseDir * bottomBaseHeight;

            const isSevered = unzipProgress > 0.35;
            const isAnySelected = selectedIndex !== null;
            const isDimmed = (isAnySelected && !pt.isSelected) || pt.isFilteredOut;

            return (
              <g
                key={`pair-${pt.index}`}
                opacity={isDimmed ? 0.25 : 1}
                className="transition-opacity duration-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectIndex(pt.isSelected ? null : pt.index);
                  onSelectEntity(pt.isAt ? "base-pair-at" : "base-pair-gc");
                }}
              >
                {/* --- TOP BASE BLOCK --- */}
                <g
                  filter={pt.isSelected ? `url(#${glowId})` : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIndex(pt.index);
                    onSelectEntity(pt.topBase === "A" ? "adenine" : pt.topBase === "T" ? "thymine" : pt.topBase === "G" ? "guanine" : "cytosine");
                  }}
                >
                  <rect
                    x={pt.x - 12}
                    y={Math.min(pt.yTop, topBaseEndY)}
                    width={24}
                    height={topBaseHeight}
                    rx={2.5}
                    fill={getBaseBg(pt.topBase)}
                    stroke={getBaseFill(pt.topBase)}
                    strokeWidth={pt.isSelected ? 2.5 : 1.5}
                  />
                  {showBaseLetters && (
                    <text
                      x={pt.x}
                      y={(pt.yTop + topBaseEndY) * 0.5 + 3.5}
                      textAnchor="middle"
                      fill={getBaseFill(pt.topBase)}
                      className="font-mono text-[10px] font-bold pointer-events-none"
                    >
                      {pt.topBase}
                    </text>
                  )}
                </g>

                {/* --- BOTTOM BASE BLOCK --- */}
                <g
                  filter={pt.isSelected ? `url(#${glowId})` : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIndex(pt.index);
                    onSelectEntity(pt.bottomBase === "A" ? "adenine" : pt.bottomBase === "T" ? "thymine" : pt.bottomBase === "G" ? "guanine" : "cytosine");
                  }}
                >
                  <rect
                    x={pt.x - 12}
                    y={Math.min(pt.yBottom, bottomBaseEndY)}
                    width={24}
                    height={bottomBaseHeight}
                    rx={2.5}
                    fill={getBaseBg(pt.bottomBase)}
                    stroke={getBaseFill(pt.bottomBase)}
                    strokeWidth={pt.isSelected ? 2.5 : 1.5}
                  />
                  {showBaseLetters && (
                    <text
                      x={pt.x}
                      y={(pt.yBottom + bottomBaseEndY) * 0.5 + 3.5}
                      textAnchor="middle"
                      fill={getBaseFill(pt.bottomBase)}
                      className="font-mono text-[10px] font-bold pointer-events-none"
                    >
                      {pt.bottomBase}
                    </text>
                  )}
                </g>

                {/* --- HYDROGEN BOND CONNECTOR RUNGS --- */}
                {showHydrogenBonds && (
                  <g
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectIndex(pt.index);
                      onSelectEntity("hydrogen-bond");
                    }}
                  >
                    {!isSevered ? (
                      pt.hBonds === 2 ? (
                        // 2 Hydrogen Bonds for A-T
                        <>
                          <line
                            x1={pt.x - 3}
                            y1={topBaseEndY}
                            x2={pt.x - 3}
                            y2={bottomBaseEndY}
                            stroke={pt.isSelected ? "#2563eb" : "#0284c7"}
                            strokeWidth={pt.isSelected ? 2 : 1.2}
                            strokeDasharray="2 2.5"
                          />
                          <line
                            x1={pt.x + 3}
                            y1={topBaseEndY}
                            x2={pt.x + 3}
                            y2={bottomBaseEndY}
                            stroke={pt.isSelected ? "#2563eb" : "#0284c7"}
                            strokeWidth={pt.isSelected ? 2 : 1.2}
                            strokeDasharray="2 2.5"
                          />
                        </>
                      ) : (
                        // 3 Hydrogen Bonds for G-C
                        <>
                          <line
                            x1={pt.x - 4}
                            y1={topBaseEndY}
                            x2={pt.x - 4}
                            y2={bottomBaseEndY}
                            stroke={pt.isSelected ? "#059669" : "#10b981"}
                            strokeWidth={pt.isSelected ? 2 : 1.2}
                            strokeDasharray="2 2.5"
                          />
                          <line
                            x1={pt.x}
                            y1={topBaseEndY}
                            x2={pt.x}
                            y2={bottomBaseEndY}
                            stroke={pt.isSelected ? "#059669" : "#10b981"}
                            strokeWidth={pt.isSelected ? 2 : 1.2}
                            strokeDasharray="2 2.5"
                          />
                          <line
                            x1={pt.x + 4}
                            y1={topBaseEndY}
                            x2={pt.x + 4}
                            y2={bottomBaseEndY}
                            stroke={pt.isSelected ? "#059669" : "#10b981"}
                            strokeWidth={pt.isSelected ? 2 : 1.2}
                            strokeDasharray="2 2.5"
                          />
                        </>
                      )
                    ) : (
                      // Broken / Severed Hydrogen Bonds during Unzipping
                      <g opacity="0.6">
                        <line
                          x1={pt.x}
                          y1={topBaseEndY}
                          x2={pt.x}
                          y2={topBaseEndY + (pt.yTop < CENTER_Y ? 10 : -10)}
                          stroke="#ef4444"
                          strokeWidth="1.2"
                          strokeDasharray="2 3"
                        />
                        <line
                          x1={pt.x}
                          y1={bottomBaseEndY}
                          x2={pt.x}
                          y2={bottomBaseEndY + (pt.yBottom < CENTER_Y ? 10 : -10)}
                          stroke="#ef4444"
                          strokeWidth="1.2"
                          strokeDasharray="2 3"
                        />
                      </g>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 4. EXTERIOR SUGAR-PHOSPHATE BACKBONES */}
        <g id="backbones-layer">
          {/* Top Strand Backbone (5' -> 3') */}
          <path
            d={topBackbonePath}
            fill="none"
            stroke="#2563eb"
            strokeWidth={showDirection ? 4 : 3.5}
            className="cursor-pointer transition-all hover:stroke-blue-700"
            markerEnd={showDirection ? "url(#arrow-5to3)" : undefined}
            onClick={() => onSelectEntity("sugar-phosphate-backbone")}
          />

          {/* Bottom Strand Backbone (3' -> 5') */}
          <path
            d={bottomBackbonePath}
            fill="none"
            stroke="#0f172a"
            strokeWidth={showDirection ? 4 : 3.5}
            className="cursor-pointer transition-all hover:stroke-slate-900"
            markerEnd={showDirection ? "url(#arrow-3to5)" : undefined}
            onClick={() => onSelectEntity("sugar-phosphate-backbone")}
          />

          {/* Individual Phosphate / Sugar Nodes on Backbone */}
          {pairCoords.map((pt) => (
            <g key={`nodes-${pt.index}`} opacity={selectedIndex !== null && !pt.isSelected ? 0.4 : 1}>
              {/* Top Backbone Node */}
              <circle
                cx={pt.x}
                cy={pt.yTop}
                r={pt.isSelected ? 5.5 : 4}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEntity(pt.index % 2 === 0 ? "deoxyribose" : "phosphate-group");
                }}
              />
              {/* Bottom Backbone Node */}
              <circle
                cx={pt.x}
                cy={pt.yBottom}
                r={pt.isSelected ? 5.5 : 4}
                fill="#0f172a"
                stroke="#ffffff"
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEntity(pt.index % 2 === 0 ? "deoxyribose" : "phosphate-group");
                }}
              />
            </g>
          ))}
        </g>

        {/* 5. 5' AND 3' TERMINAL POLARITY BADGES */}
        <g id="termini-layer" className="font-mono font-bold text-[10px] select-none">
          {/* Top Strand Left 5' Terminus */}
          <g transform={`translate(${pairCoords[0].x - 32}, ${pairCoords[0].yTop - 10})`} className="cursor-pointer" onClick={() => onSelectEntity("antiparallel-strands")}>
            <rect x="0" y="0" width="26" height="20" rx="3" fill="#2563eb" />
            <text x="13" y="14" fill="#ffffff" textAnchor="middle">5&apos;</text>
          </g>

          {/* Top Strand Right 3' Terminus */}
          <g transform={`translate(${pairCoords[TOTAL_PAIRS - 1].x + 8}, ${pairCoords[TOTAL_PAIRS - 1].yTop - 10})`} className="cursor-pointer" onClick={() => onSelectEntity("antiparallel-strands")}>
            <rect x="0" y="0" width="26" height="20" rx="3" fill="#2563eb" />
            <text x="13" y="14" fill="#ffffff" textAnchor="middle">3&apos;</text>
          </g>

          {/* Bottom Strand Left 3' Terminus */}
          <g transform={`translate(${pairCoords[0].x - 32}, ${pairCoords[0].yBottom - 10})`} className="cursor-pointer" onClick={() => onSelectEntity("antiparallel-strands")}>
            <rect x="0" y="0" width="26" height="20" rx="3" fill="#0f172a" />
            <text x="13" y="14" fill="#ffffff" textAnchor="middle">3&apos;</text>
          </g>

          {/* Bottom Strand Right 5' Terminus */}
          <g transform={`translate(${pairCoords[TOTAL_PAIRS - 1].x + 8}, ${pairCoords[TOTAL_PAIRS - 1].yBottom - 10})`} className="cursor-pointer" onClick={() => onSelectEntity("antiparallel-strands")}>
            <rect x="0" y="0" width="26" height="20" rx="3" fill="#0f172a" />
            <text x="13" y="14" fill="#ffffff" textAnchor="middle">5&apos;</text>
          </g>
        </g>
      </svg>

      {/* Floating Interactive Watermark Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-4 bg-white/95 backdrop-blur-xs border border-border px-3 py-2 font-mono text-[10px] text-muted shadow-xs">
        <button
          onClick={() => onSelectEntity("sugar-phosphate-backbone")}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="w-3 h-1 bg-blue-600 inline-block" />
          <span>5′→3′ Backbone</span>
        </button>
        <button
          onClick={() => onSelectEntity("sugar-phosphate-backbone")}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="w-3 h-1 bg-slate-900 inline-block" />
          <span>3′→5′ Backbone</span>
        </button>
        <button
          onClick={() => onSelectEntity("base-pair-at")}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="w-2.5 h-2 bg-amber-500 inline-block" />
          <span>A═T (2 H-Bonds)</span>
        </button>
        <button
          onClick={() => onSelectEntity("base-pair-gc")}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="w-2.5 h-2 bg-emerald-600 inline-block" />
          <span>G≡C (3 H-Bonds)</span>
        </button>
      </div>
    </div>
  );
}
