"use client";

import React, { useId } from "react";
import {
  AnatomicalEntity,
  CirculationMode,
  CIRCULATION_INSPECTABLES,
  CIRCULATION_STEPS,
} from "@/lib/biology/bloodCirculationModel";

interface AnatomicalHeartRendererProps {
  mode: CirculationMode;
  currentStepIndex: number;
  selectedEntity: AnatomicalEntity | null;
  onSelectEntity: (entity: AnatomicalEntity | null) => void;
  isPlaying: boolean;
  showLabels: boolean;
  showVectors: boolean;
  showOxygenation: boolean;
}

export default function AnatomicalHeartRenderer({
  mode,
  currentStepIndex,
  selectedEntity,
  onSelectEntity,
  isPlaying,
  showLabels,
  showVectors,
  showOxygenation,
}: AnatomicalHeartRendererProps) {
  const glowId = useId();
  const activeId = selectedEntity?.id || (mode === "trace" ? CIRCULATION_STEPS[currentStepIndex]?.id : null);

  const isSelected = (id: string) => activeId === id;

  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const entity = CIRCULATION_INSPECTABLES[id];
    if (entity) {
      onSelectEntity(entity);
    }
  };

  // Helper for opacity based on mode and selection
  const getStructureOpacity = (circuitType: "pulmonary" | "systemic" | "both", id?: string) => {
    if (activeId && id) {
      if (isSelected(id)) return 1;
      return 0.35;
    }
    if (mode === "pulmonary" && circuitType === "systemic") return 0.25;
    if (mode === "systemic" && circuitType === "pulmonary") return 0.25;
    return 1;
  };

  return (
    <div
      className="relative w-full h-full select-none bg-slate-50/50"
      onClick={() => onSelectEntity(null)}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1100 700"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Anatomical Human Heart and Cardiovascular Circulation Diagram"
      >
        <defs>
          {/* Subtle Selection Glow Filter */}
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Directional Flow Arrow Markers */}
          <marker
            id="flow-arrow-blue"
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
            id="flow-arrow-red"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#dc2626" />
          </marker>

          {/* Animated Flow Gradient Bars */}
          <linearGradient id="pulmonary-gas-exchange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          <linearGradient id="systemic-gas-exchange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* ───────────────────────────────────────────────────────── */}
        {/* 1. PATIENT ORIENTATION ANNOTATIONS */}
        {/* ───────────────────────────────────────────────────────── */}
        <g className="font-mono text-[9px] font-bold fill-muted uppercase tracking-widest pointer-events-none">
          <text x="70" y="35">
            ← PATIENT RIGHT (Viewer Left)
          </text>
          <text x="850" y="35">
            PATIENT LEFT (Viewer Right) →
          </text>
        </g>

        {/* ───────────────────────────────────────────────────────── */}
        {/* 2. PULMONARY CIRCUIT: LUNGS & ALVEOLAR CAPILLARIES (TOP) */}
        {/* ───────────────────────────────────────────────────────── */}
        <g
          id="lungs-circuit-group"
          opacity={getStructureOpacity("pulmonary", "lungs")}
          className="cursor-pointer transition-opacity duration-200"
          onClick={(e) => handleSelect("lungs", e)}
        >
          {/* Right Lung (Viewer Left) */}
          <g transform="translate(180, 110)">
            <path
              d="M -60 50 C -80 -10, -50 -60, 10 -60 C 60 -60, 70 0, 60 50 C 40 70, -40 70, -60 50 Z"
              fill="rgba(224, 242, 254, 0.7)"
              stroke="#0284c7"
              strokeWidth="2.5"
              filter={isSelected("lungs") ? `url(#${glowId})` : undefined}
            />
            {/* Alveolar Capillary Mesh */}
            <path d="M -35 20 Q 0 -20, 35 20 M -20 -15 Q 10 10, 20 -30 M -10 35 Q 20 0, 40 40" stroke="url(#pulmonary-gas-exchange)" strokeWidth="3" strokeDasharray="3 2" fill="none" />
            <text x="0" y="0" textAnchor="middle" className="font-display text-xs font-bold fill-sky-950 pointer-events-none">
              Right Lung
            </text>
            <text x="0" y="15" textAnchor="middle" className="font-mono text-[8px] fill-sky-800 pointer-events-none">
              Alveolar Gas Exchange
            </text>
          </g>

          {/* Left Lung (Viewer Right) */}
          <g transform="translate(920, 110)">
            <path
              d="M -60 50 C -70 0, -60 -60, -10 -60 C 50 -60, 80 -10, 60 50 C 40 70, -40 70, -60 50 Z"
              fill="rgba(224, 242, 254, 0.7)"
              stroke="#0284c7"
              strokeWidth="2.5"
              filter={isSelected("lungs") ? `url(#${glowId})` : undefined}
            />
            <path d="M -35 20 Q 0 -20, 35 20 M -20 -30 Q -10 10, 20 -15 M -40 40 Q -20 0, 10 35" stroke="url(#pulmonary-gas-exchange)" strokeWidth="3" strokeDasharray="3 2" fill="none" />
            <text x="0" y="0" textAnchor="middle" className="font-display text-xs font-bold fill-sky-950 pointer-events-none">
              Left Lung
            </text>
            <text x="0" y="15" textAnchor="middle" className="font-mono text-[8px] fill-sky-800 pointer-events-none">
              O₂ Absorption · CO₂ Exhalation
            </text>
          </g>

          {showOxygenation && (
            <text x="550" y="55" textAnchor="middle" className="font-mono text-[9px] font-bold fill-indigo-700 pointer-events-none">
              Pulmonary Capillary Transition: sO₂ rises 75% → 98%
            </text>
          )}
        </g>

        {/* ───────────────────────────────────────────────────────── */}
        {/* 3. SYSTEMIC CIRCUIT: BODY & PERIPHERAL CAPILLARIES (BOTTOM) */}
        {/* ───────────────────────────────────────────────────────── */}
        <g
          id="body-circuit-group"
          opacity={getStructureOpacity("systemic", "body-tissues")}
          className="cursor-pointer transition-opacity duration-200"
          onClick={(e) => handleSelect("body-tissues", e)}
        >
          {/* Systemic Capillary Bed Container */}
          <g transform="translate(550, 630)">
            <rect
              x="-260"
              y="-35"
              width="520"
              height="70"
              rx="10"
              fill="rgba(241, 245, 249, 0.85)"
              stroke="#64748b"
              strokeWidth="2"
              filter={isSelected("body-tissues") ? `url(#${glowId})` : undefined}
            />

            {/* Systemic Capillary Network lines */}
            <path
              d="M -220 0 Q -110 -20, 0 0 Q 110 20, 220 0 M -180 15 Q -60 20, 60 -15 Q 160 0, 200 15"
              stroke="url(#systemic-gas-exchange)"
              strokeWidth="3.5"
              strokeDasharray="4 2"
              fill="none"
            />

            <text x="0" y="-8" textAnchor="middle" className="font-display text-xs font-bold fill-slate-900 pointer-events-none">
              Systemic Capillary Beds (Brain, Viscera, Skeletal Muscle & Organs)
            </text>
            <text x="0" y="12" textAnchor="middle" className="font-mono text-[9px] fill-slate-600 pointer-events-none">
              O₂ & Nutrient Unloading · CO₂ Collection · sO₂ drops 98% → 75%
            </text>
          </g>
        </g>

        {/* ───────────────────────────────────────────────────────── */}
        {/* 4. GREAT VESSELS CONNECTING LOOPS */}
        {/* ───────────────────────────────────────────────────────── */}
        <g id="great-vessels-layer">
          {/* Superior Vena Cava (Top Blue Pipe to RA) */}
          <g
            id="svc-group"
            opacity={getStructureOpacity("systemic", "vena-cava")}
            className="cursor-pointer"
            onClick={(e) => handleSelect("vena-cava", e)}
          >
            <path
              d="M 370 120 L 370 260"
              fill="none"
              stroke="#2563eb"
              strokeWidth="24"
              strokeLinecap="round"
              filter={isSelected("vena-cava") ? `url(#${glowId})` : undefined}
            />
            <path
              d="M 370 120 L 370 260"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="3"
              strokeDasharray={isPlaying ? "6 6" : "none"}
              className={isPlaying ? "animate-pulse" : ""}
            />
            {showLabels && (
              <text x="310" y="150" textAnchor="middle" className="font-mono text-[9px] font-bold fill-blue-900">
                Superior Vena Cava
              </text>
            )}
          </g>

          {/* Inferior Vena Cava (Bottom Blue Pipe to RA) */}
          <g
            id="ivc-group"
            opacity={getStructureOpacity("systemic", "vena-cava")}
            className="cursor-pointer"
            onClick={(e) => handleSelect("vena-cava", e)}
          >
            <path
              d="M 350 460 L 350 595"
              fill="none"
              stroke="#2563eb"
              strokeWidth="22"
              strokeLinecap="round"
              filter={isSelected("vena-cava") ? `url(#${glowId})` : undefined}
            />
            <path
              d="M 350 595 L 350 460"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="3"
              strokeDasharray={isPlaying ? "6 6" : "none"}
              markerEnd={showVectors ? "url(#flow-arrow-blue)" : undefined}
            />
            {showLabels && (
              <text x="290" y="550" textAnchor="middle" className="font-mono text-[9px] font-bold fill-blue-900">
                Inferior Vena Cava
              </text>
            )}
          </g>

          {/* Pulmonary Trunk & Arteries (Blue Outflow from RV to Lungs) */}
          <g
            id="pulmonary-arteries-group"
            opacity={getStructureOpacity("pulmonary", "pulmonary-arteries")}
            className="cursor-pointer"
            onClick={(e) => handleSelect("pulmonary-arteries", e)}
          >
            {/* Trunk */}
            <path
              d="M 520 310 L 520 220 C 520 180, 480 160, 240 140"
              fill="none"
              stroke="#2563eb"
              strokeWidth="18"
              strokeLinecap="round"
              filter={isSelected("pulmonary-arteries") ? `url(#${glowId})` : undefined}
            />
            {/* Right Pulmonary Artery Branch (Crosses to left lung on viewer right) */}
            <path
              d="M 520 200 C 560 170, 720 150, 860 140"
              fill="none"
              stroke="#2563eb"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {showVectors && (
              <>
                <path d="M 520 260 L 260 142" stroke="#bfdbfe" strokeWidth="2.5" strokeDasharray="5 5" markerEnd="url(#flow-arrow-blue)" fill="none" />
                <path d="M 540 200 L 840 142" stroke="#bfdbfe" strokeWidth="2.5" strokeDasharray="5 5" markerEnd="url(#flow-arrow-blue)" fill="none" />
              </>
            )}
            {showLabels && (
              <text x="470" y="150" textAnchor="middle" className="font-mono text-[9px] font-bold fill-blue-900">
                Pulmonary Arteries (Deoxygenated)
              </text>
            )}
          </g>

          {/* Pulmonary Veins (Red Inflow from Lungs to LA) */}
          <g
            id="pulmonary-veins-group"
            opacity={getStructureOpacity("pulmonary", "pulmonary-veins")}
            className="cursor-pointer"
            onClick={(e) => handleSelect("pulmonary-veins", e)}
          >
            {/* From Right Lung (Viewer Left) behind heart to LA */}
            <path
              d="M 240 160 C 400 170, 580 230, 640 270"
              fill="none"
              stroke="#dc2626"
              strokeWidth="14"
              strokeLinecap="round"
              filter={isSelected("pulmonary-veins") ? `url(#${glowId})` : undefined}
            />
            {/* From Left Lung (Viewer Right) to LA */}
            <path
              d="M 860 160 C 780 180, 700 240, 670 280"
              fill="none"
              stroke="#dc2626"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {showVectors && (
              <path d="M 840 165 L 680 275" stroke="#fecaca" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#flow-arrow-red)" fill="none" />
            )}
            {showLabels && (
              <text x="790" y="195" textAnchor="middle" className="font-mono text-[9px] font-bold fill-red-900">
                Pulmonary Veins (Oxygenated)
              </text>
            )}
          </g>

          {/* Aorta & Aortic Arch (High-Pressure Red Outflow from LV to Body) */}
          <g
            id="aorta-group"
            opacity={getStructureOpacity("systemic", "aorta")}
            className="cursor-pointer"
            onClick={(e) => handleSelect("aorta", e)}
          >
            {/* Ascending Aorta & Arch */}
            <path
              d="M 590 310 C 590 200, 600 120, 540 110 C 470 100, 440 160, 440 230 L 440 450 C 440 540, 520 580, 550 595"
              fill="none"
              stroke="#dc2626"
              strokeWidth="24"
              strokeLinecap="round"
              filter={isSelected("aorta") ? `url(#${glowId})` : undefined}
            />
            {/* 3 Brachiocephalic Arterial Arch Branches (To head & arms) */}
            <line x1="560" y1="110" x2="560" y2="60" stroke="#dc2626" strokeWidth="9" strokeLinecap="round" />
            <line x1="535" y1="108" x2="525" y2="60" stroke="#dc2626" strokeWidth="9" strokeLinecap="round" />
            <line x1="505" y1="114" x2="490" y2="60" stroke="#dc2626" strokeWidth="9" strokeLinecap="round" />

            {showVectors && (
              <path d="M 440 260 L 440 560" stroke="#fecaca" strokeWidth="2.5" strokeDasharray="5 5" markerEnd="url(#flow-arrow-red)" fill="none" />
            )}
            {showLabels && (
              <text x="590" y="80" textAnchor="middle" className="font-mono text-[9px] font-bold fill-red-900">
                Aorta Arch (120/80 mmHg)
              </text>
            )}
          </g>
        </g>

        {/* ───────────────────────────────────────────────────────── */}
        {/* 5. ANATOMICAL HEART MYOCARDIUM & 4 CHAMBERS */}
        {/* ───────────────────────────────────────────────────────── */}
        <g id="anatomical-heart-body" transform="translate(550, 360)">
          {/* Thick Muscular Myocardium Silhouette (Cardiac Muscle Wall) */}
          <path
            d="M -180 -90 C -220 -20, -210 100, -110 160 C -30 210, 40 220, 90 210 C 180 190, 220 100, 210 -20 C 200 -100, 100 -130, 0 -100 C -100 -130, -150 -120, -180 -90 Z"
            fill="#7f1d1d"
            stroke="#450a0a"
            strokeWidth="6"
          />

          {/* 5.1 RIGHT ATRIUM (Viewer Left, Blue) */}
          <g
            id="ra-group"
            opacity={getStructureOpacity("both", "right-atrium")}
            className="cursor-pointer"
            onClick={(e) => handleSelect("right-atrium", e)}
          >
            <path
              d="M -160 -80 C -190 -20, -180 30, -120 45 C -70 50, -40 20, -40 -40 C -40 -80, -100 -90, -160 -80 Z"
              fill="rgba(37, 99, 235, 0.88)"
              stroke="#1d4ed8"
              strokeWidth="2.5"
              filter={isSelected("right-atrium") ? `url(#${glowId})` : undefined}
            />
            {/* Pectinate muscle striations */}
            <path d="M -160 -40 L -120 -30 M -160 0 L -110 0 M -150 25 L -100 20" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
            <text x="-110" y="-15" textAnchor="middle" className="font-display text-sm font-bold fill-white pointer-events-none">
              Right Atrium
            </text>
            <text x="-110" y="5" textAnchor="middle" className="font-mono text-[8px] fill-blue-100 font-bold pointer-events-none">
              RA (75% sO₂)
            </text>
          </g>

          {/* 5.2 RIGHT VENTRICLE (Viewer Left, Blue, Crescent) */}
          <g
            id="rv-group"
            opacity={getStructureOpacity("both", "right-ventricle")}
            className="cursor-pointer"
            onClick={(e) => handleSelect("right-ventricle", e)}
          >
            <path
              d="M -120 60 C -160 80, -140 140, -60 170 C -10 180, -10 110, -10 60 C -50 45, -90 45, -120 60 Z"
              fill="rgba(37, 99, 235, 0.95)"
              stroke="#1d4ed8"
              strokeWidth="3"
              filter={isSelected("right-ventricle") ? `url(#${glowId})` : undefined}
            />
            {/* Trabeculae Carneae ridges */}
            <path d="M -110 100 Q -80 130, -50 150 M -90 80 Q -60 100, -30 110" stroke="#60a5fa" strokeWidth="2" opacity="0.5" fill="none" />
            <text x="-75" y="110" textAnchor="middle" className="font-display text-sm font-bold fill-white pointer-events-none">
              Right Ventricle
            </text>
            <text x="-75" y="128" textAnchor="middle" className="font-mono text-[8px] fill-blue-100 font-bold pointer-events-none">
              RV (25/4 mmHg)
            </text>
          </g>

          {/* 5.3 INTERVENTRICULAR SEPTUM (Central Muscular Partition) */}
          <path
            d="M -10 -50 L -10 185 L 15 190 L 15 -50 Z"
            fill="#991b1b"
            stroke="#450a0a"
            strokeWidth="2"
          />

          {/* 5.4 LEFT ATRIUM (Viewer Right, Red) */}
          <g
            id="la-group"
            opacity={getStructureOpacity("both", "left-atrium")}
            className="cursor-pointer"
            onClick={(e) => handleSelect("left-atrium", e)}
          >
            <path
              d="M 40 -60 C 40 10, 70 45, 120 40 C 170 35, 180 -20, 150 -75 C 100 -90, 40 -90, 40 -60 Z"
              fill="rgba(220, 38, 38, 0.88)"
              stroke="#b91c1c"
              strokeWidth="2.5"
              filter={isSelected("left-atrium") ? `url(#${glowId})` : undefined}
            />
            <text x="110" y="-15" textAnchor="middle" className="font-display text-sm font-bold fill-white pointer-events-none">
              Left Atrium
            </text>
            <text x="110" y="5" textAnchor="middle" className="font-mono text-[8px] fill-red-100 font-bold pointer-events-none">
              LA (98% sO₂)
            </text>
          </g>

          {/* 5.5 LEFT VENTRICLE (Viewer Right, Thick-Walled Muscular Apex, Red) */}
          <g
            id="lv-group"
            opacity={getStructureOpacity("both", "left-ventricle")}
            className="cursor-pointer"
            onClick={(e) => handleSelect("left-ventricle", e)}
          >
            <path
              d="M 20 60 C 20 120, 20 175, 70 190 C 130 180, 165 110, 140 55 C 100 45, 60 45, 20 60 Z"
              fill="rgba(220, 38, 38, 0.95)"
              stroke="#b91c1c"
              strokeWidth="3"
              filter={isSelected("left-ventricle") ? `url(#${glowId})` : undefined}
            />
            {/* Thick myocardium wall shading */}
            <path d="M 140 55 C 175 110, 140 195, 70 200" stroke="#7f1d1d" strokeWidth="8" fill="none" opacity="0.7" />
            <text x="80" y="110" textAnchor="middle" className="font-display text-sm font-bold fill-white pointer-events-none">
              Left Ventricle
            </text>
            <text x="80" y="128" textAnchor="middle" className="font-mono text-[8px] fill-red-100 font-bold pointer-events-none">
              LV (120/8 mmHg)
            </text>
          </g>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 6. FOUR CARDIAC VALVES */}
          {/* ───────────────────────────────────────────────────────── */}
          {/* 6.1 Tricuspid Valve (RA -> RV) */}
          <g
            id="tricuspid-valve-group"
            transform="translate(-80, 50)"
            className="cursor-pointer"
            onClick={(e) => handleSelect("tricuspid-valve", e)}
          >
            <ellipse cx="0" cy="0" rx="16" ry="6" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" filter={isSelected("tricuspid-valve") ? `url(#${glowId})` : undefined} />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#0f172a" strokeWidth="2" strokeDasharray="3 2" />
            {/* Chordae Tendineae to Papillary Muscles */}
            <path d="M -8 5 L -12 25 M 0 5 L -2 30 M 8 5 L 10 25" stroke="#f8fafc" strokeWidth="1.5" opacity="0.8" />
            <circle cx="-12" cy="27" r="4" fill="#7f1d1d" />
            <circle cx="10" cy="27" r="4" fill="#7f1d1d" />
            {showLabels && (
              <text x="-24" y="-10" textAnchor="end" className="font-mono text-[8px] font-bold fill-sky-200">
                Tricuspid Valve
              </text>
            )}
          </g>

          {/* 6.2 Pulmonary Semilunar Valve (RV -> Pulmonary Trunk) */}
          <g
            id="pulmonary-valve-group"
            transform="translate(-30, -35)"
            className="cursor-pointer"
            onClick={(e) => handleSelect("pulmonary-valve", e)}
          >
            <ellipse cx="0" cy="0" rx="14" ry="6" fill="#f8fafc" stroke="#0284c7" strokeWidth="2.5" filter={isSelected("pulmonary-valve") ? `url(#${glowId})` : undefined} />
            <path d="M -10 0 C -4 4, 4 4, 10 0" stroke="#0f172a" strokeWidth="2" fill="none" />
            {showLabels && (
              <text x="-18" y="-10" textAnchor="end" className="font-mono text-[8px] font-bold fill-sky-200">
                Pulmonary Valve
              </text>
            )}
          </g>

          {/* 6.3 Mitral (Bicuspid) Valve (LA -> LV) */}
          <g
            id="mitral-valve-group"
            transform="translate(80, 48)"
            className="cursor-pointer"
            onClick={(e) => handleSelect("mitral-valve", e)}
          >
            <ellipse cx="0" cy="0" rx="16" ry="6" fill="#f8fafc" stroke="#dc2626" strokeWidth="2.5" filter={isSelected("mitral-valve") ? `url(#${glowId})` : undefined} />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#450a0a" strokeWidth="2" strokeDasharray="4 2" />
            {/* Chordae Tendineae to Papillary Muscles */}
            <path d="M -8 5 L -10 26 M 8 5 L 12 26" stroke="#f8fafc" strokeWidth="1.8" opacity="0.8" />
            <circle cx="-10" cy="28" r="5" fill="#7f1d1d" />
            <circle cx="12" cy="28" r="5" fill="#7f1d1d" />
            {showLabels && (
              <text x="26" y="-10" textAnchor="start" className="font-mono text-[8px] font-bold fill-red-200">
                Mitral (Bicuspid) Valve
              </text>
            )}
          </g>

          {/* 6.4 Aortic Semilunar Valve (LV -> Aorta) */}
          <g
            id="aortic-valve-group"
            transform="translate(40, -35)"
            className="cursor-pointer"
            onClick={(e) => handleSelect("aortic-valve", e)}
          >
            <ellipse cx="0" cy="0" rx="14" ry="6" fill="#f8fafc" stroke="#dc2626" strokeWidth="2.5" filter={isSelected("aortic-valve") ? `url(#${glowId})` : undefined} />
            <path d="M -10 0 C -4 4, 4 4, 10 0" stroke="#450a0a" strokeWidth="2" fill="none" />
            {showLabels && (
              <text x="20" y="-10" textAnchor="start" className="font-mono text-[8px] font-bold fill-red-200">
                Aortic Valve
              </text>
            )}
          </g>
        </g>
      </svg>

      {/* Floating Legend / Quick Filter Pills */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-4 bg-white/95 backdrop-blur-xs border border-border px-3.5 py-2 font-mono text-[10px] text-muted shadow-xs">
        <button
          type="button"
          onClick={() => onSelectEntity(CIRCULATION_INSPECTABLES["right-ventricle"])}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="w-3 h-2 bg-blue-600 inline-block" />
          <span>Oxygen-Poor (Venous / Pulmonary Outflow)</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectEntity(CIRCULATION_INSPECTABLES["left-ventricle"])}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="w-3 h-2 bg-red-600 inline-block" />
          <span>Oxygen-Rich (Arterial / Systemic Outflow)</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectEntity(CIRCULATION_INSPECTABLES["mitral-valve"])}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-slate-100 border border-slate-700 inline-block" />
          <span>One-Way Valves</span>
        </button>
      </div>
    </div>
  );
}
