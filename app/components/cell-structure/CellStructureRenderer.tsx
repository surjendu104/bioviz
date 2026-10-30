"use client";

import React, { useId } from "react";
import {
  CellType,
  OrganelleData,
  ORGANELLES,
} from "@/lib/biology/cellStructureModel";

interface CellStructureRendererProps {
  cellType: CellType;
  selectedOrganelle: OrganelleData | null;
  onSelectOrganelle: (organelle: OrganelleData | null) => void;
  isFocused: boolean;
  onToggleFocus: () => void;
  showLabels: boolean;
  showRelationships: boolean;
  showBoundaries: boolean;
}

/* ------------------------------------------------------------------ */
/*  Reusable organelle illustrations (book-style)                     */
/* ------------------------------------------------------------------ */

function Mitochondrion({
  x,
  y,
  rotate = 0,
  scale = 1,
  onSelect,
  highlighted,
  opacity = 1,
}: {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
  onSelect: (e: React.MouseEvent) => void;
  highlighted: boolean;
  opacity?: number;
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
      opacity={opacity}
      className="cursor-pointer transition-opacity"
      onClick={onSelect}
    >
      {/* Outer membrane */}
      <ellipse cx="0" cy="0" rx="52" ry="25" fill="#f97316" stroke="#9a3412" strokeWidth="2.5" />
      {/* Inner membrane */}
      <ellipse cx="0" cy="0" rx="43" ry="18" fill="#fb923c" stroke="#c2410c" strokeWidth="1.5" />
      {/* Cristae */}
      {[-32, -20, -8, 4, 16, 28].map((cx, i) => (
        <path
          key={i}
          d={`M ${cx} -17 C ${cx + 7} -6, ${cx + 7} 6, ${cx} 17`}
          fill="none"
          stroke="#7c2d12"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.8"
        />
      ))}
      {highlighted && (
        <ellipse cx="0" cy="0" rx="56" ry="29" fill="none" stroke="#fbbf24" strokeWidth="3" />
      )}
    </g>
  );
}

function Chloroplast({
  x,
  y,
  rotate = 0,
  scale = 1,
  onSelect,
  highlighted,
  opacity = 1,
}: {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
  onSelect: (e: React.MouseEvent) => void;
  highlighted: boolean;
  opacity?: number;
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
      opacity={opacity}
      className="cursor-pointer transition-opacity"
      onClick={onSelect}
    >
      <ellipse cx="0" cy="0" rx="58" ry="30" fill="#16a34a" stroke="#14532d" strokeWidth="2.5" />
      <ellipse cx="0" cy="0" rx="50" ry="23" fill="#15803d" />
      {/* Grana stacks */}
      {[-34, -12, 12, 34].map((gx, gi) => (
        <g key={gi} transform={`translate(${gx}, 0)`}>
          {[-12, -6, 0, 6, 12].map((gy, i) => (
            <rect
              key={i}
              x="-9"
              y={gy - 2.5}
              width="18"
              height="5"
              rx="1.5"
              fill="#86efac"
              stroke="#166534"
              strokeWidth="0.8"
            />
          ))}
        </g>
      ))}
      {highlighted && (
        <ellipse cx="0" cy="0" rx="62" ry="34" fill="none" stroke="#fbbf24" strokeWidth="3" />
      )}
    </g>
  );
}

function Golgi({
  x,
  y,
  rotate = 0,
  onSelect,
  highlighted,
  opacity = 1,
}: {
  x: number;
  y: number;
  rotate?: number;
  onSelect: (e: React.MouseEvent) => void;
  highlighted: boolean;
  opacity?: number;
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotate})`}
      opacity={opacity}
      className="cursor-pointer transition-opacity"
      onClick={onSelect}
    >
      {[-26, -13, 0, 13, 26].map((gy, i) => (
        <path
          key={i}
          d={`M -48 ${gy - 9} C -18 ${gy + 13}, 18 ${gy + 13}, 48 ${gy - 9}`}
          fill="none"
          stroke="#a855f7"
          strokeWidth="7"
          strokeLinecap="round"
        />
      ))}
      {/* Vesicles */}
      <circle cx="-56" cy="-28" r="6" fill="#c084fc" stroke="#7e22ce" strokeWidth="1" />
      <circle cx="56" cy="30" r="6" fill="#c084fc" stroke="#7e22ce" strokeWidth="1" />
      <circle cx="40" cy="40" r="4.5" fill="#d8b4fe" stroke="#7e22ce" strokeWidth="1" />
      <circle cx="-40" cy="38" r="5" fill="#d8b4fe" stroke="#7e22ce" strokeWidth="1" />
      {highlighted && (
        <rect x="-60" y="-38" width="120" height="86" rx="10" fill="none" stroke="#fbbf24" strokeWidth="3" />
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */

export default function CellStructureRenderer({
  cellType,
  selectedOrganelle,
  onSelectOrganelle,
  isFocused,
  onToggleFocus,
  showLabels,
  showRelationships,
  showBoundaries,
}: CellStructureRendererProps) {
  const glowId = useId();
  const activeId = selectedOrganelle?.id || null;
  const isAnimal = cellType === "animal";

  const isSelected = (id: string) => activeId === id;
  const isRelated = (id: string) => {
    if (!selectedOrganelle || !showRelationships) return false;
    return selectedOrganelle.relationships.some((r) => r.targetId === id);
  };
  const getOpacity = (id: string) => {
    if (!activeId) return 1;
    if (isSelected(id) || isRelated(id)) return 1;
    return 0.22;
  };
  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const organelle = ORGANELLES[id];
    if (organelle) onSelectOrganelle(organelle);
  };

  const nucleusPos = isAnimal ? { x: 430, y: 330 } : { x: 195, y: 225 };

  return (
    <div
      className="relative w-full h-full select-none bg-slate-50/50"
      onClick={() => onSelectOrganelle(null)}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 650"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${isAnimal ? "Animal" : "Plant"} Eukaryotic Cell Diagram`}
      >
        <defs>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <marker id="relation-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
          </marker>

          <radialGradient id="cytoAnimal" cx="45%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="55%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fed7aa" />
          </radialGradient>
          <radialGradient id="cytoPlant" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="60%" stopColor="#dcfce7" />
            <stop offset="100%" stopColor="#bbf7d0" />
          </radialGradient>
          <radialGradient id="nucGrad" cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#e0e7ff" />
            <stop offset="60%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#93c5fd" />
          </radialGradient>
          <radialGradient id="vacGrad" cx="50%" cy="45%" r="72%">
            <stop offset="0%" stopColor="#f0f9ff" />
            <stop offset="60%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </radialGradient>
        </defs>

        {!isFocused ? (
          <g id="whole-cell-layer">
            {/* ================= PLANT CELL WALL ================= */}
            {!isAnimal && (
              <g
                id="cell-wall-group"
                opacity={getOpacity("cell-wall")}
                className="cursor-pointer transition-opacity duration-200"
                onClick={(e) => handleSelect("cell-wall", e)}
              >
                <rect x="55" y="50" width="890" height="550" rx="26" fill="#86efac" stroke="#166534" strokeWidth="4" filter={isSelected("cell-wall") ? `url(#${glowId})` : undefined} />
                <rect x="78" y="73" width="844" height="504" rx="16" fill="#bbf7d0" stroke="#15803d" strokeWidth="2" />
                {/* Cellulose microfibrils (subtle layered striations) */}
                <g stroke="#4ade80" strokeWidth="0.8" opacity="0.28">
                  {Array.from({ length: 22 }).map((_, i) => (
                    <line key={`h-${i}`} x1="82" y1={80 + i * 22} x2="918" y2={80 + i * 22} />
                  ))}
                </g>
                {/* Plasmodesmata */}
                <g id="plasmodesmata-group" onClick={(e) => handleSelect("plasmodesmata", e)}>
                  {[
                    { x: 300, y: 60 },
                    { x: 700, y: 60 },
                    { x: 940, y: 300 },
                    { x: 60, y: 330 },
                  ].map((p, i) => (
                    <rect key={i} x={p.x - 5} y={p.y - 11} width="10" height="22" rx="3" fill="#f0fdf4" stroke="#166534" strokeWidth="1.5" />
                  ))}
                </g>
                {showLabels && (
                  <text x="80" y="40" className="font-mono text-[11px] font-bold fill-emerald-900">
                    Cell Wall (Cellulose)
                  </text>
                )}
              </g>
            )}

            {/* ================= PLASMA MEMBRANE ================= */}
            <g id="plasma-membrane-group">
              {isAnimal ? (
                <path
                  d="M 160 120 C 350 55, 720 60, 880 145 C 975 225, 975 430, 880 530 C 735 610, 300 615, 150 535 C 55 445, 55 210, 160 120 Z"
                  fill="url(#cytoAnimal)"
                  stroke={showBoundaries ? "#2563eb" : "#475569"}
                  strokeWidth={isSelected("plasma-membrane") ? "5" : "3.5"}
                  className="cursor-pointer transition-all"
                  filter={isSelected("plasma-membrane") ? `url(#${glowId})` : undefined}
                  onClick={(e) => handleSelect("plasma-membrane", e)}
                />
              ) : (
                <rect
                  x="90"
                  y="85"
                  width="820"
                  height="480"
                  rx="12"
                  fill="url(#cytoPlant)"
                  stroke={showBoundaries ? "#2563eb" : "#0284c7"}
                  strokeWidth={isSelected("plasma-membrane") ? "4.5" : "3"}
                  className="cursor-pointer transition-all"
                  filter={isSelected("plasma-membrane") ? `url(#${glowId})` : undefined}
                  onClick={(e) => handleSelect("plasma-membrane", e)}
                />
              )}
              {showLabels && (
                <text x={isAnimal ? "150" : "100"} y={isAnimal ? "105" : "102"} className="font-mono text-[11px] font-bold fill-slate-700 pointer-events-none">
                  Plasma Membrane
                </text>
              )}
            </g>

            {/* ================= PLANT CENTRAL VACUOLE ================= */}
            {!isAnimal && (
              <g
                id="central-vacuole-group"
                opacity={getOpacity("central-vacuole")}
                className="cursor-pointer transition-opacity duration-200"
                onClick={(e) => handleSelect("central-vacuole", e)}
              >
                <path
                  d="M 360 150 C 510 128, 680 138, 760 200 C 815 245, 815 430, 750 480 C 680 535, 480 540, 360 505 C 295 485, 285 380, 295 285 C 302 215, 318 160, 360 150 Z"
                  fill="url(#vacGrad)"
                  stroke="#0284c7"
                  strokeWidth="3"
                  filter={isSelected("central-vacuole") ? `url(#${glowId})` : undefined}
                />
                {/* Tonoplast dotted inner line */}
                <path
                  d="M 360 150 C 510 128, 680 138, 760 200 C 815 245, 815 430, 750 480 C 680 535, 480 540, 360 505 C 295 485, 285 380, 295 285 C 302 215, 318 160, 360 150 Z"
                  fill="none"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  opacity="0.8"
                />
                <text x="500" y="330" textAnchor="middle" className="font-display text-lg font-semibold fill-sky-900 pointer-events-none">
                  Central Vacuole
                </text>
                <text x="500" y="352" textAnchor="middle" className="font-mono text-[10px] fill-sky-800 pointer-events-none">
                  Cell Sap · Turgor Pressure
                </text>
              </g>
            )}

            {/* ================= NUCLEUS ================= */}
            <g
              id="nucleus-group"
              transform={`translate(${nucleusPos.x}, ${nucleusPos.y})`}
              opacity={getOpacity("nucleus")}
              className="cursor-pointer transition-all duration-200"
              onClick={(e) => handleSelect("nucleus", e)}
            >
              <circle cx="0" cy="0" r="92" fill="url(#nucGrad)" stroke="#1d4ed8" strokeWidth="4" filter={isSelected("nucleus") ? `url(#${glowId})` : undefined} />
              <circle cx="0" cy="0" r="82" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5 4" />
              {/* Nuclear pores */}
              {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => {
                const rad = (a * Math.PI) / 180;
                return <circle key={i} cx={Math.cos(rad) * 87} cy={Math.sin(rad) * 87} r="3" fill="#1e40af" />;
              })}
              {/* Chromatin */}
              <path d="M -50 -28 Q -14 -58, 30 -24 Q 56 12, 18 46 Q -34 54, -54 16 Z" fill="none" stroke="#2563eb" strokeWidth="2.2" opacity="0.65" />
              <path d="M -34 26 Q 8 12, 46 34" fill="none" stroke="#2563eb" strokeWidth="1.8" opacity="0.55" />
              <path d="M -44 -8 Q -8 -22, 24 0" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
              <path d="M 6 -42 Q 34 -18, 20 8" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
              {/* Nucleolus */}
              <circle
                cx="24"
                cy="-18"
                r="30"
                fill="#1e3a8a"
                className="cursor-pointer hover:fill-blue-950 transition-colors"
                filter={isSelected("nucleolus") ? `url(#${glowId})` : undefined}
                onClick={(e) => handleSelect("nucleolus", e)}
              />
              <circle cx="18" cy="-24" r="8" fill="#60a5fa" opacity="0.55" />
              <circle cx="30" cy="-10" r="4" fill="#93c5fd" opacity="0.4" />
              {showLabels && (
                <>
                  <text x="0" y="-104" textAnchor="middle" className="font-display text-sm font-bold fill-blue-900 pointer-events-none">
                    Nucleus
                  </text>
                  <text x="24" y="-13" textAnchor="middle" className="font-mono text-[9px] font-bold fill-white pointer-events-none">
                    Nucleolus
                  </text>
                </>
              )}
            </g>

            {/* ================= ROUGH & SMOOTH ER ================= */}
            <g transform={`translate(${nucleusPos.x}, ${nucleusPos.y}) scale(${isAnimal ? 1 : 0.56})`}>
              <g opacity={getOpacity("rough-er")} className="cursor-pointer" onClick={(e) => handleSelect("rough-er", e)}>
                <path d="M -120 -48 C -150 -90, -110 -150, -30 -164 C 50 -178, 130 -140, 156 -70" fill="none" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" filter={isSelected("rough-er") ? `url(#${glowId})` : undefined} />
                <path d="M -132 -28 C -168 -78, -124 -164, -22 -180 C 66 -192, 156 -148, 176 -64" fill="none" stroke="#3b82f6" strokeWidth="9" strokeLinecap="round" />
                <path d="M -112 -68 C -138 -104, -100 -150, -30 -162" fill="none" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                {/* Ribosomes on rough ER */}
                {[-130, -108, -82, -54, -26, 4, 34, 66, 98, 128, 152].map((rx, i) => {
                  const ry = -168 + Math.abs(rx) * 0.5;
                  return <circle key={i} cx={rx} cy={ry} r="3.4" fill="#0f172a" />;
                })}
                {showLabels && (
                  <text x="140" y="-205" className="font-mono text-[10px] font-semibold fill-blue-800">
                    Rough ER
                  </text>
                )}
              </g>

              <g opacity={getOpacity("smooth-er")} className="cursor-pointer" onClick={(e) => handleSelect("smooth-er", e)}>
                <path d="M -128 24 C -178 38, -196 92, -152 122 C -108 152, -128 194, -176 208" fill="none" stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" filter={isSelected("smooth-er") ? `url(#${glowId})` : undefined} />
                <path d="M -150 62 C -196 88, -178 150, -136 164" fill="none" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" />
                <path d="M -118 6 C -160 8, -182 40, -172 74" fill="none" stroke="#93c5fd" strokeWidth="6" strokeLinecap="round" />
                {showLabels && (
                  <text x={isAnimal ? -150 : -100} y={isAnimal ? 130 : 290} className="font-mono text-[10px] font-semibold fill-blue-600">
                    Smooth ER
                  </text>
                )}
              </g>
            </g>

            {/* ================= GOLGI ================= */}
            <g opacity={getOpacity("golgi-apparatus")}>
              <Golgi
                x={isAnimal ? 700 : 210}
                y={isAnimal ? 390 : 440}
                rotate={isAnimal ? 8 : -6}
                onSelect={(e) => handleSelect("golgi-apparatus", e)}
                highlighted={isSelected("golgi-apparatus")}
              />
              {showLabels && (
                <text x={isAnimal ? 700 : 210} y={isAnimal ? 452 : 502} textAnchor="middle" className="font-mono text-[10px] font-bold fill-purple-900 pointer-events-none">
                  Golgi Apparatus
                </text>
              )}
            </g>

            {/* ================= MITOCHONDRIA ================= */}
            <g opacity={getOpacity("mitochondria")}>
              <Mitochondrion x={isAnimal ? 250 : 175} y={isAnimal ? 200 : 350} rotate={-22} scale={isAnimal ? 1 : 0.8} onSelect={(e) => handleSelect("mitochondria", e)} highlighted={isSelected("mitochondria")} />
              <Mitochondrion x={isAnimal ? 650 : 835} y={isAnimal ? 190 : 250} rotate={32} scale={isAnimal ? 0.9 : 0.75} onSelect={(e) => handleSelect("mitochondria", e)} highlighted={isSelected("mitochondria")} />
              {isAnimal && (
                <>
                  <Mitochondrion x={340} y={510} rotate={-8} scale={0.9} onSelect={(e) => handleSelect("mitochondria", e)} highlighted={isSelected("mitochondria")} />
                  <Mitochondrion x={800} y={480} rotate={18} scale={0.85} onSelect={(e) => handleSelect("mitochondria", e)} highlighted={isSelected("mitochondria")} />
                  <Mitochondrion x={830} y={200} rotate={40} scale={0.75} onSelect={(e) => handleSelect("mitochondria", e)} highlighted={isSelected("mitochondria")} />
                </>
              )}
              {showLabels && (
                <text x={isAnimal ? 250 : 242} y={isAnimal ? 162 : 355} textAnchor={isAnimal ? "middle" : "start"} className="font-mono text-[10px] font-bold fill-amber-900 pointer-events-none">
                  Mitochondrion
                </text>
              )}
            </g>

            {/* ================= CHLOROPLASTS ================= */}
            {!isAnimal && (
              <g opacity={getOpacity("chloroplast")}>
                <Chloroplast x={790} y={150} rotate={18} scale={0.95} onSelect={(e) => handleSelect("chloroplast", e)} highlighted={isSelected("chloroplast")} />
                <Chloroplast x={835} y={420} rotate={-14} scale={0.85} onSelect={(e) => handleSelect("chloroplast", e)} highlighted={isSelected("chloroplast")} />
                <Chloroplast x={150} y={545} rotate={12} scale={0.7} onSelect={(e) => handleSelect("chloroplast", e)} highlighted={isSelected("chloroplast")} />
                <Chloroplast x={790} y={530} rotate={-20} scale={0.7} onSelect={(e) => handleSelect("chloroplast", e)} highlighted={isSelected("chloroplast")} />
                {showLabels && (
                  <text x="790" y="108" textAnchor="middle" className="font-mono text-[10px] font-bold fill-emerald-900 pointer-events-none">
                    Chloroplast
                  </text>
                )}
              </g>
            )}

            {/* ================= ANIMAL LYSOSOMES & CENTROSOME ================= */}
            {isAnimal && (
              <g opacity={getOpacity("lysosomes")}>
                <g className="cursor-pointer" onClick={(e) => handleSelect("lysosomes", e)}>
                  <circle cx="700" cy="510" r="20" fill="#10b981" stroke="#065f46" strokeWidth="2.5" filter={isSelected("lysosomes") ? `url(#${glowId})` : undefined} />
                  <circle cx="693" cy="503" r="5" fill="#6ee7b7" opacity="0.9" />
                  <circle cx="708" cy="516" r="3" fill="#a7f3d0" opacity="0.7" />
                  <circle cx="810" cy="300" r="17" fill="#10b981" stroke="#065f46" strokeWidth="2.5" />
                  <circle cx="805" cy="295" r="4" fill="#6ee7b7" opacity="0.9" />
                  {showLabels && (
                    <text x="700" y="544" textAnchor="middle" className="font-mono text-[10px] font-bold fill-emerald-800 pointer-events-none">
                      Lysosome
                    </text>
                  )}
                </g>
                <g
                  transform="translate(605, 285)"
                  className="cursor-pointer"
                  onClick={(e) => handleSelect("centrosome", e)}
                  filter={isSelected("centrosome") ? `url(#${glowId})` : undefined}
                >
                  <circle cx="0" cy="0" r="30" fill="rgba(192,132,252,0.18)" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 3" />
                  <rect x="-13" y="-11" width="8" height="22" rx="2" fill="#7e22ce" />
                  <rect x="-6" y="-4" width="22" height="8" rx="2" fill="#7e22ce" />
                  {showLabels && (
                    <text x="0" y="46" textAnchor="middle" className="font-mono text-[10px] font-bold fill-purple-900 pointer-events-none">
                      Centrosome
                    </text>
                  )}
                </g>
              </g>
            )}

            {/* ================= FREE RIBOSOMES ================= */}
            <g opacity={getOpacity("ribosomes")}>
              {[
                { x: 300, y: 250 },
                { x: 322, y: 268 },
                { x: 560, y: 170 },
                { x: 600, y: 470 },
                { x: 230, y: 480 },
                { x: 760, y: 470 },
                { x: 500, y: 520 },
                { x: 560, y: 250 },
                { x: 440, y: 460 },
                { x: 680, y: 260 },
                { x: 360, y: 150 },
                { x: 840, y: 250 },
              ].map((rb, i) => (
                <circle
                  key={i}
                  cx={rb.x}
                  cy={rb.y}
                  r="3.6"
                  fill="#1e293b"
                  className="cursor-pointer hover:fill-blue-600 transition-colors"
                  onClick={(e) => handleSelect("ribosomes", e)}
                />
              ))}
            </g>

            {/* ================= RELATIONSHIP VECTORS ================= */}
            {showRelationships && selectedOrganelle && (
              <g id="relationship-vectors-layer">
                {selectedOrganelle.relationships.map((rel, i) => (
                  <line
                    key={`rel-${i}`}
                    x1={nucleusPos.x}
                    y1={nucleusPos.y}
                    x2={isAnimal ? 700 : 500}
                    y2={isAnimal ? 390 : 330}
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                    markerEnd="url(#relation-arrow)"
                    opacity="0.7"
                  />
                ))}
              </g>
            )}
          </g>
        ) : (
          <g id="focus-zoom-layer" className="animate-in fade-in zoom-in-95 duration-200">
            <rect x="120" y="50" width="760" height="540" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <g transform="translate(160, 95)">
              <text x="0" y="0" className="font-display text-2xl font-bold fill-slate-900">
                {selectedOrganelle?.name} — Ultrastructure Focus
              </text>
              <text x="0" y="22" className="font-mono text-xs fill-slate-500">
                {selectedOrganelle?.structure}
              </text>
            </g>

            {selectedOrganelle?.id === "mitochondria" && (
              <g transform="translate(500, 340)">
                <ellipse cx="0" cy="0" rx="270" ry="145" fill="#f97316" stroke="#9a3412" strokeWidth="5" />
                <ellipse cx="0" cy="0" rx="250" ry="125" fill="#fb923c" stroke="#c2410c" strokeWidth="3" />
                <path d="M -220 0 C -190 -95, -145 -95, -115 0 C -85 95, -40 95, -10 0 C 20 -95, 65 -95, 95 0 C 125 95, 170 95, 200 0" fill="none" stroke="#7c2d12" strokeWidth="13" strokeLinecap="round" />
                <circle cx="-115" cy="-62" r="8" fill="#fbbf24" />
                <circle cx="-10" cy="62" r="8" fill="#fbbf24" />
                <circle cx="95" cy="-62" r="8" fill="#fbbf24" />
                <text x="0" y="170" textAnchor="middle" className="font-mono text-xs font-bold fill-amber-950">
                  Outer Membrane · Intermembrane Space · Cristae (Oxidative Phosphorylation) · Matrix
                </text>
              </g>
            )}

            {selectedOrganelle?.id === "chloroplast" && (
              <g transform="translate(500, 340)">
                <ellipse cx="0" cy="0" rx="280" ry="145" fill="#16a34a" stroke="#14532d" strokeWidth="5" />
                <ellipse cx="0" cy="0" rx="258" ry="125" fill="#15803d" />
                {[-175, -60, 55, 170].map((gx, i) => (
                  <g key={i} transform={`translate(${gx}, 0)`}>
                    {[-60, -35, -10, 15, 40, 65].map((gy, j) => (
                      <rect key={j} x="-38" y={gy} width="76" height="15" rx="4" fill="#86efac" stroke="#166534" strokeWidth="2" />
                    ))}
                    <line x1="38" y1="0" x2="80" y2="0" stroke="#86efac" strokeWidth="5" />
                  </g>
                ))}
                <text x="0" y="172" textAnchor="middle" className="font-mono text-xs font-bold fill-emerald-950">
                  Double Envelope · Stroma (Calvin Cycle / RuBisCO) · Thylakoid Grana
                </text>
              </g>
            )}

            {selectedOrganelle?.id === "nucleus" && (
              <g transform="translate(500, 330)">
                <circle cx="0" cy="0" r="165" fill="url(#nucGrad)" stroke="#2563eb" strokeWidth="6" />
                <circle cx="0" cy="0" r="152" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="12 8" />
                <circle cx="50" cy="-38" r="58" fill="#1e3a8a" />
                <text x="50" y="-32" textAnchor="middle" className="font-mono text-xs font-bold fill-white">
                  Nucleolus
                </text>
                <path d="M -95 -42 Q -42 -115, 22 -72 Q 115 -22, 84 72 Q -22 125, -105 42 Z" fill="none" stroke="#3b82f6" strokeWidth="3" />
                <text x="0" y="205" textAnchor="middle" className="font-mono text-xs font-bold fill-blue-950">
                  Nuclear Envelope · Nuclear Pores · Chromatin · Nucleoplasm
                </text>
              </g>
            )}

            {selectedOrganelle?.id !== "mitochondria" && selectedOrganelle?.id !== "chloroplast" && selectedOrganelle?.id !== "nucleus" && (
              <g transform="translate(500, 330)">
                <circle cx="0" cy="0" r="135" fill="rgba(241, 245, 249, 0.85)" stroke="#475569" strokeWidth="3" />
                <text x="0" y="-30" textAnchor="middle" className="font-display text-xl font-bold fill-slate-800">
                  {selectedOrganelle?.name}
                </text>
                <text x="0" y="10" textAnchor="middle" className="font-mono text-xs fill-slate-600">
                  {selectedOrganelle?.function}
                </text>
                <text x="0" y="165" textAnchor="middle" className="font-mono text-xs font-bold fill-blue-700">
                  Found in: {selectedOrganelle?.foundIn === "both" ? "Animal & Plant Eukaryotes" : selectedOrganelle?.foundIn === "plant-only" ? "Plant Cells Only" : "Animal Cells Only"}
                </text>
              </g>
            )}

            <g transform="translate(730, 80)" className="cursor-pointer" onClick={onToggleFocus}>
              <rect x="0" y="0" width="120" height="30" rx="4" fill="#0f172a" />
              <text x="60" y="19" textAnchor="middle" className="font-mono text-xs font-bold fill-white">
                ✕ Return to Cell
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
