"use client";

import React from "react";
import { AppState } from "@/lib/types";

interface MetricsReadoutProps {
  state: AppState;
}

export default function MetricsReadout({ state }: MetricsReadoutProps) {
  const progress = state.progress;

  // Quantitative approximations
  const totalBases = 48; // Total visible base pairs in window
  const bpReplicated = Math.min(totalBases, Math.round((progress / 1000) * totalBases));
  const dntpCount = Math.round(bpReplicated * 1.8);
  const atpHydrolyzed = Math.round(bpReplicated * 1.2 + (progress > 850 ? 8 : 0));
  const completionPct = Math.min(100, Math.round((progress / 1000) * 100));

  return (
    <div className="grid grid-cols-2 gap-2 font-mono text-xs">
      <div className="p-2.5 bg-gray-50 border border-border">
        <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Replication Progress</div>
        <div className="text-base font-bold font-display text-foreground">{completionPct}%</div>
      </div>

      <div className="p-2.5 bg-gray-50 border border-border">
        <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">Bases Replicated</div>
        <div className="text-base font-bold font-display text-foreground">{bpReplicated} / {totalBases} bp</div>
      </div>

      <div className="p-2.5 bg-gray-50 border border-border">
        <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">dNTPs Incorporated</div>
        <div className="text-base font-bold font-display text-blue-600">{dntpCount} nt</div>
      </div>

      <div className="p-2.5 bg-gray-50 border border-border">
        <div className="text-[9px] uppercase tracking-wider text-muted mb-0.5">ATP Hydrolyzed</div>
        <div className="text-base font-bold font-display text-amber-600">{atpHydrolyzed} ATP</div>
      </div>
    </div>
  );
}
