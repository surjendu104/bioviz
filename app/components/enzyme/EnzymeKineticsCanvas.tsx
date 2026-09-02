"use client";

import React, { useEffect, useRef } from "react";

interface EnzymeKineticsCanvasProps {
  substrateConc: number; // 0 to 100 uM
  enzymeConc: number; // 1 to 20 nM
  inhibitorType: "none" | "competitive" | "noncompetitive";
  plotType: "michaelis-menten" | "lineweaver-burk";
  velocity: number;
  km: number;
  vmax: number;
  apparentKm: number;
  apparentVmax: number;
  isPlaying: boolean;
  onSelectObject: (id: string) => void;
}

interface BioEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "enzyme" | "substrate" | "es_complex" | "product" | "inhibitor";
  esTimer?: number;
}

export default function EnzymeKineticsCanvas({
  substrateConc,
  enzymeConc,
  inhibitorType,
  plotType,
  velocity,
  km,
  vmax,
  apparentKm,
  apparentVmax,
  isPlaying,
  onSelectObject,
}: EnzymeKineticsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const entitiesRef = useRef<BioEntity[]>([]);

  // Initialize pool of active enzyme and substrate entities
  useEffect(() => {
    const list: BioEntity[] = [];

    // Enzymes
    const eCount = Math.round(enzymeConc * 1.5);
    for (let i = 0; i < eCount; i++) {
      list.push({
        x: Math.random() * 260 + 20,
        y: Math.random() * 180 + 30,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        type: "enzyme",
      });
    }

    // Substrates
    const sCount = Math.round(substrateConc * 0.75);
    for (let i = 0; i < sCount; i++) {
      list.push({
        x: Math.random() * 280 + 10,
        y: Math.random() * 200 + 20,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        type: "substrate",
      });
    }

    // Inhibitors if active
    if (inhibitorType !== "none") {
      for (let i = 0; i < 15; i++) {
        list.push({
          x: Math.random() * 280 + 10,
          y: Math.random() * 200 + 20,
          vx: (Math.random() - 0.5) * 1.0,
          vy: (Math.random() - 0.5) * 1.0,
          type: "inhibitor",
        });
      }
    }

    entitiesRef.current = list;
  }, [substrateConc, enzymeConc, inhibitorType]);

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

      // Split layout:
      // Left 45%: Microscopic Reaction Solution Chamber
      // Right 55%: Real-time Kinetic Graph (Michaelis-Menten or Lineweaver-Burk)
      const chamberWidth = Math.min(w * 0.44, 380);
      const graphLeft = chamberWidth + 20;
      const graphWidth = w - graphLeft - 25;
      const graphTop = 30;
      const graphBottom = h - 45;
      const graphHeight = graphBottom - graphTop;

      // ─────────────────────────────────────────────────────────
      // SECTION 1: MICRO-SOLUTION REACTION CHAMBER (LEFT)
      // ─────────────────────────────────────────────────────────

      ctx.fillStyle = "rgba(248, 250, 252, 0.6)";
      ctx.fillRect(15, 20, chamberWidth - 15, h - 40);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(15, 20, chamberWidth - 15, h - 40);

      // Header
      ctx.font = 'bold 10px "IBM Plex Mono", monospace';
      ctx.fillStyle = "#0f172a";
      ctx.fillText("Catalytic Micro-Chamber", 25, 38);
      ctx.font = '9px "IBM Plex Mono", monospace';
      ctx.fillStyle = "#64748b";
      ctx.fillText(`[S]=${substrateConc}μM · [E]=${enzymeConc}nM`, 25, 52);

      // Entities Simulation
      const entities = entitiesRef.current;
      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        if (isPlaying) {
          ent.x += ent.vx;
          ent.y += ent.vy;

          if (ent.x < 25) { ent.x = 25; ent.vx *= -1; }
          if (ent.x > chamberWidth - 10) { ent.x = chamberWidth - 10; ent.vx *= -1; }
          if (ent.y < 65) { ent.y = 65; ent.vy *= -1; }
          if (ent.y > h - 30) { ent.y = h - 30; ent.vy *= -1; }

          // Catalytic conversion cycle for ES complexes
          if (ent.type === "es_complex") {
            ent.esTimer = (ent.esTimer || 0) + 1;
            if (ent.esTimer > 30) {
              ent.type = "enzyme";
              ent.esTimer = 0;
            }
          }
        }

        // Render Entity
        if (ent.type === "enzyme") {
          // Free Apoenzyme (C-shaped active pocket)
          ctx.beginPath();
          ctx.arc(ent.x, ent.y, 8, 0.4, Math.PI * 1.8);
          ctx.strokeStyle = "#059669";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = "rgba(5, 150, 105, 0.25)";
          ctx.fill();
        } else if (ent.type === "es_complex") {
          // ES Complex (Substrate lodged in active site)
          ctx.beginPath();
          ctx.arc(ent.x, ent.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = "#059669";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ent.x, ent.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#2563eb";
          ctx.fill();
        } else if (ent.type === "substrate") {
          // Substrate Monomer (Blue disc)
          ctx.beginPath();
          ctx.arc(ent.x, ent.y, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = "#2563eb";
          ctx.fill();
        } else if (ent.type === "inhibitor") {
          // Inhibitor (Red triangle)
          ctx.beginPath();
          ctx.moveTo(ent.x, ent.y - 4);
          ctx.lineTo(ent.x + 4, ent.y + 4);
          ctx.lineTo(ent.x - 4, ent.y + 4);
          ctx.closePath();
          ctx.fillStyle = "#dc2626";
          ctx.fill();
        }
      }

      // ─────────────────────────────────────────────────────────
      // SECTION 2: KINETIC HYPERBOLIC PLOT (RIGHT)
      // ─────────────────────────────────────────────────────────

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(graphLeft, graphTop, graphWidth, graphHeight);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.strokeRect(graphLeft, graphTop, graphWidth, graphHeight);

      if (plotType === "michaelis-menten") {
        // Michaelis-Menten Hyperbolic Curve: v = (Vmax * [S]) / (Km + [S])
        const maxPlotS = 100;
        const maxPlotV = vmax * 1.35;

        const sToX = (s: number) => graphLeft + (s / maxPlotS) * graphWidth;
        const vToY = (v: number) => graphBottom - (v / maxPlotV) * graphHeight;

        // Grid lines
        // Vmax Asymptote
        const vmaxY = vToY(apparentVmax);
        ctx.beginPath();
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(graphLeft, vmaxY);
        ctx.lineTo(graphLeft + graphWidth, vmaxY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#64748b";
        ctx.fillText(`Vmax = ${apparentVmax.toFixed(1)} μM/min`, graphLeft + 8, vmaxY - 5);

        // Vmax / 2 line
        const halfVmaxY = vToY(apparentVmax / 2);
        ctx.beginPath();
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.moveTo(graphLeft, halfVmaxY);
        ctx.lineTo(graphLeft + graphWidth, halfVmaxY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillText(`Vmax/2`, graphLeft + 8, halfVmaxY - 3);

        // Km Dropline
        const kmX = sToX(apparentKm);
        ctx.beginPath();
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(kmX, halfVmaxY);
        ctx.lineTo(kmX, graphBottom);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#d97706";
        ctx.fillText(`Km=${apparentKm.toFixed(1)}μM`, kmX - 18, graphBottom + 14);

        // Control Curve (None / Uninhibited) if inhibitor is active
        if (inhibitorType !== "none") {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 2]);
          for (let s = 0; s <= maxPlotS; s += 1) {
            const v = (vmax * s) / (km + s);
            const px = sToX(s);
            const py = vToY(v);
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Active Hyperbolic Curve
        ctx.beginPath();
        ctx.strokeStyle = inhibitorType !== "none" ? "#dc2626" : "#059669";
        ctx.lineWidth = 2.8;

        for (let s = 0; s <= maxPlotS; s += 0.5) {
          const v = (apparentVmax * s) / (apparentKm + s);
          const px = sToX(s);
          const py = vToY(v);
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Current Operating Point Marker
        const curPtX = sToX(substrateConc);
        const curPtY = vToY(velocity);

        // Crosshairs
        ctx.beginPath();
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.moveTo(curPtX, graphBottom);
        ctx.lineTo(curPtX, curPtY);
        ctx.lineTo(graphLeft, curPtY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Disc dot
        ctx.beginPath();
        ctx.arc(curPtX, curPtY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#2563eb";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Velocity & Substrate Label
        ctx.font = 'bold 10px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#2563eb";
        ctx.fillText(`v₀ = ${velocity.toFixed(2)} μM/min`, curPtX + 8, curPtY - 8);

        // Axis Titles
        ctx.font = 'bold 9px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#0f172a";
        ctx.fillText("Initial Velocity (v₀) [μM/min]", graphLeft + 10, graphTop + 14);
        ctx.fillText("Substrate Concentration [S] (μM)", graphLeft + graphWidth - 180, graphBottom - 8);
      } else {
        // Lineweaver-Burk Double Reciprocal: 1/v = (Km/Vmax)(1/[S]) + 1/Vmax
        ctx.font = 'bold 10px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#0f172a";
        ctx.fillText("Lineweaver-Burk Double Reciprocal Plot (1/v vs 1/[S])", graphLeft + 15, graphTop + 20);

        // Y-axis = 1/Vmax, X-intercept = -1/Km
        const yIntY = graphBottom - (1 / apparentVmax) * 220;
        ctx.beginPath();
        ctx.strokeStyle = "#059669";
        ctx.lineWidth = 2.5;
        ctx.moveTo(graphLeft + 30, yIntY + 40);
        ctx.lineTo(graphLeft + graphWidth - 20, yIntY - 80);
        ctx.stroke();

        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#059669";
        ctx.fillText(`Y-intercept = 1/Vmax (${(1 / apparentVmax).toFixed(3)})`, graphLeft + 45, yIntY - 10);
        ctx.fillText(`Slope = Km / Vmax (${(apparentKm / apparentVmax).toFixed(2)})`, graphLeft + 160, yIntY - 45);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [substrateConc, enzymeConc, inhibitorType, plotType, velocity, km, vmax, apparentKm, apparentVmax, isPlaying]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block bg-white" />

      {/* Quick Component Inspector Buttons */}
      <div className="absolute top-3 right-4 z-10 hidden sm:flex items-center gap-2 bg-white/95 border border-border px-2.5 py-1.5 font-mono text-[10px] text-muted shadow-xs">
        <button
          onClick={() => onSelectObject("apoenzyme")}
          className="hover:text-emerald-700 cursor-pointer"
        >
          Free Enzyme (E)
        </button>
        <span>·</span>
        <button
          onClick={() => onSelectObject("es-complex")}
          className="hover:text-blue-700 cursor-pointer"
        >
          ES Complex
        </button>
        <span>·</span>
        <button
          onClick={() => onSelectObject("michaelis-menten-plot")}
          className="hover:text-foreground cursor-pointer"
        >
          Kinetic Equation
        </button>
      </div>
    </div>
  );
}
