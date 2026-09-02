"use client";

import React, { useEffect, useRef } from "react";

export default function HeroGenerativeVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    handleResize();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = () => {
      if (!prefersReduced) t += 0.012;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Fine coordinate grid
      ctx.strokeStyle = "rgba(226, 232, 240, 0.45)";
      ctx.lineWidth = 0.5;
      const step = 32;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Generative Double Helix / Dynamic Molecular Coordinate Waves
      const nodes = 38;
      const strandSpread = 45;
      const centerY = h * 0.5;
      const mouse = mouseRef.current;

      for (let i = 0; i < nodes; i++) {
        const x = (i / (nodes - 1)) * (w + 40) - 20;
        const phase = i * 0.22 + t;
        
        // Mouse perturbation
        const dx = mouse.x - x;
        const dy = mouse.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseEffect = Math.max(0, (160 - dist) / 160) * 18;

        const sinVal = Math.sin(phase);
        const cosVal = Math.cos(phase);

        const y1 = centerY + sinVal * strandSpread + (dy > 0 ? -mouseEffect : mouseEffect) * 0.4;
        const y2 = centerY - sinVal * strandSpread + (dy > 0 ? mouseEffect : -mouseEffect) * 0.4;

        // Base pair rungs (connectors with hydrogen bonding dots)
        const isSelected = Math.abs(x - mouse.x) < 40;
        ctx.beginPath();
        ctx.strokeStyle = isSelected ? "rgba(37, 99, 235, 0.4)" : "rgba(148, 163, 184, 0.25)";
        ctx.lineWidth = isSelected ? 1.5 : 1;
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();

        // Strand 1 node (Top / Phase A)
        const r1 = 3 + cosVal * 1.5;
        ctx.beginPath();
        ctx.arc(x, y1, Math.max(1.5, r1), 0, Math.PI * 2);
        ctx.fillStyle = cosVal > 0 ? "#0f172a" : "#2563eb";
        ctx.fill();

        // Strand 2 node (Bottom / Phase B)
        const r2 = 3 - cosVal * 1.5;
        ctx.beginPath();
        ctx.arc(x, y2, Math.max(1.5, r2), 0, Math.PI * 2);
        ctx.fillStyle = cosVal < 0 ? "#0f172a" : "#2563eb";
        ctx.fill();

        // Minor base code annotation on hover
        if (isSelected && i % 3 === 0) {
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillStyle = "#2563eb";
          ctx.fillText(i % 2 === 0 ? "A=T" : "G≡C", x - 8, Math.min(y1, y2) - 10);
        }
      }

      // Continuous spline for Strand 1
      ctx.beginPath();
      ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < nodes; i++) {
        const x = (i / (nodes - 1)) * (w + 40) - 20;
        const phase = i * 0.22 + t;
        const y = centerY + Math.sin(phase) * strandSpread;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Continuous spline for Strand 2
      ctx.beginPath();
      ctx.strokeStyle = "rgba(37, 99, 235, 0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < nodes; i++) {
        const x = (i / (nodes - 1)) * (w + 40) - 20;
        const phase = i * 0.22 + t;
        const y = centerY - Math.sin(phase) * strandSpread;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full h-44 md:h-52 relative overflow-hidden border-y border-border bg-gray-50/40">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-2 right-4 font-mono text-[9px] text-muted uppercase tracking-widest pointer-events-none select-none">
        Fig. 01 — Dynamic Helical / Molecular Grid [Interactive]
      </div>
      <div className="absolute bottom-2 left-4 font-mono text-[9px] text-muted flex items-center gap-3 pointer-events-none select-none">
        <span>5&apos; ── 3&apos; Polarity</span>
        <span>·</span>
        <span>Watson-Crick Pairing</span>
        <span>·</span>
        <span>10.5 bp / turn</span>
      </div>
    </div>
  );
}
