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

  // Helper to test if an organelle is currently selected
  const isSelected = (id: string) => activeId === id;

  // Helper to test if an organelle is in an active relationship with the selected organelle
  const isRelated = (id: string) => {
    if (!selectedOrganelle || !showRelationships) return false;
    return selectedOrganelle.relationships.some((r) => r.targetId === id);
  };

  const getOpacity = (id: string) => {
    if (!activeId) return 1;
    if (isSelected(id) || isRelated(id)) return 1;
    return 0.25;
  };

  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const organelle = ORGANELLES[id];
    if (organelle) {
      onSelectOrganelle(organelle);
    }
  };

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
          {/* Subtle Primary Selection Glow */}
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Directional Relationship Arrow Marker */}
          <marker
            id="relation-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
          </marker>
        </defs>

        {/* ───────────────────────────────────────────────────────── */}
        {/* VIEW 1: NORMAL WHOLE-CELL VIEW (ANIMAL OR PLANT) */}
        {/* ───────────────────────────────────────────────────────── */}
        {!isFocused ? (
          <g id="whole-cell-layer">
            {/* 1. PLANT-SPECIFIC CELL WALL & PLASMODESMATA */}
            {!isAnimal && (
              <g
                id="cell-wall-group"
                opacity={getOpacity("cell-wall")}
                className="cursor-pointer transition-opacity duration-200"
                onClick={(e) => handleSelect("cell-wall", e)}
              >
                {/* Thick Outer Rigid Cellulose Cell Wall */}
                <polygon
                  points="90,70 910,70 950,560 60,560"
                  fill="none"
                  stroke={showBoundaries ? "#16a34a" : "#059669"}
                  strokeWidth="18"
                  strokeLinejoin="round"
                  filter={isSelected("cell-wall") ? `url(#${glowId})` : undefined}
                />
                {/* Middle Lamella line */}
                <polygon
                  points="84,64 916,64 956,566 54,566"
                  fill="none"
                  stroke="#a7f3d0"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Plasmodesmata Pores across wall */}
                <g id="plasmodesmata-group" onClick={(e) => handleSelect("plasmodesmata", e)}>
                  <line x1="300" y1="61" x2="300" y2="79" stroke="#f8fafc" strokeWidth="4" />
                  <line x1="700" y1="61" x2="700" y2="79" stroke="#f8fafc" strokeWidth="4" />
                  <line x1="935" y1="300" x2="953" y2="300" stroke="#f8fafc" strokeWidth="4" />
                  <line x1="68" y1="320" x2="86" y2="320" stroke="#f8fafc" strokeWidth="4" />
                </g>

                {showLabels && (
                  <text x="140" y="55" className="font-mono text-[10px] font-bold fill-emerald-800">
                    Cell Wall (Cellulose)
                  </text>
                )}
              </g>
            )}

            {/* 2. PLASMA MEMBRANE & CYTOPLASM MATRIX */}
            <g id="plasma-membrane-group">
              {isAnimal ? (
                // Animal Cell: Flexible organic rounded contour
                <path
                  d="M 140 120 C 350 70, 750 80, 890 160 C 970 240, 960 440, 870 540 C 740 600, 320 610, 150 530 C 60 440, 60 210, 140 120 Z"
                  fill="rgba(241, 245, 249, 0.75)"
                  stroke={showBoundaries ? "#2563eb" : "#475569"}
                  strokeWidth={isSelected("plasma-membrane") ? "5" : "3.5"}
                  className="cursor-pointer transition-all"
                  filter={isSelected("plasma-membrane") ? `url(#${glowId})` : undefined}
                  onClick={(e) => handleSelect("plasma-membrane", e)}
                />
              ) : (
                // Plant Cell: Inner boundary enclosed by wall
                <polygon
                  points="100,80 900,80 938,550 72,550"
                  fill="rgba(236, 253, 245, 0.6)"
                  stroke={showBoundaries ? "#2563eb" : "#0284c7"}
                  strokeWidth={isSelected("plasma-membrane") ? "4.5" : "3"}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-all"
                  filter={isSelected("plasma-membrane") ? `url(#${glowId})` : undefined}
                  onClick={(e) => handleSelect("plasma-membrane", e)}
                />
              )}

              {showLabels && (
                <text
                  x={isAnimal ? "130" : "120"}
                  y={isAnimal ? "105" : "96"}
                  className="font-mono text-[10px] font-bold fill-slate-700 pointer-events-none"
                >
                  Plasma Membrane
                </text>
              )}
            </g>

            {/* 3. PLANT-SPECIFIC LARGE CENTRAL VACUOLE */}
            {!isAnimal && (
              <g
                id="central-vacuole-group"
                opacity={getOpacity("central-vacuole")}
                className="cursor-pointer transition-opacity duration-200"
                onClick={(e) => handleSelect("central-vacuole", e)}
              >
                {/* Massive internal tonoplast sac */}
                <path
                  d="M 320 160 C 580 140, 780 170, 810 320 C 830 430, 740 500, 520 510 C 340 515, 260 440, 260 330 C 260 210, 270 170, 320 160 Z"
                  fill="rgba(186, 230, 253, 0.45)"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  filter={isSelected("central-vacuole") ? `url(#${glowId})` : undefined}
                />
                {/* Internal turgor water pattern */}
                <circle cx="530" cy="330" r="45" fill="rgba(147, 197, 253, 0.3)" />
                <circle cx="640" cy="270" r="30" fill="rgba(147, 197, 253, 0.25)" />

                <text x="540" y="335" textAnchor="middle" className="font-display text-sm font-semibold fill-sky-900 pointer-events-none">
                  Central Vacuole (Cell Sap)
                </text>
                <text x="540" y="352" textAnchor="middle" className="font-mono text-[9px] fill-sky-800 pointer-events-none">
                  Tonoplast Membrane · Turgor Pressure
                </text>
              </g>
            )}

            {/* 4. NUCLEUS, NUCLEOLUS & NUCLEAR ENVELOPE */}
            <g
              id="nucleus-group"
              transform={isAnimal ? "translate(380, 330)" : "translate(220, 240)"}
              opacity={getOpacity("nucleus")}
              className="cursor-pointer transition-all duration-200"
              onClick={(e) => handleSelect("nucleus", e)}
            >
              {/* Outer Nuclear Envelope */}
              <circle
                cx="0"
                cy="0"
                r="72"
                fill="rgba(219, 234, 254, 0.7)"
                stroke="#2563eb"
                strokeWidth="3"
                filter={isSelected("nucleus") ? `url(#${glowId})` : undefined}
              />
              {/* Inner envelope line */}
              <circle cx="0" cy="0" r="66" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Chromatin Fiber Squiggles */}
              <path
                d="M -40 -20 Q -10 -40, 20 -15 Q 40 10, 10 35 Q -30 40, -45 10 Z"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M -25 20 Q 5 10, 35 25"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.2"
                opacity="0.5"
              />

              {/* Nucleolus */}
              <circle
                cx="16"
                cy="-12"
                r="22"
                fill="#1d4ed8"
                className="cursor-pointer hover:fill-blue-800 transition-colors"
                filter={isSelected("nucleolus") ? `url(#${glowId})` : undefined}
                onClick={(e) => handleSelect("nucleolus", e)}
              />

              {showLabels && (
                <>
                  <text x="0" y="-80" textAnchor="middle" className="font-display text-xs font-bold fill-blue-900 pointer-events-none">
                    Nucleus
                  </text>
                  <text x="16" y="-10" textAnchor="middle" className="font-mono text-[8px] font-bold fill-white pointer-events-none">
                    rRNA
                  </text>
                </>
              )}
            </g>

            {/* 5. ROUGH & SMOOTH ENDOPLASMIC RETICULUM */}
            <g
              id="er-group"
              transform={isAnimal ? "translate(380, 330)" : "translate(220, 240)"}
            >
              {/* Rough ER Cisternae (Wrapping nucleus) */}
              <g
                id="rough-er-subgroup"
                opacity={getOpacity("rough-er")}
                className="cursor-pointer"
                onClick={(e) => handleSelect("rough-er", e)}
              >
                <path
                  d="M -85 -30 C -110 -60, -90 -105, -30 -115 C 30 -125, 95 -100, 110 -55"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="5"
                  strokeLinecap="round"
                  filter={isSelected("rough-er") ? `url(#${glowId})` : undefined}
                />
                <path
                  d="M -98 -20 C -125 -55, -105 -120, -25 -132 C 45 -142, 115 -110, 128 -45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Ribosome Studs along Rough ER */}
                {[-100, -85, -60, -30, 0, 30, 60, 90, 110].map((rx, idx) => (
                  <circle
                    key={`rer-ribo-${idx}`}
                    cx={rx}
                    cy={-120 + Math.abs(rx) * 0.45}
                    r="2.5"
                    fill="#1e293b"
                  />
                ))}

                {showLabels && (
                  <text x="-120" y="-120" className="font-mono text-[9px] font-semibold fill-blue-800">
                    Rough ER (Ribosomes)
                  </text>
                )}
              </g>

              {/* Smooth ER (Tubular network extending further out) */}
              <g
                id="smooth-er-subgroup"
                opacity={getOpacity("smooth-er")}
                className="cursor-pointer"
                onClick={(e) => handleSelect("smooth-er", e)}
              >
                <path
                  d="M -115 15 C -150 25, -165 70, -130 95 C -95 120, -110 150, -145 160"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  filter={isSelected("smooth-er") ? `url(#${glowId})` : undefined}
                />
                <path
                  d="M -135 45 C -170 65, -155 115, -120 125"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {showLabels && (
                  <text x="-170" y="100" className="font-mono text-[9px] font-semibold fill-blue-600">
                    Smooth ER (Lipids)
                  </text>
                )}
              </g>
            </g>

            {/* 6. GOLGI APPARATUS & TRANSPORT VESICLES */}
            <g
              id="golgi-group"
              transform={isAnimal ? "translate(660, 360)" : "translate(180, 430)"}
              opacity={getOpacity("golgi-apparatus")}
              className="cursor-pointer transition-all duration-200"
              onClick={(e) => handleSelect("golgi-apparatus", e)}
            >
              {/* Polarized Cisternae Stacks */}
              {[-16, -8, 0, 8, 16].map((gy, idx) => (
                <path
                  key={`golgi-cis-${idx}`}
                  d={`M -38 ${gy - 6} C -15 ${gy + 8}, 15 ${gy + 8}, 38 ${gy - 6}`}
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  filter={isSelected("golgi-apparatus") ? `url(#${glowId})` : undefined}
                />
              ))}

              {/* Budding Secretory Vesicles */}
              <circle cx="-42" cy="-18" r="4.5" fill="#a855f7" />
              <circle cx="44" cy="22" r="5" fill="#a855f7" />
              <circle cx="28" cy="30" r="4" fill="#a855f7" />
              <circle cx="-30" cy="25" r="4.5" fill="#a855f7" />

              {showLabels && (
                <text x="0" y="48" textAnchor="middle" className="font-mono text-[9px] font-bold fill-purple-900 pointer-events-none">
                  Golgi Apparatus
                </text>
              )}
            </g>

            {/* 7. MITOCHONDRIA (Double membrane with cristae) */}
            <g id="mitochondria-group">
              {/* Mitochondrion 1 */}
              <g
                transform={isAnimal ? "translate(220, 200) rotate(-25)" : "translate(180, 140) rotate(-15)"}
                opacity={getOpacity("mitochondria")}
                className="cursor-pointer"
                onClick={(e) => handleSelect("mitochondria", e)}
                filter={isSelected("mitochondria") ? `url(#${glowId})` : undefined}
              >
                {/* Outer membrane */}
                <rect x="-35" y="-18" width="70" height="36" rx="18" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
                {/* Inner cristae folds */}
                <path
                  d="M -22 -12 L -22 12 M -10 -12 L -10 12 M 2 -12 L 2 12 M 14 -12 L 14 12"
                  stroke="#fed7aa"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {showLabels && (
                  <text x="0" y="-24" textAnchor="middle" className="font-mono text-[9px] font-bold fill-amber-900">
                    Mitochondrion (ATP)
                  </text>
                )}
              </g>

              {/* Mitochondrion 2 */}
              <g
                transform={isAnimal ? "translate(600, 200) rotate(35)" : "translate(860, 440) rotate(45)"}
                opacity={getOpacity("mitochondria")}
                className="cursor-pointer"
                onClick={(e) => handleSelect("mitochondria", e)}
              >
                <rect x="-30" y="-15" width="60" height="30" rx="15" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
                <path d="M -18 -10 L -18 10 M -6 -10 L -6 10 M 6 -10 L 6 10" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Mitochondrion 3 (in animal cell) */}
              {isAnimal && (
                <g
                  transform="translate(320, 500) rotate(-10)"
                  opacity={getOpacity("mitochondria")}
                  className="cursor-pointer"
                  onClick={(e) => handleSelect("mitochondria", e)}
                >
                  <rect x="-32" y="-16" width="64" height="32" rx="16" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
                  <path d="M -18 -10 L -18 10 M -6 -10 L -6 10 M 6 -10 L 6 10" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}
            </g>

            {/* 8. PLANT-SPECIFIC CHLOROPLASTS (Photosynthesis) */}
            {!isAnimal && (
              <g id="chloroplasts-group">
                {/* Chloroplast 1 (Top right) */}
                <g
                  transform="translate(760, 140) rotate(20)"
                  opacity={getOpacity("chloroplast")}
                  className="cursor-pointer"
                  onClick={(e) => handleSelect("chloroplast", e)}
                  filter={isSelected("chloroplast") ? `url(#${glowId})` : undefined}
                >
                  {/* Outer & Inner Envelopes */}
                  <rect x="-42" y="-22" width="84" height="44" rx="22" fill="#15803d" stroke="#14532d" strokeWidth="2" />
                  {/* Thylakoid Granum Stacks */}
                  {[-24, -8, 8, 24].map((tx, idx) => (
                    <g key={`chl1-granum-${idx}`} transform={`translate(${tx}, 0)`}>
                      <rect x="-4" y="-12" width="8" height="4" rx="1" fill="#86efac" />
                      <rect x="-4" y="-6" width="8" height="4" rx="1" fill="#86efac" />
                      <rect x="-4" y="0" width="8" height="4" rx="1" fill="#86efac" />
                      <rect x="-4" y="6" width="8" height="4" rx="1" fill="#86efac" />
                    </g>
                  ))}
                  {showLabels && (
                    <text x="0" y="-28" textAnchor="middle" className="font-mono text-[9px] font-bold fill-emerald-900">
                      Chloroplast (Grana/Stroma)
                    </text>
                  )}
                </g>

                {/* Chloroplast 2 (Bottom right) */}
                <g
                  transform="translate(820, 360) rotate(-15)"
                  opacity={getOpacity("chloroplast")}
                  className="cursor-pointer"
                  onClick={(e) => handleSelect("chloroplast", e)}
                >
                  <rect x="-38" y="-20" width="76" height="40" rx="20" fill="#15803d" stroke="#14532d" strokeWidth="2" />
                  {[-20, -6, 8, 20].map((tx, idx) => (
                    <g key={`chl2-granum-${idx}`} transform={`translate(${tx}, 0)`}>
                      <rect x="-3.5" y="-10" width="7" height="3.5" rx="1" fill="#86efac" />
                      <rect x="-3.5" y="-4" width="7" height="3.5" rx="1" fill="#86efac" />
                      <rect x="-3.5" y="2" width="7" height="3.5" rx="1" fill="#86efac" />
                      <rect x="-3.5" y="8" width="7" height="3.5" rx="1" fill="#86efac" />
                    </g>
                  ))}
                </g>

                {/* Chloroplast 3 (Bottom left) */}
                <g
                  transform="translate(160, 500) rotate(15)"
                  opacity={getOpacity("chloroplast")}
                  className="cursor-pointer"
                  onClick={(e) => handleSelect("chloroplast", e)}
                >
                  <rect x="-36" y="-18" width="72" height="36" rx="18" fill="#15803d" stroke="#14532d" strokeWidth="2" />
                  {[-18, -4, 10].map((tx, idx) => (
                    <g key={`chl3-granum-${idx}`} transform={`translate(${tx}, 0)`}>
                      <rect x="-3.5" y="-8" width="7" height="3.5" rx="1" fill="#86efac" />
                      <rect x="-3.5" y="-2" width="7" height="3.5" rx="1" fill="#86efac" />
                      <rect x="-3.5" y="4" width="7" height="3.5" rx="1" fill="#86efac" />
                    </g>
                  ))}
                </g>
              </g>
            )}

            {/* 9. ANIMAL-SPECIFIC LYSOSOMES & CENTROSOME */}
            {isAnimal && (
              <g id="animal-specific-group">
                {/* Lysosomes (Acid Hydrolase Vesicles) */}
                <g
                  id="lysosome-subgroup"
                  opacity={getOpacity("lysosomes")}
                  className="cursor-pointer"
                  onClick={(e) => handleSelect("lysosomes", e)}
                >
                  <circle cx="230" cy="380" r="14" fill="#059669" stroke="#065f46" strokeWidth="2" filter={isSelected("lysosomes") ? `url(#${glowId})` : undefined} />
                  <circle cx="225" cy="375" r="3" fill="#6ee7b7" />
                  <circle cx="760" cy="260" r="12" fill="#059669" stroke="#065f46" strokeWidth="2" />
                  <circle cx="756" cy="257" r="2.5" fill="#6ee7b7" />
                  {showLabels && (
                    <text x="230" y="406" textAnchor="middle" className="font-mono text-[9px] font-bold fill-emerald-800">
                      Lysosome (pH 4.8)
                    </text>
                  )}
                </g>

                {/* Centrosome & Centriole Pair */}
                <g
                  id="centrosome-subgroup"
                  transform="translate(490, 240)"
                  opacity={getOpacity("centrosome")}
                  className="cursor-pointer"
                  onClick={(e) => handleSelect("centrosome", e)}
                  filter={isSelected("centrosome") ? `url(#${glowId})` : undefined}
                >
                  {/* Pericentriolar Material Cloud */}
                  <circle cx="0" cy="0" r="24" fill="rgba(192, 132, 252, 0.2)" stroke="#c084fc" strokeWidth="1" strokeDasharray="2 2" />
                  {/* Mother Centriole (Vertical barrel) */}
                  <rect x="-10" y="-8" width="6" height="16" rx="1" fill="#7e22ce" />
                  {/* Daughter Centriole (Perpendicular horizontal barrel) */}
                  <rect x="-4" y="-2" width="16" height="6" rx="1" fill="#7e22ce" />
                  {showLabels && (
                    <text x="0" y="-30" textAnchor="middle" className="font-mono text-[9px] font-bold fill-purple-900">
                      Centrosome (Centrioles)
                    </text>
                  )}
                </g>
              </g>
            )}

            {/* 10. CYTOSKELETON & CYTOSOLIC RIBOSOMES */}
            <g id="cytoskeleton-ribosomes-group" opacity={getOpacity("ribosomes")}>
              {/* Free Ribosome Clusters */}
              {[
                { x: 280, y: 160 },
                { x: 300, y: 175 },
                { x: 520, y: 160 },
                { x: 620, y: 480 },
                { x: 220, y: 460 },
                { x: 740, y: 420 },
                { x: 480, y: 480 },
              ].map((rb, idx) => (
                <circle
                  key={`free-ribo-${idx}`}
                  cx={rb.x}
                  cy={rb.y}
                  r="3"
                  fill="#1e293b"
                  className="cursor-pointer hover:scale-150 transition-transform"
                  onClick={(e) => handleSelect("ribosomes", e)}
                />
              ))}
            </g>

            {/* 11. RELATIONSHIP FLOW VECTORS */}
            {showRelationships && selectedOrganelle && (
              <g id="relationship-vectors-layer">
                {selectedOrganelle.relationships.map((rel, idx) => {
                  return (
                    <g key={`rel-${idx}`} className="animate-in fade-in duration-300">
                      <line
                        x1="380"
                        y1="330"
                        x2="660"
                        y2="360"
                        stroke="#2563eb"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        markerEnd="url(#relation-arrow)"
                      />
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        ) : (
          /* ───────────────────────────────────────────────────────── */
          /* VIEW 2: ULTRASTRUCTURE FOCUS / ZOOM VIEW */
          /* ───────────────────────────────────────────────────────── */
          <g id="focus-zoom-layer" className="animate-in fade-in zoom-in-95 duration-200">
            {/* Background Focus Card */}
            <rect x="120" y="50" width="760" height="540" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />

            {/* Title Header */}
            <g transform="translate(160, 95)">
              <text x="0" y="0" className="font-display text-2xl font-bold fill-slate-900">
                {selectedOrganelle?.name} — Ultrastructure Focus
              </text>
              <text x="0" y="22" className="font-mono text-xs fill-slate-500">
                {selectedOrganelle?.structure}
              </text>
            </g>

            {/* Specific High-Resolution Diagram according to Organelle */}
            {selectedOrganelle?.id === "mitochondria" && (
              <g transform="translate(500, 340)">
                <ellipse cx="0" cy="0" rx="260" ry="140" fill="#ea580c" stroke="#9a3412" strokeWidth="4" />
                {/* Inner membrane cristae folds */}
                <path
                  d="M -210 0 C -180 -90, -140 -90, -110 0 C -80 90, -40 90, -10 0 C 20 -90, 60 -90, 90 0 C 120 90, 160 90, 190 0 C 220 -80, 240 -30, 210 0"
                  fill="none"
                  stroke="#fed7aa"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* ATP Synthase knobs */}
                <circle cx="-110" cy="-60" r="7" fill="#fbbf24" />
                <circle cx="-10" cy="60" r="7" fill="#fbbf24" />
                <circle cx="90" cy="-60" r="7" fill="#fbbf24" />
                <text x="0" y="160" textAnchor="middle" className="font-mono text-xs font-bold fill-amber-950">
                  Outer Membrane · Intermembrane Space · Cristae (Oxidative Phosphorylation) · Matrix (mtDNA & Krebs Cycle)
                </text>
              </g>
            )}

            {selectedOrganelle?.id === "chloroplast" && (
              <g transform="translate(500, 340)">
                <ellipse cx="0" cy="0" rx="270" ry="140" fill="#15803d" stroke="#14532d" strokeWidth="4" />
                {/* 4 Thylakoid Grana Stacks */}
                {[-160, -50, 60, 170].map((gx, idx) => (
                  <g key={`focus-granum-${idx}`} transform={`translate(${gx}, 0)`}>
                    {[-60, -35, -10, 15, 40, 65].map((gy, tIdx) => (
                      <rect key={`focus-thyla-${tIdx}`} x="-35" y={gy} width="70" height="14" rx="4" fill="#86efac" stroke="#16a34a" strokeWidth="2" />
                    ))}
                    {/* Stroma Thylakoid Bridge */}
                    <line x1="35" y1="0" x2="75" y2="0" stroke="#86efac" strokeWidth="4" />
                  </g>
                ))}
                <text x="0" y="165" textAnchor="middle" className="font-mono text-xs font-bold fill-emerald-950">
                  Double Envelope · Stroma (Calvin Cycle / RuBisCO) · Thylakoid Grana (Light Reactions & Chlorophyll)
                </text>
              </g>
            )}

            {selectedOrganelle?.id === "nucleus" && (
              <g transform="translate(500, 330)">
                {/* Nuclear Envelope & Pores */}
                <circle cx="0" cy="0" r="160" fill="rgba(219, 234, 254, 0.7)" stroke="#2563eb" strokeWidth="6" />
                <circle cx="0" cy="0" r="148" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="12 8" />

                {/* Nucleolus */}
                <circle cx="45" cy="-35" r="55" fill="#1d4ed8" />
                <text x="45" y="-30" textAnchor="middle" className="font-mono text-xs font-bold fill-white">
                  Nucleolus (rRNA Assembly)
                </text>

                {/* Chromatin network */}
                <path d="M -90 -40 Q -40 -110, 20 -70 Q 110 -20, 80 70 Q -20 120, -100 40 Z" fill="none" stroke="#3b82f6" strokeWidth="3" />
                <text x="0" y="195" textAnchor="middle" className="font-mono text-xs font-bold fill-blue-950">
                  Nuclear Envelope · Nuclear Pores (NPCs) · Euchromatin / Heterochromatin · Nucleoplasm
                </text>
              </g>
            )}

            {/* Generic Ultrastructure layout for other organelles */}
            {selectedOrganelle?.id !== "mitochondria" && selectedOrganelle?.id !== "chloroplast" && selectedOrganelle?.id !== "nucleus" && (
              <g transform="translate(500, 330)">
                <circle cx="0" cy="0" r="130" fill="rgba(241, 245, 249, 0.8)" stroke="#475569" strokeWidth="3" />
                <text x="0" y="-30" textAnchor="middle" className="font-display text-xl font-bold fill-slate-800">
                  {selectedOrganelle?.name}
                </text>
                <text x="0" y="10" textAnchor="middle" className="font-mono text-xs fill-slate-600 max-w-md">
                  {selectedOrganelle?.function}
                </text>
                <text x="0" y="160" textAnchor="middle" className="font-mono text-xs font-bold fill-blue-700">
                  Found in: {selectedOrganelle?.foundIn === "both" ? "Animal & Plant Eukaryotes" : selectedOrganelle?.foundIn === "plant-only" ? "Plant Cells Only" : "Animal Cells Only"}
                </text>
              </g>
            )}

            {/* Back Button Overlay */}
            <g
              transform="translate(730, 80)"
              className="cursor-pointer"
              onClick={onToggleFocus}
            >
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
