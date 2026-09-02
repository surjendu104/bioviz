"use client";

import React, { useEffect, useRef } from "react";

interface OsmosisCanvasProps {
  leftSoluteConc: number; // Molar (0 to 1.0)
  rightSoluteConc: number; // Molar (0 to 1.0)
  permeabilityMode: "selective" | "impermeable" | "pore-open";
  temperatureK: number; // 273 to 320
  isPlaying: boolean;
  onSelectObject: (objId: string) => void;
  showVectors: boolean;
  showLabels: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "water" | "solute";
  chamber: "left" | "right";
  radius: number;
}

export default function OsmosisCanvas({
  leftSoluteConc,
  rightSoluteConc,
  permeabilityMode,
  temperatureK,
  isPlaying,
  onSelectObject,
  showVectors,
  showLabels,
}: OsmosisCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const waterLevelLeftRef = useRef<number>(140);
  const waterLevelRightRef = useRef<number>(140);

  // Initialize and update particle pool when concentrations change
  useEffect(() => {
    const particles: Particle[] = [];
    const baseWaterCount = 70;

    // Water particles in left chamber
    for (let i = 0; i < baseWaterCount; i++) {
      particles.push({
        x: Math.random() * 220 + 40,
        y: Math.random() * 260 + 160,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        type: "water",
        chamber: "left",
        radius: 3,
      });
    }

    // Water particles in right chamber
    for (let i = 0; i < baseWaterCount; i++) {
      particles.push({
        x: Math.random() * 220 + 340,
        y: Math.random() * 260 + 160,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        type: "water",
        chamber: "right",
        radius: 3,
      });
    }

    // Solute in left chamber
    const leftSoluteCount = Math.round(leftSoluteConc * 50);
    for (let i = 0; i < leftSoluteCount; i++) {
      particles.push({
        x: Math.random() * 200 + 50,
        y: Math.random() * 240 + 170,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        type: "solute",
        chamber: "left",
        radius: 6.5,
      });
    }

    // Solute in right chamber
    const rightSoluteCount = Math.round(rightSoluteConc * 50);
    for (let i = 0; i < rightSoluteCount; i++) {
      particles.push({
        x: Math.random() * 200 + 350,
        y: Math.random() * 240 + 170,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        type: "solute",
        chamber: "right",
        radius: 6.5,
      });
    }

    particlesRef.current = particles;
  }, [leftSoluteConc, rightSoluteConc]);

  // Main Animation Loop
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

      // Coordinate mapping constants
      const midX = w * 0.5;
      const leftWall = Math.max(30, midX - 260);
      const rightWall = Math.min(w - 30, midX + 260);
      const floorY = h - 60;
      const baseTopY = 80;

      // Compute target equilibrium water levels from osmotic pressure head
      // ΔC = right - left
      const deltaC = rightSoluteConc - leftSoluteConc;
      const maxHeadShift = 65;
      const targetLeftLevel = baseTopY + 70 + (deltaC * maxHeadShift);
      const targetRightLevel = baseTopY + 70 - (deltaC * maxHeadShift);

      if (isPlaying) {
        // Smoothly approach equilibrium height head
        waterLevelLeftRef.current += (targetLeftLevel - waterLevelLeftRef.current) * 0.02;
        waterLevelRightRef.current += (targetRightLevel - waterLevelRightRef.current) * 0.02;
      }

      const curLeftTop = waterLevelLeftRef.current;
      const curRightTop = waterLevelRightRef.current;

      // 1. Draw Liquid Chamber Fills
      // Left chamber
      const leftGrad = ctx.createLinearGradient(0, curLeftTop, 0, floorY);
      leftGrad.addColorStop(0, "rgba(224, 242, 254, 0.45)");
      leftGrad.addColorStop(1, "rgba(186, 230, 253, 0.75)");
      ctx.fillStyle = leftGrad;
      ctx.fillRect(leftWall, curLeftTop, midX - leftWall, floorY - curLeftTop);

      // Right chamber
      const rightGrad = ctx.createLinearGradient(0, curRightTop, 0, floorY);
      rightGrad.addColorStop(0, "rgba(219, 234, 254, 0.5)");
      rightGrad.addColorStop(1, "rgba(147, 197, 253, 0.85)");
      ctx.fillStyle = rightGrad;
      ctx.fillRect(midX, curRightTop, rightWall - midX, floorY - curRightTop);

      // 2. Draw Glass U-Tube Apparatus Outer Boundaries
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Left vertical wall
      ctx.moveTo(leftWall, baseTopY - 20);
      ctx.lineTo(leftWall, floorY);
      // Floor
      ctx.lineTo(rightWall, floorY);
      // Right vertical wall
      ctx.lineTo(rightWall, baseTopY - 20);
      ctx.stroke();

      // Meniscus lines
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftWall, curLeftTop);
      ctx.lineTo(midX, curLeftTop);
      ctx.moveTo(midX, curRightTop);
      ctx.lineTo(rightWall, curRightTop);
      ctx.stroke();

      // 3. Draw Semipermeable Membrane Barrier with Aquaporin Channels
      const memThick = 16;
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(midX - memThick * 0.5, curRightTop - 20, memThick, floorY - (curRightTop - 20));

      // Aquaporin Pores in membrane
      const pores = [
        Math.max(curLeftTop, curRightTop) + 30,
        Math.max(curLeftTop, curRightTop) + 75,
        Math.max(curLeftTop, curRightTop) + 120,
        Math.max(curLeftTop, curRightTop) + 165,
      ].filter((py) => py < floorY - 20);

      for (const py of pores) {
        ctx.fillStyle = permeabilityMode === "impermeable" ? "#475569" : "#059669";
        ctx.fillRect(midX - memThick * 0.5 - 2, py - 6, memThick + 4, 12);
        // Pore channel interior
        ctx.fillStyle = "#ecfdf5";
        ctx.fillRect(midX - memThick * 0.5, py - 2.5, memThick, 5);
      }

      // 4. Update and Render Particles
      const particles = particlesRef.current;
      const speedMult = (temperatureK / 295) * (isPlaying ? 1 : 0.05);

      for (const p of particles) {
        // Motion step
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        const isLeft = p.x < midX;
        const curTop = isLeft ? curLeftTop : curRightTop;

        // Chamber floor and top bounds
        if (p.y > floorY - p.radius - 2) {
          p.y = floorY - p.radius - 2;
          p.vy *= -1;
        }
        if (p.y < curTop + p.radius + 2) {
          p.y = curTop + p.radius + 2;
          p.vy *= -1;
        }

        // Left/Right outer walls
        if (p.x < leftWall + p.radius + 2) {
          p.x = leftWall + p.radius + 2;
          p.vx *= -1;
        }
        if (p.x > rightWall - p.radius - 2) {
          p.x = rightWall - p.radius - 2;
          p.vx *= -1;
        }

        // Membrane interaction (at midX)
        if (p.type === "solute") {
          // Solute is strictly impermeable unless mode is pore-open
          if (permeabilityMode !== "pore-open") {
            if (isLeft && p.x > midX - memThick * 0.5 - p.radius) {
              p.x = midX - memThick * 0.5 - p.radius;
              p.vx = -Math.abs(p.vx);
            } else if (!isLeft && p.x < midX + memThick * 0.5 + p.radius) {
              p.x = midX + memThick * 0.5 + p.radius;
              p.vx = Math.abs(p.vx);
            }
          }
        } else {
          // Water molecule: checks if aligned with pore or crosses membrane
          if (permeabilityMode === "impermeable") {
            if (isLeft && p.x > midX - memThick * 0.5 - p.radius) {
              p.x = midX - memThick * 0.5 - p.radius;
              p.vx = -Math.abs(p.vx);
            } else if (!isLeft && p.x < midX + memThick * 0.5 + p.radius) {
              p.x = midX + memThick * 0.5 + p.radius;
              p.vx = Math.abs(p.vx);
            }
          } else {
            // Net directional osmotic bias towards higher solute concentration
            const osmoticBias = (rightSoluteConc - leftSoluteConc) * 0.035;
            p.vx += osmoticBias;

            // Check if passing through pore channel or bouncing
            const inPoreY = pores.some((py) => Math.abs(p.y - py) < 8);
            if (!inPoreY) {
              if (isLeft && p.x > midX - memThick * 0.5 - p.radius && p.x < midX) {
                p.x = midX - memThick * 0.5 - p.radius;
                p.vx = -Math.abs(p.vx);
              } else if (!isLeft && p.x < midX + memThick * 0.5 + p.radius && p.x > midX) {
                p.x = midX + memThick * 0.5 + p.radius;
                p.vx = Math.abs(p.vx);
              }
            }
          }
        }

        // Render Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.type === "water") {
          ctx.fillStyle = "#0284c7";
          ctx.fill();
        } else {
          ctx.fillStyle = "#d97706";
          ctx.fill();
          ctx.strokeStyle = "#92400e";
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Solute inner symbol
          ctx.fillStyle = "#ffffff";
          ctx.font = 'bold 7px "IBM Plex Mono", monospace';
          ctx.fillText("S", p.x - 2.5, p.y + 2.5);
        }
      }

      // 5. Hydrostatic Pressure Head Indicator (Δh)
      if (Math.abs(curLeftTop - curRightTop) > 6) {
        const topLevel = Math.min(curLeftTop, curRightTop);
        const botLevel = Math.max(curLeftTop, curRightTop);
        const headX = rightWall + 18;

        ctx.strokeStyle = "#dc2626";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(headX, topLevel);
        ctx.lineTo(headX, botLevel);
        ctx.stroke();

        // Arrow ticks
        ctx.beginPath();
        ctx.moveTo(headX - 4, topLevel);
        ctx.lineTo(headX + 4, topLevel);
        ctx.moveTo(headX - 4, botLevel);
        ctx.lineTo(headX + 4, botLevel);
        ctx.stroke();

        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#dc2626";
        ctx.fillText(`Δh (Osmotic Head)`, headX + 8, (topLevel + botLevel) * 0.5 + 3);
      }

      // 6. Net Osmotic Flux Vector
      if (showVectors && Math.abs(deltaC) > 0.05) {
        const arrowDir = deltaC > 0 ? 1 : -1;
        const arrowStartX = midX - arrowDir * 35;
        const arrowEndX = midX + arrowDir * 35;
        const arrowY = floorY - 30;

        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(arrowStartX, arrowY);
        ctx.lineTo(arrowEndX, arrowY);
        ctx.stroke();

        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.moveTo(arrowEndX, arrowY - 5);
        ctx.lineTo(arrowEndX + arrowDir * 8, arrowY);
        ctx.lineTo(arrowEndX, arrowY + 5);
        ctx.fill();

        ctx.font = 'bold 10px "IBM Plex Mono", monospace';
        ctx.fillText("Net H₂O Flux (Jv)", midX - 45, arrowY - 10);
      }

      // 7. Labels & Chamber Concentrations
      if (showLabels) {
        // Left Chamber Header
        ctx.font = 'bold 11px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#0f172a";
        ctx.fillText(`CHAMBER A (Left)`, leftWall + 10, baseTopY - 2);
        ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#64748b";
        ctx.fillText(`[Solute] = ${leftSoluteConc.toFixed(2)} M`, leftWall + 10, baseTopY + 14);

        // Right Chamber Header
        ctx.font = 'bold 11px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#0f172a";
        ctx.fillText(`CHAMBER B (Right)`, rightWall - 140, baseTopY - 2);
        ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#64748b";
        ctx.fillText(`[Solute] = ${rightSoluteConc.toFixed(2)} M`, rightWall - 140, baseTopY + 14);

        // Membrane Tag
        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#059669";
        ctx.fillText(`Aquaporin Pores`, midX - 38, baseTopY - 2);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [leftSoluteConc, rightSoluteConc, permeabilityMode, temperatureK, isPlaying, showVectors, showLabels]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block bg-slate-50/40" />

      {/* Floating Legend / Clickable Hotspots */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-4 bg-white/95 backdrop-blur-xs border border-border px-3 py-2 font-mono text-[10px] text-muted shadow-xs">
        <button
          onClick={() => onSelectObject("water-molecule")}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          <span>Water (Solvent)</span>
        </button>
        <button
          onClick={() => onSelectObject("solute-particle")}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
          <span>Solute (Sucrose)</span>
        </button>
        <button
          onClick={() => onSelectObject("aquaporin")}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="w-3 h-2 bg-emerald-600 inline-block" />
          <span>Aquaporin Pore</span>
        </button>
        <button
          onClick={() => onSelectObject("osmotic-pressure")}
          className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
        >
          <span className="text-red-600 font-bold">Δh</span>
          <span>Osmotic Pressure (Π)</span>
        </button>
      </div>
    </div>
  );
}
