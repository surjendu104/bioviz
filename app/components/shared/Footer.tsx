"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white px-6 py-8 md:px-8 font-mono text-xs text-muted">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-foreground font-display font-semibold text-sm">
            <span className="w-2 h-2 bg-blue-600 inline-block" />
            BIOVIZ — Interactive Biology Visualization Library
          </div>
          <p className="text-[11px] text-muted max-w-md leading-relaxed">
            A digital laboratory and interactive atlas visualizing foundational biological mechanisms with rigorous scientific fidelity, biophysical causality, and restrained information design.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[11px]">
          <Link href="/visualizations/blood-circulation" className="hover:text-foreground transition-colors">
            Blood Circulation
          </Link>
          <Link href="/visualizations/cell-structure" className="hover:text-foreground transition-colors">
            Cell Structure
          </Link>
          <Link href="/visualizations/dna-structure" className="hover:text-foreground transition-colors">
            DNA Structure
          </Link>
          <Link href="/visualizations/dna-replication" className="hover:text-foreground transition-colors">
            DNA Replication
          </Link>
          <Link href="/visualizations/osmosis" className="hover:text-foreground transition-colors">
            Osmosis & Tonicity
          </Link>
          <Link href="/visualizations/action-potential" className="hover:text-foreground transition-colors">
            Action Potential
          </Link>
          <Link href="/visualizations/enzyme-kinetics" className="hover:text-foreground transition-colors">
            Enzyme Kinetics
          </Link>
          <Link href="/visualizations/protein-synthesis" className="hover:text-foreground transition-colors">
            Protein Synthesis
          </Link>
        </div>
      </div>

      {/*<div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-muted">
        <div>
          Scientific Visual Standard v2.4 · Built with React 19, TypeScript & Next.js
        </div>
        <div>
          Space Grotesk + IBM Plex Mono · Design Integrity Certified
        </div>
      </div>*/}
    </footer>
  );
}
