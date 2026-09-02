"use client";

import React from "react";
import Link from "next/link";
import { VisualizationMetadata } from "@/lib/registry";
import { GenericPreview } from "./CardPreviews";

interface VisualizationCardProps {
  item: VisualizationMetadata;
}

export default function VisualizationCard({ item }: VisualizationCardProps) {
  const isAvailable = item.status === "available";

  const cardContent = (
    <>
      {/* 1. CARD HEADER & METADATA */}
      <div className="p-4 md:p-5 border-b border-border flex items-start justify-between gap-3 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider font-semibold">
              {item.category}
            </span>
            <span className="font-mono text-[10px] text-muted">/</span>
            <span className="font-mono text-[10px] text-muted">{item.categoryCode}</span>
          </div>
          <h2 className="font-display text-lg md:text-xl font-medium text-foreground group-hover:text-blue-600 transition-colors leading-tight">
            {item.title}
          </h2>
        </div>

        {/* Status Badge */}
        <div className="shrink-0 font-mono text-[9px] uppercase tracking-wider">
          {isAvailable ? (
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Available
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-gray-100 text-muted border border-gray-200">
              In Development
            </span>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC SCIENTIFIC PREVIEW CANVAS */}
      <div className="h-32 md:h-36 w-full relative border-b border-border overflow-hidden bg-slate-50/50">
        <GenericPreview previewType={item.previewType} />
        <div className="absolute top-2 right-2 font-mono text-[8px] text-muted/70 uppercase tracking-widest pointer-events-none">
          Live Model Preview
        </div>
      </div>

      {/* 3. SCIENTIFIC DESCRIPTION & CONSTRAINTS */}
      <div className="p-4 md:p-5 flex-grow flex flex-col justify-between gap-4 font-mono text-xs">
        <div>
          <p className="text-muted leading-relaxed mb-3 text-[11px]">
            {item.tagline}
          </p>

          {/* Primary Scientific Variables */}
          <div className="space-y-1">
            <div className="text-[9px] uppercase tracking-widest text-muted font-semibold">
              Simulated Variables:
            </div>
            <div className="flex flex-wrap gap-1">
              {item.primaryVariables.map((v, i) => (
                <span
                  key={i}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-50 border border-gray-200 text-foreground"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. CARD FOOTER / ACTION */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
          <span className="text-[10px] text-muted">
            Diff: <span className="text-foreground font-medium">{item.difficulty}</span>
          </span>

          {isAvailable ? (
            <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
              Explore Model ↗
            </span>
          ) : (
            <span className="text-muted italic text-[10px]">
              Coming soon
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (isAvailable) {
    return (
      <Link
        href={item.route}
        className="group relative flex flex-col bg-white border border-border hover:border-foreground transition-all duration-150 focus-visible:outline-2 focus-visible:outline-blue-600 h-full text-left"
        aria-label={`Explore ${item.title}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="relative flex flex-col bg-white border border-border/70 opacity-80 h-full text-left">
      {cardContent}
    </div>
  );
}
