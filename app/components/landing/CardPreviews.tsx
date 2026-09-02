"use client";

import React, { useEffect, useRef } from "react";

export function DNAStructurePreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.025;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "rgba(226, 232, 240, 0.4)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      const centerY = h * 0.5;
      const amplitude = 32;
      const basePairs = 18;

      // Draw Base Pair Rungs & Hydrogen Bond Points
      for (let i = 0; i < basePairs; i++) {
        const x = 15 + (i / (basePairs - 1)) * (w - 30);
        const phase = i * 0.45 + t;
        const sinVal = Math.sin(phase);
        const cosVal = Math.cos(phase);

        const yTop = centerY + sinVal * amplitude;
        const yBot = centerY - sinVal * amplitude;

        // Base pair connector rung
        ctx.beginPath();
        ctx.strokeStyle = cosVal > 0 ? "rgba(37, 99, 235, 0.7)" : "rgba(100, 116, 139, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yBot);
        ctx.stroke();

        // Hydrogen bonding dots at midpoint
        const midY = (yTop + yBot) * 0.5;
        ctx.beginPath();
        ctx.arc(x, midY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#059669" : "#2563eb";
        ctx.fill();

        // Backbone Strand Nodes (Top & Bottom)
        ctx.beginPath();
        ctx.arc(x, yTop, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = cosVal > 0 ? "#0f172a" : "#475569";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, yBot, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = cosVal < 0 ? "#0f172a" : "#475569";
        ctx.fill();
      }

      // Smooth Continuous Backbone Ribbons (Strand 1 & Strand 2)
      ctx.beginPath();
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      for (let i = 0; i < basePairs; i++) {
        const x = 15 + (i / (basePairs - 1)) * (w - 30);
        const phase = i * 0.45 + t;
        const yTop = centerY + Math.sin(phase) * amplitude;
        if (i === 0) ctx.moveTo(x, yTop);
        else ctx.lineTo(x, yTop);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      for (let i = 0; i < basePairs; i++) {
        const x = 15 + (i / (basePairs - 1)) * (w - 30);
        const phase = i * 0.45 + t;
        const yBot = centerY - Math.sin(phase) * amplitude;
        if (i === 0) ctx.moveTo(x, yBot);
        else ctx.lineTo(x, yBot);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={280} height={110} className="w-full h-full bg-slate-50/60" />;
}

export function DNAPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background subtle grid
      ctx.strokeStyle = "rgba(226, 232, 240, 0.4)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Fork position oscillating smoothly
      const forkX = w * 0.48 + Math.sin(t * 0.6) * 18;

      // Top Parental Strand
      ctx.beginPath();
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      ctx.moveTo(10, h * 0.22);
      ctx.bezierCurveTo(forkX - 40, h * 0.22, forkX - 20, h * 0.45, forkX, h * 0.5);
      ctx.lineTo(w - 10, h * 0.5);
      ctx.stroke();

      // Bottom Parental Strand
      ctx.beginPath();
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      ctx.moveTo(10, h * 0.78);
      ctx.bezierCurveTo(forkX - 40, h * 0.78, forkX - 20, h * 0.55, forkX, h * 0.5);
      ctx.lineTo(w - 10, h * 0.5);
      ctx.stroke();

      // Leading Daughter Strand (Blue)
      ctx.beginPath();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 2]);
      ctx.moveTo(20, h * 0.33);
      ctx.lineTo(forkX - 25, h * 0.33);
      ctx.stroke();
      ctx.setLineDash([]);

      // Lagging Okazaki Fragments (Blue & Pink Primer)
      const fragOffset = ((t * 18) % (forkX - 55));
      const fragX = 20 + fragOffset;
      ctx.beginPath();
      ctx.strokeStyle = "#db2777";
      ctx.lineWidth = 2;
      ctx.moveTo(fragX + 24, h * 0.67);
      ctx.lineTo(fragX + 12, h * 0.67);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.moveTo(fragX + 12, h * 0.67);
      ctx.lineTo(fragX, h * 0.67);
      ctx.stroke();

      // Helicase Hexamer at Fork
      ctx.beginPath();
      ctx.arc(forkX - 5, h * 0.5, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#d97706";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Polymerase Leading
      ctx.beginPath();
      ctx.rect(forkX - 32, h * 0.33 - 5, 10, 10);
      ctx.fillStyle = "#059669";
      ctx.fill();

      // Base pair rungs
      for (let bx = forkX + 12; bx < w - 12; bx += 14) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(100, 116, 139, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.moveTo(bx, h * 0.5 - 5);
        ctx.lineTo(bx, h * 0.5 + 5);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={280} height={110} className="w-full h-full bg-slate-50/60" />;
}

export function OsmosisPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    interface P { x: number; y: number; vx: number; vy: number; type: "water" | "solute" }
    const particles: P[] = [];
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * 120 + 10,
        y: Math.random() * 70 + 20,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        type: "water"
      });
    }
    for (let i = 0; i < 18; i++) {
      particles.push({
        x: Math.random() * 105 + 155,
        y: Math.random() * 65 + 25,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        type: "solute"
      });
    }

    const render = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const memX = w * 0.5;

      // Chamber borders
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 12, w - 20, h - 24);

      // Water levels
      const leftH = 26 + Math.sin(t) * 2;
      const rightH = 14 - Math.sin(t) * 2;

      // Left chamber fill (Hypotonic)
      ctx.fillStyle = "rgba(186, 230, 253, 0.3)";
      ctx.fillRect(10, leftH, memX - 10, h - 12 - leftH);

      // Right chamber fill (Hypertonic)
      ctx.fillStyle = "rgba(147, 197, 253, 0.45)";
      ctx.fillRect(memX, rightH, w - 10 - memX, h - 12 - rightH);

      // Semipermeable membrane
      ctx.beginPath();
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.moveTo(memX, 12);
      ctx.lineTo(memX, h - 12);
      ctx.stroke();
      ctx.setLineDash([]);

      // Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === "water") {
          if (p.x < 15) { p.x = 15; p.vx *= -1; }
          if (p.x > w - 15) { p.x = w - 15; p.vx *= -1; }
          if (p.y < 20) { p.y = 20; p.vy *= -1; }
          if (p.y > h - 18) { p.y = h - 18; p.vy *= -1; }

          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#0284c7";
          ctx.fill();
        } else {
          // Solute in right chamber
          if (p.x < memX + 7) { p.x = memX + 7; p.vx *= -1; }
          if (p.x > w - 15) { p.x = w - 15; p.vx *= -1; }
          if (p.y < 20) { p.y = 20; p.vy *= -1; }
          if (p.y > h - 18) { p.y = h - 18; p.vy *= -1; }

          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#d97706";
          ctx.fill();
          ctx.strokeStyle = "#92400e";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Net Flux Arrow
      ctx.beginPath();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 1.5;
      ctx.moveTo(memX - 12, h * 0.5);
      ctx.lineTo(memX + 12, h * 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = "#2563eb";
      ctx.moveTo(memX + 12, h * 0.5 - 3);
      ctx.lineTo(memX + 18, h * 0.5);
      ctx.lineTo(memX + 12, h * 0.5 + 3);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={280} height={110} className="w-full h-full bg-slate-50/60" />;
}

export function ActionPotentialPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "rgba(226, 232, 240, 0.6)";
      ctx.lineWidth = 0.5;
      for (let y = 15; y < h; y += 18) {
        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(w - 10, y);
        ctx.stroke();
      }

      // Threshold line (-55 mV)
      ctx.beginPath();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.moveTo(15, h * 0.58);
      ctx.lineTo(w - 15, h * 0.58);
      ctx.stroke();
      ctx.setLineDash([]);

      // Resting line (-70 mV)
      ctx.beginPath();
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.moveTo(15, h * 0.74);
      ctx.lineTo(w - 15, h * 0.74);
      ctx.stroke();

      // Action Potential Waveform
      ctx.beginPath();
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2.2;

      ctx.moveTo(20, h * 0.74);
      ctx.lineTo(55, h * 0.74);
      ctx.lineTo(75, h * 0.58);
      ctx.bezierCurveTo(85, h * 0.38, 95, h * 0.16, 105, h * 0.16);
      ctx.bezierCurveTo(115, h * 0.16, 125, h * 0.84, 140, h * 0.86);
      ctx.bezierCurveTo(155, h * 0.86, 170, h * 0.74, 195, h * 0.74);
      ctx.lineTo(w - 20, h * 0.74);
      ctx.stroke();

      // Scan marker
      const cycle = (t % 3.5) / 3.5;
      const scanX = 20 + cycle * (w - 40);
      let scanY = h * 0.74;
      if (scanX >= 55 && scanX < 75) scanY = h * 0.74 - ((scanX - 55) / 20) * (h * 0.16);
      else if (scanX >= 75 && scanX < 105) scanY = h * 0.58 - ((scanX - 75) / 30) * (h * 0.42);
      else if (scanX >= 105 && scanX < 140) scanY = h * 0.16 + ((scanX - 105) / 35) * (h * 0.70);
      else if (scanX >= 140 && scanX < 195) scanY = h * 0.86 - ((scanX - 140) / 55) * (h * 0.12);

      ctx.beginPath();
      ctx.arc(scanX, scanY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Voltage text
      ctx.fillStyle = scanY < h * 0.3 ? "#059669" : "#64748b";
      ctx.font = '8px "IBM Plex Mono", monospace';
      ctx.fillText(scanY < h * 0.3 ? "+35 mV" : "-70 mV", w - 60, 20);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={280} height={110} className="w-full h-full bg-slate-50/60" />;
}

export function EnzymePreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Axes
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(30, 12);
      ctx.lineTo(30, h - 20);
      ctx.lineTo(w - 15, h - 20);
      ctx.stroke();

      // Vmax asymptote
      ctx.beginPath();
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.moveTo(30, 22);
      ctx.lineTo(w - 15, 22);
      ctx.stroke();
      ctx.setLineDash([]);

      // Curve
      ctx.beginPath();
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 2.2;

      const Vmax = h - 42;
      const Km = 35;
      for (let sx = 0; sx <= w - 50; sx += 2) {
        const v = (Vmax * sx) / (Km + sx);
        const plotX = 30 + sx;
        const plotY = (h - 20) - v;
        if (sx === 0) ctx.moveTo(plotX, plotY);
        else ctx.lineTo(plotX, plotY);
      }
      ctx.stroke();

      // Operating point
      const curS = (Math.sin(t) * 0.5 + 0.5) * (w - 65);
      const curV = (Vmax * curS) / (Km + curS);
      const ptX = 30 + curS;
      const ptY = (h - 20) - curV;

      ctx.beginPath();
      ctx.arc(ptX, ptY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#2563eb";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Labels
      ctx.font = '8px "IBM Plex Mono", monospace';
      ctx.fillStyle = "#64748b";
      ctx.fillText("Vmax", 8, 24);
      ctx.fillText("[S]", w - 24, h - 8);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={280} height={110} className="w-full h-full bg-slate-50/60" />;
}

export function ProteinPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.025;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // mRNA tape
      ctx.beginPath();
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      ctx.moveTo(10, h * 0.72);
      ctx.lineTo(w - 10, h * 0.72);
      ctx.stroke();

      // Codon triplets
      const codonShift = (t * 14) % 32;
      for (let x = 12 - codonShift; x < w - 10; x += 32) {
        ctx.beginPath();
        ctx.fillStyle = "#64748b";
        ctx.fillRect(x, h * 0.72 - 4, 26, 3);
      }

      // Ribosome Large Subunit
      const riboX = w * 0.5;
      ctx.beginPath();
      ctx.arc(riboX, h * 0.46, 24, Math.PI, 0);
      ctx.fillStyle = "rgba(147, 51, 234, 0.85)";
      ctx.fill();

      // Small Subunit
      ctx.beginPath();
      ctx.roundRect(riboX - 24, h * 0.66, 48, 12, 3);
      ctx.fillStyle = "rgba(147, 51, 234, 0.65)";
      ctx.fill();

      // tRNAs
      ctx.beginPath();
      ctx.fillStyle = "#059669";
      ctx.fillRect(riboX - 10, h * 0.44, 7, 18);
      ctx.fillStyle = "#2563eb";
      ctx.fillRect(riboX + 3, h * 0.44, 7, 18);

      // Growing peptide
      for (let i = 0; i < 4; i++) {
        const bx = riboX - 8 - i * 8;
        const by = h * 0.32 - Math.sin(t + i) * 4 - i * 3;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#f59e0b";
        ctx.fill();
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} width={280} height={110} className="w-full h-full bg-slate-50/60" />;
}

export function MitosisPreview() {
  return (
    <div className="w-full h-full bg-slate-50/60 flex items-center justify-center p-3">
      <svg viewBox="0 0 240 90" className="w-full h-auto">
        <ellipse cx="120" cy="45" rx="85" ry="34" fill="none" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx="45" cy="45" r="4.5" fill="#4f46e5" />
        <circle cx="195" cy="45" r="4.5" fill="#4f46e5" />
        <line x1="45" y1="45" x2="110" y2="32" stroke="#818cf8" strokeWidth="1" />
        <line x1="45" y1="45" x2="110" y2="45" stroke="#818cf8" strokeWidth="1" />
        <line x1="45" y1="45" x2="110" y2="58" stroke="#818cf8" strokeWidth="1" />
        <line x1="195" y1="45" x2="130" y2="32" stroke="#818cf8" strokeWidth="1" />
        <line x1="195" y1="45" x2="130" y2="45" stroke="#818cf8" strokeWidth="1" />
        <line x1="195" y1="45" x2="130" y2="58" stroke="#818cf8" strokeWidth="1" />
        <rect x="112" y="26" width="6" height="12" rx="1.5" fill="#dc2626" />
        <rect x="122" y="26" width="6" height="12" rx="1.5" fill="#2563eb" />
        <rect x="112" y="39" width="6" height="12" rx="1.5" fill="#dc2626" />
        <rect x="122" y="39" width="6" height="12" rx="1.5" fill="#2563eb" />
        <rect x="112" y="52" width="6" height="12" rx="1.5" fill="#dc2626" />
        <rect x="122" y="52" width="6" height="12" rx="1.5" fill="#2563eb" />
      </svg>
    </div>
  );
}

export function PhotosynthesisPreview() {
  return (
    <div className="w-full h-full bg-slate-50/60 flex items-center justify-center p-3">
      <svg viewBox="0 0 240 90" className="w-full h-auto">
        <path d="M 20 65 L 60 25 L 120 50 L 160 15 L 220 30" fill="none" stroke="#16a34a" strokeWidth="2" />
        <circle cx="60" cy="25" r="5" fill="#eab308" />
        <text x="60" y="15" fill="#ca8a04" textAnchor="middle" className="font-mono text-[8px] font-bold">PSII (P680)</text>
        <circle cx="160" cy="15" r="5" fill="#eab308" />
        <text x="160" y="8" fill="#ca8a04" textAnchor="middle" className="font-mono text-[8px] font-bold">PSI (P700)</text>
        <path d="M 20 75 Q 120 75 220 75" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <text x="120" y="86" fill="#64748b" textAnchor="middle" className="font-mono text-[7px]">Thylakoid Membrane H⁺</text>
      </svg>
    </div>
  );
}

export function RespirationPreview() {
  return (
    <div className="w-full h-full bg-slate-50/60 flex items-center justify-center p-3">
      <svg viewBox="0 0 240 90" className="w-full h-auto">
        <rect x="25" y="30" width="30" height="35" rx="3" fill="#ea580c" opacity="0.85" />
        <text x="40" y="52" fill="#fff" textAnchor="middle" className="font-mono text-[9px] font-bold">I</text>
        <rect x="75" y="38" width="28" height="27" rx="3" fill="#ea580c" opacity="0.7" />
        <text x="89" y="55" fill="#fff" textAnchor="middle" className="font-mono text-[9px] font-bold">II</text>
        <rect x="120" y="30" width="30" height="35" rx="3" fill="#ea580c" opacity="0.85" />
        <text x="135" y="52" fill="#fff" textAnchor="middle" className="font-mono text-[9px] font-bold">III</text>
        <rect x="170" y="30" width="30" height="35" rx="3" fill="#ea580c" opacity="0.85" />
        <text x="185" y="52" fill="#fff" textAnchor="middle" className="font-mono text-[9px] font-bold">IV</text>
        <path d="M 10 20 L 230 20" stroke="#cbd5e1" strokeWidth="1.5" />
        <path d="M 10 70 L 230 70" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="120" y="14" fill="#0284c7" textAnchor="middle" className="font-mono text-[7px] font-semibold">High [H⁺] Intermembrane Space</text>
      </svg>
    </div>
  );
}

export function GenericPreview({ previewType }: { previewType: string }) {
  switch (previewType) {
    case "dna-structure":
      return <DNAStructurePreview />;
    case "dna-replication":
      return <DNAPreview />;
    case "osmosis":
      return <OsmosisPreview />;
    case "action-potential":
      return <ActionPotentialPreview />;
    case "enzyme-kinetics":
      return <EnzymePreview />;
    case "protein-synthesis":
      return <ProteinPreview />;
    case "photosynthesis":
      return <PhotosynthesisPreview />;
    case "cellular-respiration":
      return <RespirationPreview />;
    case "mitosis":
    default:
      return <MitosisPreview />;
  }
}
