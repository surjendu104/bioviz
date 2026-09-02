"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
import { VisualizationMetadata } from "@/lib/registry";
import KeyboardHelpModal from "./KeyboardHelpModal";

interface VisualizationShellProps {
  metadata: VisualizationMetadata;
  children: React.ReactNode;
  controls?: React.ReactNode;
  sidebar?: React.ReactNode;
  onOpenActiveSite?: () => void;
  activeSiteButtonLabel?: string;
}

export default function VisualizationShell({
  metadata,
  children,
  controls,
  sidebar,
  onOpenActiveSite,
  activeSiteButtonLabel = "🔬 Active Site",
}: VisualizationShellProps) {
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const tooltipId = `tooltip-${metadata.id}`;

  return (
    <div className="flex flex-col h-screen w-full bg-white text-foreground overflow-hidden font-mono text-xs select-none">
      {/* 1. GENERIC EDITORIAL HEADER FOR ALL VISUALIZATIONS */}
      <header className="px-5 py-3 md:px-8 md:py-3.5 border-b border-border bg-white z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        {/* Left: Breadcrumb & Title with Info Tooltip */}
        <div className="flex items-center gap-2.5 truncate">
          <Link
            href="/"
            className="text-muted hover:text-foreground transition-colors font-semibold flex items-center gap-1 shrink-0"
            title="Return to library gallery"
          >
            <span>←</span>
            <span className="hidden sm:inline">Gallery</span>
          </Link>

          <span className="text-muted">/</span>

          <span className="text-[10px] text-muted uppercase tracking-widest hidden md:inline">
            {metadata.category}
          </span>

          <span className="text-muted hidden md:inline">·</span>

          <div className="flex items-center gap-2 truncate">
            <h1 className="font-display text-base md:text-lg font-medium text-foreground truncate">
              {metadata.title}
            </h1>

            {/* Info Icon with react-tooltip */}
            {metadata.tagline && (
              <>
                <button
                  type="button"
                  data-tooltip-id={tooltipId}
                  data-tooltip-place="bottom"
                  aria-label={`About ${metadata.title}`}
                  className="w-4 h-4 rounded-full border border-border text-muted hover:text-foreground hover:border-foreground flex items-center justify-center text-[10px] font-mono transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  ⓘ
                </button>

                <Tooltip
                  id={tooltipId}
                  className="bioviz-tooltip"
                  classNameArrow="hidden"
                  clickable
                >
                  <div className="space-y-1.5 font-mono text-left max-w-[296px]">
                    <div className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                      Scientific Overview
                    </div>
                
                    <p className="text-[11px] text-slate-200 leading-relaxed whitespace-normal break-words">
                      {metadata.tagline}
                    </p>
                
                    {metadata.citation && (
                      <div className="text-[9px] text-slate-400 border-t border-slate-700/80 pt-1 mt-1 whitespace-normal break-words">
                        <span className="text-slate-300 font-medium">Ref: </span>
                        {metadata.citation}
                      </div>
                    )}
                  </div>
                </Tooltip>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions & Shortcuts Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenActiveSite && (
            <button
              onClick={onOpenActiveSite}
              className="px-2.5 py-1 border border-border hover:border-foreground hover:bg-gray-50 text-foreground transition-colors uppercase tracking-wider text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <span>{activeSiteButtonLabel}</span>
            </button>
          )}

          <button
            onClick={() => setShowKeyboardHelp(true)}
            className="px-2.5 py-1 border border-border hover:border-foreground hover:bg-gray-50 text-muted hover:text-foreground transition-colors uppercase tracking-wider text-[10px] cursor-pointer"
            title="Keyboard shortcuts"
          >
            ⌨ Shortcuts
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE: HERO VISUALIZATION (LEFT/CENTER) + INSPECTION SIDEBAR (RIGHT) */}
      <main className="grow relative flex flex-col lg:flex-row min-h-0 bg-white">
        {/* Visualization Hero Canvas / SVG */}
        <div className="grow relative h-full min-h-0 overflow-hidden bg-gray-50/40 border-b lg:border-b-0 lg:border-r border-border flex flex-col">
          <div className="relative grow w-full h-full min-h-0">
            {children}
          </div>
        </div>

        {/* Inspection & Narrative Sidebar */}
        {sidebar && (
          <aside className="w-full lg:w-96 bg-white flex flex-col z-10 shrink-0 h-72 lg:h-full overflow-hidden border-t lg:border-t-0 border-border">
            {sidebar}
          </aside>
        )}
      </main>

      {/* 3. CONTROL & TIMELINE BAR */}
      {controls && (
        <div className="shrink-0 z-20">
          {controls}
        </div>
      )}

      {/* 4. KEYBOARD SHORTCUTS MODAL */}
      <KeyboardHelpModal
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </div>
  );
}
