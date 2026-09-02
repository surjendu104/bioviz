"use client";

import React, { useEffect, useRef } from "react";

interface ActionPotentialCanvasProps {
  vm: number;
  timeHistory: { t: number; vm: number; gNa: number; gK: number }[];
  phase: string;
  naGateOpen: boolean;
  naInactivated: boolean;
  kGateOpen: boolean;
  blocker: "none" | "ttx" | "tea";
  showConductance: boolean;
  onSelectObject: (id: string) => void;
}

export default function ActionPotentialCanvas({
  vm,
  timeHistory,
  phase,
  naGateOpen,
  naInactivated,
  kGateOpen,
  blocker,
  showConductance,
  onSelectObject,
}: ActionPotentialCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ionParticlesRef = useRef<{ x: number; y: number; vx: number; vy: number; type: "na" | "k" }[]>([]);

  // Initialize background ion particles in extracellular vs intracellular space
  useEffect(() => {
    const ions: { x: number; y: number; vx: number; vy: number; type: "na" | "k" }[] = [];
    // Extracellular: high Na+ (top half, y < 140)
    for (let i = 0; i < 40; i++) {
      ions.push({
        x: Math.random() * 800 + 20,
        y: Math.random() * 80 + 20,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        type: "na",
      });
    }
    // Intracellular: high K+ (bottom half of membrane, 200 < y < 270)
    for (let i = 0; i < 40; i++) {
      ions.push({
        x: Math.random() * 800 + 20,
        y: Math.random() * 70 + 210,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        type: "k",
      });
    }
    ionParticlesRef.current = ions;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Layout split:
      // Top 50%: Axon Membrane Cross-Section & Channels
      // Bottom 50%: Oscilloscope Waveform & Conductance Graph
      const membraneCenterY = Math.min(160, h * 0.32);
      const graphTopY = Math.max(membraneCenterY + 80, h * 0.52);
      const graphBottomY = h - 35;
      const graphHeight = graphBottomY - graphTopY;

      // ─────────────────────────────────────────────────────────
      // SECTION 1: AXON MEMBRANE & VOLTAGE-GATED CHANNELS
      // ─────────────────────────────────────────────────────────

      // Extracellular background (Top)
      ctx.fillStyle = "rgba(248, 250, 252, 0.7)";
      ctx.fillRect(0, 0, w, membraneCenterY - 18);

      // Intracellular Axoplasm background (Below membrane)
      ctx.fillStyle = "rgba(241, 245, 249, 0.9)";
      ctx.fillRect(0, membraneCenterY + 18, w, graphTopY - (membraneCenterY + 18));

      // Lipid Bilayer (Phospholipid heads & hydrophobic tails)
      ctx.fillStyle = "#334155";
      ctx.fillRect(0, membraneCenterY - 18, w, 36);

      // Hydrophobic core line
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, membraneCenterY);
      ctx.lineTo(w, membraneCenterY);
      ctx.stroke();

      // Channel Positions
      const naChannelX = w * 0.28;
      const kChannelX = w * 0.52;
      const pumpX = w * 0.76;

      // 1.1 Voltage-Gated Na+ Channel (Nav1.2)
      ctx.save();
      ctx.translate(naChannelX, membraneCenterY);
      // Outer protein barrel
      ctx.fillStyle = blocker === "ttx" ? "#dc2626" : "#0284c7";
      ctx.fillRect(-22, -26, 44, 52);
      // Pore lumen
      ctx.fillStyle = naGateOpen && !naInactivated && blocker !== "ttx" ? "#e0f2fe" : "#0f172a";
      ctx.fillRect(-8, -26, 16, 52);

      // Activation m-gate
      if (!naGateOpen || blocker === "ttx") {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-9, -10, 18, 5);
      }

      // Inactivation h-gate (Ball & Chain)
      if (naInactivated) {
        ctx.beginPath();
        ctx.arc(0, 14, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#f59e0b";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(16, 26, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#f59e0b";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(8, 16);
        ctx.lineTo(16, 26);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();

      // 1.2 Voltage-Gated K+ Channel (Kv1.1)
      ctx.save();
      ctx.translate(kChannelX, membraneCenterY);
      // Barrel
      ctx.fillStyle = blocker === "tea" ? "#dc2626" : "#059669";
      ctx.fillRect(-22, -26, 44, 52);
      // Pore lumen
      ctx.fillStyle = kGateOpen && blocker !== "tea" ? "#ecfdf5" : "#0f172a";
      ctx.fillRect(-8, -26, 16, 52);

      // n-gate activation
      if (!kGateOpen || blocker === "tea") {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-9, 4, 18, 5);
      }
      ctx.restore();

      // 1.3 Na+/K+ ATPase Pump
      ctx.save();
      ctx.translate(pumpX, membraneCenterY);
      ctx.fillStyle = "#9333ea";
      ctx.fillRect(-20, -24, 40, 48);
      ctx.fillStyle = "#ffffff";
      ctx.font = 'bold 8px "IBM Plex Mono", monospace';
      ctx.fillText("Na⁺/K⁺", -14, -4);
      ctx.fillText("ATPase", -14, 8);
      ctx.restore();

      // Channel Labels
      ctx.font = 'bold 9px "IBM Plex Mono", monospace';
      ctx.fillStyle = "#0284c7";
      ctx.fillText("Nav1.2 (Na⁺)", naChannelX - 26, membraneCenterY - 34);
      ctx.fillStyle = "#059669";
      ctx.fillText("Kv1.1 (K⁺)", kChannelX - 22, membraneCenterY - 34);
      ctx.fillStyle = "#9333ea";
      ctx.fillText("Pump (3Na/2K)", pumpX - 30, membraneCenterY - 34);

      // Environment Labels
      ctx.font = '8px "IBM Plex Mono", monospace';
      ctx.fillStyle = "#64748b";
      ctx.fillText("Extracellular Space [High Na⁺ ~145mM, Low K⁺ ~4mM]", 20, 20);
      ctx.fillText("Intracellular Axoplasm [High K⁺ ~140mM, Low Na⁺ ~12mM]", 20, membraneCenterY + 45);

      // Ion Particle Drift & Flux
      const ions = ionParticlesRef.current;
      for (const ion of ions) {
        ion.x += ion.vx;
        ion.y += ion.vy;

        // Influx through open Na+ channel
        if (naGateOpen && !naInactivated && blocker !== "ttx") {
          if (Math.abs(ion.x - naChannelX) < 40 && ion.y < membraneCenterY) {
            ion.vy += 0.12; // Downward influx into axon
          }
        }
        // Efflux through open K+ channel
        if (kGateOpen && blocker !== "tea") {
          if (Math.abs(ion.x - kChannelX) < 40 && ion.y > membraneCenterY) {
            ion.vy -= 0.12; // Upward efflux out of axon
          }
        }

        // Boundary wrap
        if (ion.x < 15) ion.x = w - 20;
        if (ion.x > w - 15) ion.x = 20;
        if (ion.y < 15) { ion.y = 15; ion.vy *= -1; }
        if (ion.y > graphTopY - 20) { ion.y = graphTopY - 20; ion.vy *= -1; }

        // Render Ion
        ctx.beginPath();
        ctx.arc(ion.x, ion.y, 2.8, 0, Math.PI * 2);
        if (ion.type === "na") {
          ctx.fillStyle = "#0284c7";
          ctx.fill();
        } else {
          ctx.fillStyle = "#059669";
          ctx.fill();
        }
      }

      // ─────────────────────────────────────────────────────────
      // SECTION 2: OSCILLOSCOPE MEMBRANE POTENTIAL GRAPH
      // ─────────────────────────────────────────────────────────

      const graphLeftX = 55;
      const graphRightX = w - 30;
      const graphWidth = graphRightX - graphLeftX;

      // Graph Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(graphLeftX, graphTopY, graphWidth, graphHeight);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.strokeRect(graphLeftX, graphTopY, graphWidth, graphHeight);

      // Voltage conversion helper (-90 mV to +50 mV)
      const minV = -90;
      const maxV = 50;
      const voltToY = (v: number) => {
        const clamped = Math.max(minV, Math.min(maxV, v));
        const pct = (clamped - minV) / (maxV - minV);
        return graphBottomY - pct * graphHeight;
      };

      // Grid Voltage Reference Lines
      const gridLevels = [
        { v: 35, label: "+35 mV (Peak)", color: "#10b981", dash: [2, 3] },
        { v: 0, label: "0 mV", color: "#e2e8f0", dash: [1, 2] },
        { v: -55, label: "-55 mV (Threshold)", color: "#f59e0b", dash: [3, 3] },
        { v: -70, label: "-70 mV (Resting)", color: "#94a3b8", dash: [] },
        { v: -85, label: "-85 mV (Hyperpolarization)", color: "#cbd5e1", dash: [2, 3] },
      ];

      for (const gl of gridLevels) {
        const gy = voltToY(gl.v);
        ctx.strokeStyle = gl.color;
        ctx.lineWidth = 1;
        ctx.setLineDash(gl.dash);
        ctx.beginPath();
        ctx.moveTo(graphLeftX, gy);
        ctx.lineTo(graphRightX, gy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Axis Y Label
        ctx.font = '8px "IBM Plex Mono", monospace';
        ctx.fillStyle = gl.v === -55 ? "#d97706" : "#64748b";
        ctx.fillText(`${gl.v}mV`, 15, gy + 3);
      }

      // Plot Voltage Waveform History
      if (timeHistory.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2.5;

        for (let i = 0; i < timeHistory.length; i++) {
          const pt = timeHistory[i];
          const px = graphLeftX + (i / (timeHistory.length - 1)) * graphWidth;
          const py = voltToY(pt.vm);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Optional Conductance curves (gNa, gK)
        if (showConductance) {
          // gNa (cyan)
          ctx.beginPath();
          ctx.strokeStyle = "rgba(2, 132, 199, 0.7)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 2]);
          for (let i = 0; i < timeHistory.length; i++) {
            const pt = timeHistory[i];
            const px = graphLeftX + (i / (timeHistory.length - 1)) * graphWidth;
            const py = graphBottomY - (pt.gNa / 100) * graphHeight;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // gK (emerald)
          ctx.beginPath();
          ctx.strokeStyle = "rgba(5, 150, 105, 0.7)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 2]);
          for (let i = 0; i < timeHistory.length; i++) {
            const pt = timeHistory[i];
            const px = graphLeftX + (i / (timeHistory.length - 1)) * graphWidth;
            const py = graphBottomY - (pt.gK / 100) * graphHeight;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Current Oscilloscope Scan Head (red dot)
        const curX = graphRightX;
        const curY = voltToY(vm);

        ctx.beginPath();
        ctx.arc(curX, curY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Phase Watermark in Graph
      ctx.font = 'bold 11px "IBM Plex Mono", monospace';
      ctx.fillStyle = vm > -55 ? "#2563eb" : "#64748b";
      ctx.fillText(`Phase: ${phase}`, graphLeftX + 12, graphTopY + 20);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [vm, timeHistory, phase, naGateOpen, naInactivated, kGateOpen, blocker, showConductance]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block bg-white" />

      {/* Interactive Hotspot Badges */}
      <div className="absolute top-3 right-4 z-10 hidden sm:flex items-center gap-2 bg-white/95 border border-border px-2.5 py-1.5 font-mono text-[10px] text-muted shadow-xs">
        <button
          onClick={() => onSelectObject("na-channel")}
          className="hover:text-blue-600 cursor-pointer"
        >
          Nav1.2 Channel
        </button>
        <span>·</span>
        <button
          onClick={() => onSelectObject("k-channel")}
          className="hover:text-emerald-600 cursor-pointer"
        >
          Kv1.1 Channel
        </button>
        <span>·</span>
        <button
          onClick={() => onSelectObject("nak-pump")}
          className="hover:text-purple-600 cursor-pointer"
        >
          Na⁺/K⁺ Pump
        </button>
      </div>
    </div>
  );
}
