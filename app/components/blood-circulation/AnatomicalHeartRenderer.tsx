"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import {
  AnatomicalEntity,
  CirculationMode,
  CIRCULATION_INSPECTABLES,
  CIRCULATION_STEPS,
} from "@/lib/biology/bloodCirculationModel";
import {
  BODY_BED_PATH,
  BODY_CAPILLARIES,
  CHAMBERS,
  ChamberDefinition,
  HEAD_BRANCH_CAP,
  HEART_OUTLINE_PATH,
  LEFT_LUNG_BRONCHI,
  LEFT_LUNG_FISSURE,
  LEFT_LUNG_PATH,
  LV_OUTFLOW_PATH,
  RIGHT_LUNG_BRONCHI,
  RIGHT_LUNG_FISSURES,
  RIGHT_LUNG_PATH,
  ROUTE_PIECES,
  RV_OUTFLOW_PATH,
  SEPTUM_PATH,
  STEP_ANCHORS,
  VALVES,
  VESSELS,
  VesselDefinition,
  ValveDefinition,
} from "./heartCirculationGeometry";

interface AnatomicalHeartRendererProps {
  mode: CirculationMode;
  currentStepIndex: number;
  selectedEntity: AnatomicalEntity | null;
  onSelectEntity: (entity: AnatomicalEntity | null) => void;
  isPlaying: boolean;
  flowSpeed: number;
  showLabels: boolean;
  showVectors: boolean;
  showOxygenation: boolean;
}

const TONE = {
  venous: {
    base: "#2563eb",
    dark: "#1e3a8a",
    light: "#bfdbfe",
    text: "#1e3a8a",
    chamberStroke: "#1e40af",
  },
  arterial: {
    base: "#dc2626",
    dark: "#7f1d1d",
    light: "#fecaca",
    text: "#7f1d1d",
    chamberStroke: "#991b1b",
  },
} as const;

const CHAMBER_SATURATION: Record<string, string> = {
  "right-atrium": "sO₂ 75%",
  "left-atrium": "sO₂ 98%",
  "right-ventricle": "sO₂ 75%",
  "left-ventricle": "sO₂ 98%",
};

/* ─────────────────────────────────────────────────────────────
   Small shared interactive wrapper
   ───────────────────────────────────────────────────────────── */

interface NodeGroupProps {
  id: string;
  active: boolean;
  hovered: boolean;
  dimmed: boolean;
  tooltipId: string;
  selectShadowId?: string;
  hoverGlowId?: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onFocus: (id: string) => void;
  onBlur: () => void;
  children: React.ReactNode;
}

function anatomyAriaLabel(entity: AnatomicalEntity | undefined): string {
  if (!entity) return "Anatomical structure. Select to inspect.";
  return `${entity.name}. ${entity.oxygenSaturation}. ${entity.function} Select to inspect.`;
}

function NodeGroup({
  id,
  active,
  hovered,
  dimmed,
  tooltipId,
  selectShadowId,
  hoverGlowId,
  onSelect,
  onHover,
  onFocus,
  onBlur,
  children,
}: NodeGroupProps) {
  const entity = CIRCULATION_INSPECTABLES[id];

  const handleKeyDown = (event: React.KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      onSelect(id);
    }
  };

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={anatomyAriaLabel(entity)}
      aria-pressed={active}
      data-tooltip-id={tooltipId}
      data-tooltip-hidden={active}
      data-tooltip-content={entity ? entity.name : id}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(id);
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onFocus(id)}
      onBlur={onBlur}
      className="anatomy-node cursor-pointer transition-opacity duration-200"
      style={{
        opacity: dimmed ? 0.42 : 1,
        filter: active
          ? selectShadowId
            ? `url(#${selectShadowId})`
            : undefined
          : hovered && hoverGlowId
            ? `url(#${hoverGlowId})`
            : undefined,
      }}
    >
      {children}
    </g>
  );
}

function OutlineOnSelect({
  d,
  active,
  strokeWidth = 1.5,
}: {
  d: string;
  active: boolean;
  strokeWidth?: number;
}) {
  if (!active) return null;
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="#ffffff"
        strokeWidth={6}
        strokeLinejoin="round"
        opacity={0.9}
        pointerEvents="none"
      />
      <path
        d={d}
        fill="none"
        stroke="#0f172a"
        strokeWidth={strokeWidth}
        strokeDasharray="7 5"
        strokeLinejoin="round"
        opacity={0.85}
        pointerEvents="none"
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Vessel
   ───────────────────────────────────────────────────────────── */

interface VesselNodeProps {
  vessel: VesselDefinition;
  active: boolean;
  hovered: boolean;
  dimmed: boolean;
  tooltipId: string;
  selectShadowId: string;
  hoverGlowId: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onFocus: (id: string) => void;
  onBlur: () => void;
  children?: React.ReactNode;
}

function VesselNode({
  vessel,
  active,
  hovered,
  dimmed,
  tooltipId,
  selectShadowId,
  hoverGlowId,
  onSelect,
  onHover,
  onFocus,
  onBlur,
  children,
}: VesselNodeProps) {
  const palette = TONE[vessel.tone];

  return (
    <NodeGroup
      id={vessel.id}
      active={active}
      hovered={hovered}
      dimmed={dimmed}
      tooltipId={tooltipId}
      selectShadowId={selectShadowId}
      hoverGlowId={hoverGlowId}
      onSelect={onSelect}
      onHover={onHover}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {vessel.paths.map((path, index) => (
        <g key={`${vessel.id}-${index}`}>
          {active && (
            <>
              <path
                d={path.d}
                fill="none"
                stroke="#ffffff"
                strokeWidth={path.width + 12}
                strokeOpacity={0.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={path.d}
                fill="none"
                stroke="#0f172a"
                strokeWidth={path.width + 12}
                strokeDasharray="7 5"
                strokeOpacity={0.72}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
          {/* Vessel wall / soft outer casing */}
          <path
            d={path.d}
            fill="none"
            stroke="#0f172a"
            strokeOpacity={0.14}
            strokeWidth={path.width + 7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Lumen */}
          <path
            d={path.d}
            fill="none"
            stroke={palette.base}
            strokeWidth={path.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner light ridge gives the tube some depth */}
          <path
            d={path.d}
            fill="none"
            stroke={palette.light}
            strokeOpacity={0.55}
            strokeWidth={Math.max(2, path.width * 0.22)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Direction of flow */}
          <path
            d={path.d}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.85}
            strokeWidth={Math.max(1.6, path.width * 0.1)}
            strokeLinecap="round"
            className="circulation-flow-fine"
          />
          {/* Comfortable pointer / touch target */}
          <path
            d={path.d}
            fill="none"
            stroke="transparent"
            strokeWidth={path.width + 16}
            strokeLinecap="round"
          />
        </g>
      ))}
      {children}
    </NodeGroup>
  );
}

/* ─────────────────────────────────────────────────────────────
   Chamber
   ───────────────────────────────────────────────────────────── */

function ChamberNode({
  chamber,
  active,
  hovered,
  dimmed,
  showLabels,
  showOxygenation,
  tooltipId,
  selectShadowId,
  hoverGlowId,
  onSelect,
  onHover,
  onFocus,
  onBlur,
}: {
  chamber: ChamberDefinition;
  active: boolean;
  hovered: boolean;
  dimmed: boolean;
  showLabels: boolean;
  showOxygenation: boolean;
  tooltipId: string;
  selectShadowId: string;
  hoverGlowId: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onFocus: (id: string) => void;
  onBlur: () => void;
}) {
  const palette = TONE[chamber.tone];
  const entity = CIRCULATION_INSPECTABLES[chamber.id];
  const saturation = CHAMBER_SATURATION[chamber.id];

  return (
    <NodeGroup
      id={chamber.id}
      active={active}
      hovered={hovered}
      dimmed={dimmed}
      tooltipId={tooltipId}
      selectShadowId={selectShadowId}
      hoverGlowId={hoverGlowId}
      onSelect={onSelect}
      onHover={onHover}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <path
        d={chamber.d}
        fill={chamber.tone === "venous" ? "url(#venous-chamber)" : "url(#arterial-chamber)"}
        stroke={palette.chamberStroke}
        strokeWidth={1.6}
      />
      <path d={chamber.d} fill="url(#chamber-sheen)" pointerEvents="none" />
      <path
        d={chamber.d}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.26}
        strokeWidth={1}
      />
      <OutlineOnSelect d={chamber.d} active={active} />

      {showLabels ? (
        <g pointerEvents="none">
          <text
            x={chamber.label.x}
            y={chamber.label.y}
            textAnchor="middle"
            className="font-display"
            fontSize={12}
            fontWeight={600}
            fill="#ffffff"
            paintOrder="stroke"
            stroke={palette.dark}
            strokeWidth={2.4}
            strokeOpacity={0.55}
            strokeLinejoin="round"
          >
            {entity?.name.toUpperCase() ?? chamber.id}
          </text>
          {showOxygenation && saturation && (
            <text
              x={chamber.saturation?.x ?? chamber.label.x}
              y={chamber.saturation?.y ?? chamber.label.y + 16}
              textAnchor="middle"
              className="font-mono"
              fontSize={8.5}
              fontWeight={600}
              fill="#ffffff"
              fillOpacity={0.94}
            >
              {saturation}
            </text>
          )}
        </g>
      ) : (
        <text
          x={chamber.label.x}
          y={chamber.label.y + 2}
          textAnchor="middle"
          className="font-display"
          fontSize={16}
          fontWeight={600}
          fill="#ffffff"
          fillOpacity={0.92}
          pointerEvents="none"
        >
          {chamber.abbreviation}
        </text>
      )}
    </NodeGroup>
  );
}

/* ─────────────────────────────────────────────────────────────
   Valve
   ───────────────────────────────────────────────────────────── */

function ValveNode({
  valve,
  active,
  hovered,
  dimmed,
  showLabels,
  tooltipId,
  selectShadowId,
  hoverGlowId,
  onSelect,
  onHover,
  onFocus,
  onBlur,
}: {
  valve: ValveDefinition;
  active: boolean;
  hovered: boolean;
  dimmed: boolean;
  showLabels: boolean;
  tooltipId: string;
  selectShadowId: string;
  hoverGlowId: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onFocus: (id: string) => void;
  onBlur: () => void;
}) {
  const palette = TONE[valve.tone];
  const isAtrioventricular =
    valve.id === "tricuspid-valve" || valve.id === "mitral-valve";
  const hitRadius = isAtrioventricular ? 30 : 22;

  return (
    <NodeGroup
      id={valve.id}
      active={active}
      hovered={hovered}
      dimmed={dimmed}
      tooltipId={tooltipId}
      selectShadowId={selectShadowId}
      hoverGlowId={hoverGlowId}
      onSelect={onSelect}
      onHover={onHover}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <g transform={`translate(${valve.x} ${valve.y}) rotate(${valve.rotate})`}>
        {/* Chordae tendineae + papillary muscles (AV valves only) */}
        {isAtrioventricular && (
          <g pointerEvents="none">
            <path
              d={`M ${-valve.rx * 0.48} ${valve.ry * 0.7} L ${-valve.rx * 0.36} ${valve.ry * 2.8} M ${valve.rx * 0.48} ${valve.ry * 0.7} L ${valve.rx * 0.36} ${valve.ry * 2.8}`}
              stroke="#e2e8f0"
              strokeWidth={0.8}
              strokeOpacity={0.5}
              fill="none"
            />
            <circle cx={-valve.rx * 0.36} cy={valve.ry * 3} r={2} fill="#8a4a42" opacity={0.7} />
            <circle cx={valve.rx * 0.36} cy={valve.ry * 3} r={2} fill="#8a4a42" opacity={0.7} />
          </g>
        )}

        <ellipse
          cx={0}
          cy={0}
          rx={valve.rx}
          ry={valve.ry}
          fill="#f8fafc"
          stroke="#475569"
          strokeWidth={1.2}
        />
        <ellipse
          cx={0}
          cy={0}
          rx={valve.rx * 0.55}
          ry={valve.ry * 0.42}
          fill="#ffffff"
          stroke={palette.dark}
          strokeWidth={1}
        />
        <line
          x1={-valve.rx * 0.55}
          y1={0}
          x2={valve.rx * 0.55}
          y2={0}
          stroke={palette.dark}
          strokeWidth={1.3}
        />
        <circle cx={0} cy={0} r={1.6} fill={palette.dark} />
      </g>

      {/* Generous invisible interaction target */}
      <circle cx={valve.x} cy={valve.y} r={hitRadius} fill="transparent" />

      {active && (
        <>
          <circle
            cx={valve.x}
            cy={valve.y}
            r={hitRadius}
            fill="none"
            stroke="#ffffff"
            strokeWidth={5}
            opacity={0.85}
            pointerEvents="none"
          />
          <circle
            cx={valve.x}
            cy={valve.y}
            r={hitRadius}
            fill="none"
            stroke="#0f172a"
            strokeWidth={1.4}
            strokeDasharray="5 4"
            opacity={0.8}
            pointerEvents="none"
          />
        </>
      )}

      {showLabels && (
        <g pointerEvents="none">
          {valve.label.leader && (
            <line
              x1={valve.label.leader.x1}
              y1={valve.label.leader.y1}
              x2={valve.label.leader.x2}
              y2={valve.label.leader.y2}
              stroke={palette.dark}
              strokeWidth={0.8}
              strokeOpacity={0.7}
            />
          )}
          <text
            x={valve.label.x}
            y={valve.label.y}
            textAnchor={valve.label.anchor}
            className="font-mono"
            fontSize={8.5}
            fontWeight={600}
            letterSpacing={0.4}
            fill={
              valve.id === "tricuspid-valve" || valve.id === "mitral-valve"
                ? "#ffffff"
                : palette.text
            }
            paintOrder="stroke"
            stroke={
              valve.id === "tricuspid-valve" || valve.id === "mitral-valve"
                ? palette.dark
                : "#ffffff"
            }
            strokeWidth={
              valve.id === "tricuspid-valve" || valve.id === "mitral-valve"
                ? 2.6
                : 2.2
            }
            strokeOpacity={
              valve.id === "tricuspid-valve" || valve.id === "mitral-valve"
                ? 0.55
                : 0.9
            }
            strokeLinejoin="round"
          >
            {valve.id === "tricuspid-valve"
              ? "TRICUSPID VALVE"
              : valve.id === "mitral-valve"
                ? "MITRAL VALVE"
                : valve.id === "pulmonary-valve"
                  ? "PULMONARY VALVE"
                  : "AORTIC VALVE"}
          </text>
        </g>
      )}
    </NodeGroup>
  );
}

/* ─────────────────────────────────────────────────────────────
   Lungs
   ───────────────────────────────────────────────────────────── */

function LungsNode({
  active,
  hovered,
  dimmed,
  showLabels,
  showOxygenation,
  tooltipId,
  selectShadowId,
  hoverGlowId,
  onSelect,
  onHover,
  onFocus,
  onBlur,
}: {
  active: boolean;
  hovered: boolean;
  dimmed: boolean;
  showLabels: boolean;
  showOxygenation: boolean;
  tooltipId: string;
  selectShadowId: string;
  hoverGlowId: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onFocus: (id: string) => void;
  onBlur: () => void;
}) {
  return (
    <NodeGroup
      id="lungs"
      active={active}
      hovered={hovered}
      dimmed={dimmed}
      tooltipId={tooltipId}
      selectShadowId={selectShadowId}
      hoverGlowId={hoverGlowId}
      onSelect={onSelect}
      onHover={onHover}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {/* Patient RIGHT lung — viewer left, three lobes */}
      <path
        d={RIGHT_LUNG_PATH}
        fill="url(#lung-fill)"
        stroke="#7f9bb2"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* Lobe shading: upper lobe light, middle lobe base tone, lower lobe deeper */}
      <g clipPath="url(#right-lung-clip)" pointerEvents="none">
        <path
          d="M 200 310 C 250 290, 320 250, 360 220 L 380 440 L 180 440 Z"
          fill="#cfe2f1"
          opacity={0.9}
        />
        <path
          d="M 180 80 L 380 80 L 380 204 L 350 204 C 320 196, 280 194, 240 200 L 180 200 Z"
          fill="#fbfdff"
          opacity={0.85}
        />
      </g>
      <path
        d={RIGHT_LUNG_PATH}
        fill="url(#lung-volume)"
        pointerEvents="none"
      />
      <path
        d={RIGHT_LUNG_PATH}
        fill="url(#alveoli-dots)"
        pointerEvents="none"
      />
      <g clipPath="url(#right-lung-clip)" pointerEvents="none">
        {/* Branching bronchial tree */}
        <g stroke="#7f9bb2" strokeWidth={1.1} fill="none" opacity={0.7}>
          {RIGHT_LUNG_BRONCHI.map((d, index) => (
            <path key={`right-bronchus-${index}`} d={d} />
          ))}
        </g>
        {/* Fine alveolar texture */}
        <g stroke="#b8ccdb" strokeWidth={1} fill="none" opacity={0.75}>
          <path d="M 214 300 C 226 282, 238 286, 246 306" />
          <path d="M 246 306 C 258 288, 274 292, 280 312" />
          <path d="M 232 338 C 246 320, 260 326, 268 344" />
          <path d="M 292 250 C 304 236, 316 240, 322 256" />
          <path d="M 212 220 C 226 206, 240 212, 246 226" />
        </g>
        <g fill="#b8ccdb" opacity={0.6}>
          <circle cx={222} cy={310} r={1.6} />
          <circle cx={254} cy={318} r={1.4} />
          <circle cx={238} cy={342} r={1.6} />
          <circle cx={298} cy={260} r={1.4} />
          <circle cx={218} cy={230} r={1.4} />
        </g>
      </g>
      <path
        d={RIGHT_LUNG_FISSURES[0]}
        fill="none"
        stroke="#5f7f98"
        strokeWidth={1.6}
      />
      <path
        d={RIGHT_LUNG_FISSURES[1]}
        fill="none"
        stroke="#5f7f98"
        strokeWidth={1.6}
      />

      {/* Patient LEFT lung — viewer right, two lobes + cardiac notch */}
      <path
        d={LEFT_LUNG_PATH}
        fill="url(#lung-fill)"
        stroke="#7f9bb2"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <g clipPath="url(#left-lung-clip)" pointerEvents="none">
        <path
          d="M 930 324 C 980 292, 1030 252, 1075 220 L 1120 440 L 900 440 Z"
          fill="#cfe2f1"
          opacity={0.9}
        />
        <path
          d="M 900 80 L 1120 80 L 1120 220 L 1075 220 C 1030 252, 980 292, 930 324 L 900 324 Z"
          fill="#fbfdff"
          opacity={0.75}
        />
      </g>
      <path
        d={LEFT_LUNG_PATH}
        fill="url(#lung-volume)"
        pointerEvents="none"
      />
      <path
        d={LEFT_LUNG_PATH}
        fill="url(#alveoli-dots)"
        pointerEvents="none"
      />
      <g clipPath="url(#left-lung-clip)" pointerEvents="none">
        <g stroke="#7f9bb2" strokeWidth={1.1} fill="none" opacity={0.7}>
          {LEFT_LUNG_BRONCHI.map((d, index) => (
            <path key={`left-bronchus-${index}`} d={d} />
          ))}
        </g>
        <g stroke="#b8ccdb" strokeWidth={1} fill="none" opacity={0.75}>
          <path d="M 1002 300 C 1012 282, 1024 284, 1030 302" />
          <path d="M 1024 302 C 1036 284, 1050 290, 1054 308" />
          <path d="M 980 246 C 992 230, 1006 234, 1012 250" />
          <path d="M 1050 230 C 1062 216, 1074 222, 1078 238" />
        </g>
        <g fill="#b8ccdb" opacity={0.6}>
          <circle cx={1008} cy={308} r={1.6} />
          <circle cx={1034} cy={314} r={1.4} />
          <circle cx={986} cy={254} r={1.4} />
          <circle cx={1058} cy={240} r={1.4} />
        </g>
      </g>
      <path
        d={LEFT_LUNG_FISSURE}
        fill="none"
        stroke="#5f7f98"
        strokeWidth={1.6}
      />

      <OutlineOnSelect d={RIGHT_LUNG_PATH} active={active} />
      <OutlineOnSelect d={LEFT_LUNG_PATH} active={active} />

      {showLabels && (
        <g pointerEvents="none">
          <text
            x={270}
            y={352}
            textAnchor="middle"
            className="font-display"
            fontSize={12.5}
            fontWeight={600}
            fill="#0f172a"
          >
            RIGHT LUNG
          </text>
          <text
            x={270}
            y={368}
            textAnchor="middle"
            className="font-mono"
            fontSize={8.5}
            fontWeight={500}
            fill="#475569"
          >
            3 lobes · patient right
          </text>
          <text
            x={1013}
            y={352}
            textAnchor="middle"
            className="font-display"
            fontSize={12.5}
            fontWeight={600}
            fill="#0f172a"
          >
            LEFT LUNG
          </text>
          <text
            x={1013}
            y={368}
            textAnchor="middle"
            className="font-mono"
            fontSize={8.5}
            fontWeight={500}
            fill="#475569"
          >
            2 lobes · patient left
          </text>

          <text
            x={270}
            y={438}
            textAnchor="middle"
            className="font-mono"
            fontSize={8.5}
            fontWeight={600}
            letterSpacing={0.6}
            fill="#0369a1"
          >
            ALVEOLAR GAS EXCHANGE
          </text>
          <text
            x={270}
            y={454}
            textAnchor="middle"
            className="font-mono"
            fontSize={8}
            fontWeight={500}
            fill="#64748b"
          >
            O₂ in · CO₂ out
          </text>

          <text
            x={1013}
            y={438}
            textAnchor="middle"
            className="font-mono"
            fontSize={8.5}
            fontWeight={600}
            letterSpacing={0.6}
            fill="#0369a1"
          >
            ALVEOLAR GAS EXCHANGE
          </text>
          {showOxygenation && (
            <text
              x={1013}
              y={454}
              textAnchor="middle"
              className="font-mono"
              fontSize={8}
              fontWeight={600}
              fill="#b91c1c"
            >
              sO₂ 75% → 98%
            </text>
          )}
        </g>
      )}
    </NodeGroup>
  );
}

/* ─────────────────────────────────────────────────────────────
   Systemic capillary bed
   ───────────────────────────────────────────────────────────── */

function BodyBedNode({
  active,
  hovered,
  dimmed,
  showLabels,
  showOxygenation,
  tooltipId,
  selectShadowId,
  hoverGlowId,
  onSelect,
  onHover,
  onFocus,
  onBlur,
}: {
  active: boolean;
  hovered: boolean;
  dimmed: boolean;
  showLabels: boolean;
  showOxygenation: boolean;
  tooltipId: string;
  selectShadowId: string;
  hoverGlowId: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onFocus: (id: string) => void;
  onBlur: () => void;
}) {
  return (
    <NodeGroup
      id="body-tissues"
      active={active}
      hovered={hovered}
      dimmed={dimmed}
      tooltipId={tooltipId}
      selectShadowId={selectShadowId}
      hoverGlowId={hoverGlowId}
      onSelect={onSelect}
      onHover={onHover}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <path
        d={BODY_BED_PATH}
        fill="url(#bed-fill)"
        stroke="#a8b6c4"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path d={BODY_BED_PATH} fill="url(#tissue-dots)" pointerEvents="none" />
      <path d={BODY_BED_PATH} fill="url(#bed-wash)" pointerEvents="none" />
      <g pointerEvents="none">
        {BODY_CAPILLARIES.map((d, index) => (
          <path
            key={`bed-cap-${index}`}
            d={d}
            fill="none"
            stroke="url(#bed-gradient)"
            strokeWidth={1.8}
            strokeOpacity={0.5}
            strokeLinecap="round"
          />
        ))}
      </g>
      <OutlineOnSelect d={BODY_BED_PATH} active={active} />

      {showLabels && (
        <g pointerEvents="none">
          <text
            x={640}
            y={798}
            textAnchor="middle"
            className="font-display"
            fontSize={11.5}
            fontWeight={600}
            fill="#0f172a"
          >
            SYSTEMIC CAPILLARY BEDS
          </text>
          <text
            x={640}
            y={814}
            textAnchor="middle"
            className="font-mono"
            fontSize={8.5}
            fontWeight={500}
            fill="#475569"
          >
            brain · skeletal muscle · viscera · skin
          </text>
          <text
            x={640}
            y={830}
            textAnchor="middle"
            className="font-mono"
            fontSize={8}
            fontWeight={500}
            fill="#64748b"
          >
            O₂ &amp; nutrients out · CO₂ in
            {showOxygenation ? " · sO₂ 98% → 75%" : ""}
          </text>
        </g>
      )}
    </NodeGroup>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main renderer
   ───────────────────────────────────────────────────────────── */

export default function AnatomicalHeartRenderer({
  mode,
  currentStepIndex,
  selectedEntity,
  onSelectEntity,
  isPlaying,
  flowSpeed,
  showLabels,
  showVectors,
  showOxygenation,
}: AnatomicalHeartRendererProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // On phones the plate is intentionally wider than the viewport so labels
  // stay legible. Start with the heart centred rather than at the far left.
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    let frame = 0;

    const centre = () => {
      if (element.scrollWidth > element.clientWidth) {
        element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
        element.scrollTop = (element.scrollHeight - element.clientHeight) * 0.62;
      }
    };

    centre();
    frame = window.requestAnimationFrame(() => {
      centre();
      frame = window.requestAnimationFrame(centre);
    });

    const observer = new ResizeObserver(centre);
    observer.observe(element);
    window.addEventListener("load", centre);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("load", centre);
    };
  }, []);

  const rawId = useId();
  const uid = useMemo(() => `bc-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`, [rawId]);
  const tooltipId = `${uid}-tip`;

  const currentStep = CIRCULATION_STEPS[currentStepIndex];
  const traceId = mode === "trace" ? currentStep?.id : null;
  const activeId = selectedEntity?.id ?? traceId ?? null;
  const routeActiveId = selectedEntity?.id ?? traceId ?? null;

  const handleSelect = (id: string) => {
    const entity = CIRCULATION_INSPECTABLES[id];
    if (entity) onSelectEntity(entity);
  };

  /** Dimming for a specific node, accounting for the active selection. */
  const nodeDimmed = (id: string, region: "pulmonary" | "systemic" | "both") => {
    if (activeId === id) return false;
    if (activeId) return true;
    return (
      (mode === "pulmonary" && region === "systemic") ||
      (mode === "systemic" && region === "pulmonary")
    );
  };

  const nodeActive = (id: string) => activeId === id || focusedId === id;
  const nodeHovered = (id: string) => hoveredId === id || focusedId === id;

  const selectShadowId = `${uid}-select-shadow`;
  const hoverGlowId = `${uid}-hover-glow`;

  const flowDuration = `${(1.55 / flowSpeed).toFixed(2)}s`;

  const commonNodeProps = {
    tooltipId,
    selectShadowId,
    hoverGlowId,
    onSelect: handleSelect,
    onHover: setHoveredId,
    onFocus: setFocusedId,
    onBlur: () => setFocusedId(null),
  };

  return (
    <div
      className="relative w-full h-full select-none bg-[#fbfdff]"
      onClick={() => onSelectEntity(null)}
    >
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-auto xl:overflow-hidden"
      >
        <svg
          viewBox="-40 0 1280 860"
          preserveAspectRatio="xMidYMid meet"
          role="group"
          aria-labelledby={`${uid}-title ${uid}-desc`}
          className={`block h-auto w-full min-w-[900px] xl:h-full xl:min-h-0 xl:w-full ${
            isPlaying ? "force-motion" : "flow-paused"
          }`}
          style={
            {
              "--flow-duration": flowDuration,
            } as React.CSSProperties
          }
        >
          <title id={`${uid}-title`}>
            Human heart and dual blood circulation — anterior schematic
          </title>
          <desc id={`${uid}-desc`}>
            Anterior view of the heart with the pulmonary circuit above and the
            systemic capillary beds below. Blue vessels carry oxygen-poor blood;
            red vessels carry oxygen-rich blood. The pulmonary arteries are
            therefore blue and the pulmonary veins red. Select any chamber,
            valve, vessel, lung, or capillary bed to inspect it.
          </desc>

          <defs>
            <radialGradient id={`${uid}-bg-glow`} cx="50%" cy="44%" r="62%">
              <stop offset="0%" stopColor="#eef6ff" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#fbfdff" stopOpacity={0} />
            </radialGradient>

            <linearGradient id="venous-chamber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4585f0" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="arterial-chamber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <radialGradient id="myocardium-fill" cx="42%" cy="34%" r="78%">
              <stop offset="0%" stopColor="#b06a5f" />
              <stop offset="55%" stopColor="#8f4d45" />
              <stop offset="100%" stopColor="#6a352f" />
            </radialGradient>
            <radialGradient id="chamber-sheen" cx="35%" cy="22%" r="78%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.26} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </radialGradient>
            <linearGradient id="lung-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4f9fd" />
              <stop offset="100%" stopColor="#e3eef8" />
            </linearGradient>
            <radialGradient id="lung-volume" cx="50%" cy="42%" r="74%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.7} />
              <stop offset="72%" stopColor="#ffffff" stopOpacity={0} />
              <stop offset="100%" stopColor="#8fb0c9" stopOpacity={0.16} />
            </radialGradient>
            <pattern
              id="alveoli-dots"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="3" cy="3" r="1" fill="#8fa8bd" opacity={0.32} />
              <circle cx="11" cy="10" r="0.8" fill="#8fa8bd" opacity={0.24} />
            </pattern>
            <pattern
              id="tissue-dots"
              width="18"
              height="18"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="4" cy="4" r="1" fill="#94a3b8" opacity={0.28} />
              <circle cx="13" cy="12" r="0.8" fill="#94a3b8" opacity={0.2} />
            </pattern>
            <linearGradient id="bed-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f9fbfd" />
              <stop offset="100%" stopColor="#edf2f7" />
            </linearGradient>
            <linearGradient
              id="bed-gradient"
              gradientUnits="userSpaceOnUse"
              x1="950"
              y1="0"
              x2="330"
              y2="0"
            >
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="55%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient
              id="bed-wash"
              gradientUnits="userSpaceOnUse"
              x1="950"
              y1="0"
              x2="330"
              y2="0"
            >
              <stop offset="0%" stopColor="#dc2626" stopOpacity={0.06} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.06} />
            </linearGradient>

            <filter id={selectShadowId} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="5"
                floodColor="#0f172a"
                floodOpacity="0.42"
              />
            </filter>
            <filter id={hoverGlowId} x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="3"
                floodColor="#0f172a"
                floodOpacity="0.2"
              />
            </filter>
            <filter id={`${uid}-organ-shadow`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="4"
                floodColor="#0f172a"
                floodOpacity="0.08"
              />
            </filter>

            <marker
              id={`${uid}-arrow-venous`}
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.4 L 8.5 5 L 0 8.6 z" fill={TONE.venous.base} />
            </marker>
            <marker
              id={`${uid}-arrow-arterial`}
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.4 L 8.5 5 L 0 8.6 z" fill={TONE.arterial.base} />
            </marker>

            <clipPath id="right-lung-clip">
              <path d={RIGHT_LUNG_PATH} />
            </clipPath>
            <clipPath id="left-lung-clip">
              <path d={LEFT_LUNG_PATH} />
            </clipPath>
          </defs>

          {/* Soft focus wash */}
          <rect
            x={-40}
            y={0}
            width={1280}
            height={860}
            fill={`url(#${uid}-bg-glow)`}
            pointerEvents="none"
          />

          {/* Plate caption */}
          <text
            x={600}
            y={30}
            textAnchor="middle"
            className="font-mono"
            fontSize={9}
            fontWeight={600}
            letterSpacing={2.2}
            fill="#94a3b8"
            pointerEvents="none"
          >
            ANTERIOR VIEW · SCHEMATIC
          </text>

          {/* 1 — LUNGS */}
          <LungsNode
            active={nodeActive("lungs")}
            hovered={nodeHovered("lungs")}
            dimmed={nodeDimmed("lungs", "pulmonary")}
            showLabels={showLabels}
            showOxygenation={showOxygenation}
            {...commonNodeProps}
          />

          {/* 2 — CAPILLARY BED (behind its connecting vessels) */}
          <BodyBedNode
            active={nodeActive("body-tissues")}
            hovered={nodeHovered("body-tissues")}
            dimmed={nodeDimmed("body-tissues", "systemic")}
            showLabels={showLabels}
            showOxygenation={showOxygenation}
            {...commonNodeProps}
          />

          {/* 3 — GREAT VESSELS (aorta → pulmonary veins → pulmonary arteries → vena cava) */}
          <g filter={`url(#${uid}-organ-shadow)`}>
            {VESSELS.map((vessel, vesselIndex) => {
              const region =
                vessel.circuit === "both" ? "both" : vessel.circuit;
              return (
                <VesselNode
                  key={`${vessel.id}-${vesselIndex}`}
                  vessel={vessel}
                  active={nodeActive(vessel.id)}
                  hovered={nodeHovered(vessel.id)}
                  dimmed={nodeDimmed(vessel.id, region)}
                  {...commonNodeProps}
                >
                  {showLabels && vessel.id === "vena-cava" && (
                    <g pointerEvents="none">
                      <text
                        x={455}
                        y={52}
                        textAnchor="end"
                        className="font-mono"
                        fontSize={10}
                        fontWeight={600}
                        letterSpacing={0.5}
                        fill="#1e3a8a"
                      >
                        SUPERIOR VENA CAVA
                      </text>
                      <text
                        x={455}
                        y={67}
                        textAnchor="end"
                        className="font-mono"
                        fontSize={8}
                        fontWeight={500}
                        fill="#64748b"
                      >
                        from head &amp; upper limbs
                      </text>
                      <path
                        d="M 458 72 L 468 86"
                        stroke="#93c5fd"
                        strokeWidth={1}
                      />

                      <text
                        x={438}
                        y={596}
                        textAnchor="end"
                        className="font-mono"
                        fontSize={10}
                        fontWeight={600}
                        letterSpacing={0.5}
                        fill="#1e3a8a"
                      >
                        INFERIOR VENA CAVA
                      </text>
                      <text
                        x={438}
                        y={611}
                        textAnchor="end"
                        className="font-mono"
                        fontSize={8}
                        fontWeight={500}
                        fill="#64748b"
                      >
                        from trunk &amp; lower limbs
                      </text>
                      <path
                        d="M 442 616 L 486 660"
                        stroke="#93c5fd"
                        strokeWidth={1}
                      />
                    </g>
                  )}

                  {showLabels && vessel.id === "pulmonary-arteries" && (
                    <g pointerEvents="none">
                      <text
                        x={610}
                        y={188}
                        textAnchor="middle"
                        className="font-mono"
                        fontSize={10}
                        fontWeight={600}
                        letterSpacing={0.5}
                        fill="#1e3a8a"
                      >
                        PULMONARY ARTERIES
                      </text>
                      <text
                        x={610}
                        y={202}
                        textAnchor="middle"
                        className="font-mono"
                        fontSize={8}
                        fontWeight={500}
                        fill="#2563eb"
                      >
                        deoxygenated · to both lungs
                      </text>
                    </g>
                  )}

                  {showLabels && vessel.id === "aorta" && (
                    <g pointerEvents="none">
                      <text
                        x={730}
                        y={128}
                        textAnchor="end"
                        className="font-mono"
                        fontSize={10}
                        fontWeight={600}
                        letterSpacing={0.5}
                        fill="#7f1d1d"
                      >
                        AORTIC ARCH
                      </text>

                      <text
                        x={780}
                        y={68}
                        textAnchor="middle"
                        className="font-mono"
                        fontSize={9}
                        fontWeight={600}
                        letterSpacing={0.5}
                        fill="#7f1d1d"
                      >
                        HEAD &amp; UPPER LIMBS
                      </text>
                      <path
                        d={HEAD_BRANCH_CAP}
                        stroke="#fca5a5"
                        strokeWidth={1}
                        strokeDasharray="3 3"
                      />

                      <text
                        x={905}
                        y={470}
                        textAnchor="start"
                        className="font-mono"
                        fontSize={10}
                        fontWeight={600}
                        letterSpacing={0.5}
                        fill="#7f1d1d"
                      >
                        DESCENDING AORTA
                      </text>
                      <text
                        x={905}
                        y={486}
                        textAnchor="start"
                        className="font-mono"
                        fontSize={8}
                        fontWeight={500}
                        fill="#64748b"
                      >
                        systemic · 120/80 mmHg
                      </text>
                    </g>
                  )}
                </VesselNode>
              );
            })}
          </g>

          {/* 4 — HEART WALL */}
          <g filter={`url(#${uid}-organ-shadow)`}>
            <path
              d={HEART_OUTLINE_PATH}
              fill="url(#myocardium-fill)"
              stroke="#5c2b27"
              strokeWidth={2.4}
              strokeLinejoin="round"
            />
            <path
              d={HEART_OUTLINE_PATH}
              fill="none"
              stroke="#dca79c"
              strokeOpacity={0.28}
              strokeWidth={1.1}
              strokeLinejoin="round"
            />

            {/* Myocardial fibre striations — visible only in the wall,
                because the chamber cavities are painted over them. */}
            <g
              fill="none"
              stroke="#5f2f2a"
              strokeOpacity={0.36}
              strokeWidth={1.4}
              pointerEvents="none"
            >
              <path d="M 458 390 C 450 452, 468 516, 502 566" />
              <path d="M 476 370 C 468 438, 486 508, 522 562" />
              <path d="M 792 382 C 804 442, 798 522, 772 584" />
              <path d="M 776 360 C 792 428, 788 512, 762 574" />
              <path d="M 590 648 C 638 672, 690 672, 728 646" />
              <path d="M 530 312 C 572 300, 626 298, 664 294" />
            </g>

            {/* Outflow tracts connect the ventricles to the semilunar valves */}
            <path
              d={RV_OUTFLOW_PATH}
              fill="url(#venous-chamber)"
              stroke="#5c2b27"
              strokeWidth={1.2}
            />
            <path
              d={LV_OUTFLOW_PATH}
              fill="url(#arterial-chamber)"
              stroke="#5c2b27"
              strokeWidth={1.2}
            />

            {/* Muscular interventricular septum */}
            <path
              d={SEPTUM_PATH}
              fill="none"
              stroke="#5c2b27"
              strokeWidth={24}
              strokeLinecap="round"
            />
            <path
              d={SEPTUM_PATH}
              fill="none"
              stroke="#8d4c45"
              strokeWidth={17}
              strokeLinecap="round"
            />
          </g>

          {/* 5 — CHAMBERS */}
          <g>
            {CHAMBERS.map((chamber) => (
              <ChamberNode
                key={chamber.id}
                chamber={chamber}
                active={nodeActive(chamber.id)}
                hovered={nodeHovered(chamber.id)}
                dimmed={nodeDimmed(chamber.id, "both")}
                showLabels={showLabels}
                showOxygenation={showOxygenation}
                {...commonNodeProps}
              />
            ))}
          </g>

          {/* 6 — VALVES */}
          <g>
            {VALVES.map((valve) => (
              <ValveNode
                key={valve.id}
                valve={valve}
                active={nodeActive(valve.id)}
                hovered={nodeHovered(valve.id)}
                dimmed={nodeDimmed(valve.id, "both")}
                showLabels={showLabels}
                {...commonNodeProps}
              />
            ))}
          </g>

          {/* 7 — CONTINUOUS CIRCULATION ROUTE */}
          {showVectors && (
            <g pointerEvents="none" aria-hidden="true">
              {ROUTE_PIECES.map((piece, index) => {
                const palette = TONE[piece.tone];
                const isActive = routeActiveId === piece.stepId;
                let opacity = 1;
                if (mode === "trace") {
                  opacity = isActive ? 1 : 0.3;
                } else if (
                  (mode === "pulmonary" && piece.circuit === "systemic") ||
                  (mode === "systemic" && piece.circuit === "pulmonary")
                ) {
                  opacity = 0.12;
                }
                if (selectedEntity && !isActive && activeId) {
                  opacity = Math.min(opacity, 0.35);
                }

                return (
                  <g
                    key={`route-${index}`}
                    opacity={opacity}
                    filter={isActive ? `url(#${selectShadowId})` : undefined}
                  >
                      <path
                        d={piece.d}
                        fill="none"
                        stroke={palette.dark}
                        strokeWidth={5.6}
                        strokeOpacity={0.22}
                        strokeLinecap="round"
                      />
                      <path
                        d={piece.d}
                        fill="none"
                        stroke={palette.base}
                        strokeWidth={isActive ? 4 : 3.2}
                        strokeLinecap="round"
                        markerEnd={
                          piece.arrow
                            ? `url(#${uid}-arrow-${piece.tone})`
                            : undefined
                        }
                      />
                      <path
                        d={piece.d}
                        fill="none"
                        stroke={palette.light}
                        strokeOpacity={0.95}
                        strokeWidth={1.9}
                        strokeLinecap="round"
                        className="circulation-flow"
                      />
                  </g>
                );
              })}
            </g>
          )}

          {/* 8 — OXYGENATION CALLOUTS */}
          {showOxygenation && (
            <g pointerEvents="none" aria-hidden="true">
              <g transform="translate(620 286)">
                <rect
                  x={0}
                  y={-9}
                  width={52}
                  height={16}
                  rx={2}
                  fill="#eff6ff"
                  stroke="#bfdbfe"
                  strokeWidth={1}
                />
                <text
                  x={26}
                  y={2.5}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={8}
                  fontWeight={600}
                  fill="#1e40af"
                >
                  sO₂ ~75%
                </text>
              </g>
              <g transform="translate(800 272)">
                <rect
                  x={0}
                  y={-9}
                  width={52}
                  height={16}
                  rx={2}
                  fill="#fef2f2"
                  stroke="#fecaca"
                  strokeWidth={1}
                />
                <text
                  x={26}
                  y={2.5}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={8}
                  fontWeight={600}
                  fill="#991b1b"
                >
                  sO₂ ~98%
                </text>
              </g>
            </g>
          )}

          {/* 9 — TRACE STEP MARKER */}
          {mode === "trace" && traceId && STEP_ANCHORS[traceId] && (
            <g
              transform={`translate(${STEP_ANCHORS[traceId].x} ${STEP_ANCHORS[traceId].y})`}
              pointerEvents="none"
              aria-hidden="true"
            >
              <circle
                r={10.5}
                fill="#0f172a"
                stroke="#ffffff"
                strokeWidth={2.2}
              />
              <text
                y={3.2}
                textAnchor="middle"
                className="font-mono"
                fontSize={9}
                fontWeight={600}
                fill="#ffffff"
              >
                {currentStep.step}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Desktop key */}
      <div
        role="note"
        aria-label="Diagram key"
        className="absolute bottom-3 left-3 z-10 hidden max-w-[310px] border border-border bg-white/95 p-2.5 font-mono text-[10px] shadow-xs backdrop-blur-xs xl:block"
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted">
            Key
          </span>
          <span className="text-[8px] uppercase tracking-wider text-muted">
            Schematic · not to scale
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-5 bg-red-600" />
            <span className="text-foreground">
              <span className="font-semibold">Oxygen-rich</span> · systemic
              arteries &amp; pulmonary veins
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-5 bg-blue-600" />
            <span className="text-foreground">
              <span className="font-semibold">Oxygen-poor</span> · systemic veins
              &amp; pulmonary arteries
            </span>
          </div>
        </div>

        <div className="mt-2 border-t border-border pt-1.5 text-[9px] leading-relaxed text-muted">
          Anterior view · patient right is on the viewer&apos;s left. Colour
          encodes oxygenation, not vessel type. Both lungs are perfused in
          parallel.
        </div>
      </div>

      <Tooltip
        id={tooltipId}
        className="bioviz-tooltip"
        classNameArrow="hidden"
        place="top"
        delayShow={180}
        opacity={1}
      />
    </div>
  );
}
