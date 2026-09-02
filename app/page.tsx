"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { VISUALIZATION_REGISTRY } from "@/lib/registry";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import HeroGenerativeVisual from "./components/landing/HeroGenerativeVisual";
import FilterBar from "./components/landing/FilterBar";
import VisualizationCard from "./components/landing/VisualizationCard";
import LaboratoryAtlasSection from "./components/landing/LaboratoryAtlasSection";

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Filter registry entries
  const filteredList = useMemo(() => {
    return VISUALIZATION_REGISTRY.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (onlyAvailable && item.status !== "available") {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchTagline = item.tagline.toLowerCase().includes(q);
        const matchPrinciples = item.keyPrinciples.some((p) => p.toLowerCase().includes(q));
        const matchVars = item.primaryVariables.some((v) => v.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTagline && !matchPrinciples && !matchVars) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery, onlyAvailable]);

  const availableCount = useMemo(
    () => VISUALIZATION_REGISTRY.filter((i) => i.status === "available").length,
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground selection:bg-blue-100">
      {/* 1. EDITORIAL MASTHEAD NAVBAR */}
      <Navbar  />

      {/* 2. HERO SECTION */}
      <section className="px-6 pt-10 pb-8 md:px-12 md:pt-16 md:pb-12 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest font-semibold">
              Vol. 01 — Digital Scientific Atlas
            </span>
            <span className="font-mono text-[10px] text-muted">·</span>
            <span className="font-mono text-[10px] text-blue-600 font-semibold uppercase">
              Interactive Library
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.05]">
            Biology, made visible.
          </h1>

          <p className="font-mono text-xs md:text-sm text-muted leading-relaxed max-w-2xl mt-1">
            An interactive visualization library of biological mechanisms, physical constraints, and dynamic living systems. Observe molecular processes directly, manipulate biophysical variables, and discover causality through experimentation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <Link
              href="/visualizations/dna-replication"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2"
            >
              <span>Explore DNA Replication</span>
              <span>→</span>
            </Link>
            <a
              href="#gallery"
              className="px-4 py-2 border border-border hover:border-foreground transition-colors text-foreground"
            >
              Browse Gallery ({VISUALIZATION_REGISTRY.length} Models)
            </a>
          </div>
        </div>
      </section>

      {/* 3. HERO GENERATIVE BIOLOGICAL VISUAL */}
      <HeroGenerativeVisual />

      {/* 4. FILTER BAR & COLLECTION GALLERY */}
      <section id="gallery" className="w-full flex-grow flex flex-col">
        {/* Filter controls */}
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onlyAvailable={onlyAvailable}
          onToggleOnlyAvailable={() => setOnlyAvailable((prev) => !prev)}
          totalCount={VISUALIZATION_REGISTRY.length}
          availableCount={availableCount}
        />

        {/* Gallery Grid */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex-grow">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border font-mono text-xs text-muted space-y-2">
              <div>No biological visualizations matched your search criteria.</div>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setOnlyAvailable(false);
                }}
                className="text-blue-600 underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((item) => (
                <VisualizationCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. METHODOLOGY & SCIENTIFIC ARCHITECTURE */}
      <LaboratoryAtlasSection />

      {/* 6. FOOTER */}
      <Footer />
    </div>
  );
}
