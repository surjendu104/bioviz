"use client";

import React from "react";
import Link from "next/link";

interface NavbarProps {
  currentVisualizationTitle?: string;
  onOpenKeyboardHelp?: () => void;
}

export default function Navbar({
  currentVisualizationTitle,
  onOpenKeyboardHelp,
}: NavbarProps) {
  return (
    <header className="px-6 py-3.5 md:px-8 border-b border-border bg-white z-20 flex items-center justify-between gap-4 font-mono text-xs select-none shrink-0">
      {/* Brand / Breadcrumb */}
      <div className="flex items-center gap-3 truncate">
        <Link
          href="/"
          className="font-display text-base font-semibold text-foreground hover:text-blue-600 transition-colors tracking-tight flex items-center gap-2 shrink-0"
        >
          <span className="w-2.5 h-2.5 bg-blue-600 inline-block" />
          <span>BIOVIZ</span>
        </Link>

        {currentVisualizationTitle ? (
          <>
            <span className="text-muted">/</span>
            <Link
              href="/"
              className="text-muted hover:text-foreground transition-colors hidden sm:inline"
            >
              Gallery
            </Link>
            <span className="text-muted hidden sm:inline">/</span>
            <span className="text-foreground font-semibold truncate">
              {currentVisualizationTitle}
            </span>
          </>
        ) : (
          <>
            <span className="text-muted">/</span>
            <span className="text-muted text-[11px] hidden sm:inline">
              Interactive Scientific Atlas
            </span>
          </>
        )}
      </div>

      {/* Right Navigation / Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {onOpenKeyboardHelp && (
          <button
            onClick={onOpenKeyboardHelp}
            className="px-2.5 py-1 border border-border hover:border-foreground hover:bg-gray-50 text-muted hover:text-foreground transition-colors uppercase tracking-wider text-[10px] cursor-pointer"
            title="Keyboard shortcuts"
          >
            ⌨ Shortcuts
          </button>
        )}
        <Link
          href="/"
          className="px-3 py-1 bg-foreground text-background hover:bg-gray-800 transition-colors text-[10px] uppercase tracking-wider font-semibold"
        >
          Visualizations Index
        </Link>
      </div>
    </header>
  );
}
