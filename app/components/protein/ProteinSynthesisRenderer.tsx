"use client";

import React, { useEffect, useRef } from "react";
import { mRNA_SEQUENCE } from "@/lib/biology/proteinModel";

interface ProteinSynthesisRendererProps {
  currentCodonIndex: number;
  subStage: "loading_a" | "peptide_bond" | "translocation";
  isPlaying: boolean;
  onSelectObject: (id: string) => void;
  showCodonLetters: boolean;
  showSites: boolean;
}

export default function ProteinSynthesisRenderer({
  currentCodonIndex,
  subStage,
  isPlaying,
  onSelectObject,
  showCodonLetters,
  showSites,
}: ProteinSynthesisRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    window.addEventListener("resize", handleResize);
    handleResize();

    const render = () => {
      t += 0.02;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const riboX = w * 0.5;
      const riboY = h * 0.48;
      const codonWidth = 56;

      // ─────────────────────────────────────────────────────────
      // 1. mRNA TAPE 5' → 3'
      // ─────────────────────────────────────────────────────────
      const mrnaY = riboY + 70;
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, mrnaY);
      ctx.lineTo(w - 20, mrnaY);
      ctx.stroke();

      // 5' and 3' Terminus Badges
      ctx.fillStyle = "#2563eb";
      ctx.fillRect(10, mrnaY - 10, 24, 20);
      ctx.fillStyle = "#ffffff";
      ctx.font = 'bold 10px "IBM Plex Mono", monospace';
      ctx.fillText("5'", 16, mrnaY + 4);

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(w - 34, mrnaY - 10, 24, 20);
      ctx.fillStyle = "#ffffff";
      ctx.fillText("3'", w - 28, mrnaY + 4);

      // Render mRNA Codons
      const activeOffset = riboX - currentCodonIndex * codonWidth;
      for (let i = 0; i < mRNA_SEQUENCE.length; i++) {
        const codon = mRNA_SEQUENCE[i];
        const cx = activeOffset + i * codonWidth;

        // Skip offscreen
        if (cx < -40 || cx > w + 40) continue;

        const isCurrent = i === currentCodonIndex;
        ctx.fillStyle = isCurrent ? "rgba(37, 99, 235, 0.15)" : "rgba(241, 245, 249, 0.8)";
        ctx.strokeStyle = isCurrent ? "#2563eb" : "#cbd5e1";
        ctx.lineWidth = isCurrent ? 1.5 : 1;
        ctx.strokeRect(cx - 24, mrnaY - 14, 48, 28);
        ctx.fillRect(cx - 24, mrnaY - 14, 48, 28);

        if (showCodonLetters) {
          ctx.font = isCurrent ? 'bold 11px "IBM Plex Mono", monospace' : '10px "IBM Plex Mono", monospace';
          ctx.fillStyle = isCurrent ? "#2563eb" : "#475569";
          ctx.fillText(codon.triplet, cx - 11, mrnaY + 4);

          ctx.font = '8px "IBM Plex Mono", monospace';
          ctx.fillStyle = "#64748b";
          ctx.fillText(codon.aminoAcid, cx - 10, mrnaY + 24);
        }
      }

      // ─────────────────────────────────────────────────────────
      // 2. RIBOSOME COMPLEX (Large 50S/60S & Small 30S/40S Subunits)
      // ─────────────────────────────────────────────────────────

      // Large Subunit (Top dome with Peptidyl Transferase Center)
      ctx.save();
      ctx.beginPath();
      ctx.arc(riboX, riboY, 110, Math.PI * 0.95, Math.PI * 0.05);
      ctx.fillStyle = "rgba(147, 51, 234, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#9333ea";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Large Subunit Label
      ctx.font = 'bold 10px "IBM Plex Mono", monospace';
      ctx.fillStyle = "#9333ea";
      ctx.fillText("50S Large Subunit (PTC)", riboX - 65, riboY - 80);
      ctx.restore();

      // Small Subunit (Bottom base clamping mRNA)
      ctx.beginPath();
      ctx.roundRect(riboX - 105, mrnaY + 12, 210, 36, 8);
      ctx.fillStyle = "rgba(147, 51, 234, 0.12)";
      ctx.fill();
      ctx.strokeStyle = "#9333ea";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 9px "IBM Plex Mono", monospace';
      ctx.fillStyle = "#7e22ce";
      ctx.fillText("30S Small Subunit (Decoding Center)", riboX - 85, mrnaY + 34);

      // ─────────────────────────────────────────────────────────
      // 3. A, P, E ACTIVE SITES & tRNAs
      // ─────────────────────────────────────────────────────────
      const siteSpacing = 42;
      const pSiteX = riboX;
      const aSiteX = riboX + siteSpacing;
      const eSiteX = riboX - siteSpacing;

      if (showSites) {
        // Site columns
        const sites = [
          { name: "E Site (Exit)", x: eSiteX, color: "#64748b" },
          { name: "P Site (Peptidyl)", x: pSiteX, color: "#059669" },
          { name: "A Site (Aminoacyl)", x: aSiteX, color: "#2563eb" },
        ];

        for (const s of sites) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 3]);
          ctx.strokeRect(s.x - 18, riboY - 50, 36, 110);
          ctx.setLineDash([]);

          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          ctx.fillStyle = s.color;
          ctx.fillText(s.name.split(" ")[0], s.x - 14, riboY - 56);
        }
      }

      // P-Site tRNA (carries nascent peptide)
      if (currentCodonIndex > 0) {
        const curCodon = mRNA_SEQUENCE[currentCodonIndex - 1];
        ctx.fillStyle = "#059669";
        ctx.fillRect(pSiteX - 8, riboY - 35, 16, 80);
        ctx.font = 'bold 8px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(curCodon.anticodon, pSiteX - 9, riboY + 38);
      }

      // A-Site tRNA (incoming or accommodation)
      if (currentCodonIndex < mRNA_SEQUENCE.length - 1) {
        const nextCodon = mRNA_SEQUENCE[currentCodonIndex];
        const aY = subStage === "loading_a" ? riboY - 55 - Math.sin(t * 3) * 6 : riboY - 35;
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(aSiteX - 8, aY, 16, 80);
        ctx.font = 'bold 8px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#ffffff";
        ctx.fillText(nextCodon.anticodon, aSiteX - 9, aY + 73);
      }

      // ─────────────────────────────────────────────────────────
      // 4. NASCENT POLYPEPTIDE CHAIN (Emerging through exit tunnel)
      // ─────────────────────────────────────────────────────────
      const chainLength = Math.min(currentCodonIndex + 1, mRNA_SEQUENCE.length);
      for (let i = 0; i < chainLength; i++) {
        const beadCodon = mRNA_SEQUENCE[i];
        if (beadCodon.isStop) continue;

        const bx = pSiteX - 10 - i * 14;
        const by = riboY - 50 - i * 10 - Math.sin(t + i) * 4;

        ctx.beginPath();
        ctx.arc(bx, by, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = "#f59e0b";
        ctx.fill();
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = 'bold 7px "IBM Plex Mono", monospace';
        ctx.fillStyle = "#78350f";
        ctx.fillText(beadCodon.aminoAcid.substring(0, 3), bx - 6, by + 2.5);

        // Peptide bond linkage line
        if (i > 0) {
          const prevBx = pSiteX - 10 - (i - 1) * 14;
          const prevBy = riboY - 50 - (i - 1) * 10 - Math.sin(t + i - 1) * 4;
          ctx.strokeStyle = "#b45309";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(prevBx, prevBy);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [currentCodonIndex, subStage, isPlaying, showCodonLetters, showSites]);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block bg-white" />

      {/* Floating Hotspots */}
      <div className="absolute top-3 right-4 z-10 hidden sm:flex items-center gap-2 bg-white/95 border border-border px-2.5 py-1.5 font-mono text-[10px] text-muted shadow-xs">
        <button
          onClick={() => onSelectObject("ribosome-large")}
          className="hover:text-purple-700 cursor-pointer"
        >
          PTC Ribozyme
        </button>
        <span>·</span>
        <button
          onClick={() => onSelectObject("a-site")}
          className="hover:text-blue-700 cursor-pointer"
        >
          A Site
        </button>
        <span>·</span>
        <button
          onClick={() => onSelectObject("p-site")}
          className="hover:text-emerald-700 cursor-pointer"
        >
          P Site
        </button>
        <span>·</span>
        <button
          onClick={() => onSelectObject("peptide-bond")}
          className="hover:text-amber-700 cursor-pointer"
        >
          Peptide Bond
        </button>
      </div>
    </div>
  );
}
