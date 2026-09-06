"use client";

import React from "react";
import { VisualizationCategory } from "@/lib/registry";

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onlyAvailable: boolean;
  onToggleOnlyAvailable: () => void;
  totalCount: number;
  availableCount: number;
}

const CATEGORIES: (VisualizationCategory | "All")[] = [
  "All",
  "Physiology",
  "Cell Biology",
  "Molecular Genetics",
  "Cellular Biophysics",
  "Neurophysiology",
  "Biochemistry",
];

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onlyAvailable,
  onToggleOnlyAvailable,
  totalCount,
  availableCount,
}: FilterBarProps) {
  return (
    <div className="w-full border-b border-border bg-white px-6 py-4 md:px-8 space-y-3 font-mono text-xs select-none">
      {/* Search and Status Toggle Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search mechanisms, enzymes, equations, or concepts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-1.5 border border-border bg-gray-50/50 text-foreground placeholder:text-muted text-xs focus:bg-white focus:border-foreground focus:outline-none"
            aria-label="Filter visualizations"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-2 text-muted hover:text-foreground text-[10px]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status / Availability Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleOnlyAvailable}
            className={`px-3 py-1.5 border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
              onlyAvailable
                ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold"
                : "border-border hover:border-foreground text-muted hover:text-foreground"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                onlyAvailable ? "bg-emerald-600 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span>Ready to Explore ({availableCount})</span>
          </button>

          <span className="text-[11px] text-muted hidden md:inline">
            Catalog: {totalCount} systems
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] text-muted uppercase tracking-wider font-semibold mr-1 shrink-0">
          Domain:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-2.5 py-1 text-[11px] border whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "bg-white text-muted border-border hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
