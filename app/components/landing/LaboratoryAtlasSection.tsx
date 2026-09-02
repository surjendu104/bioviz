"use client";

import React from "react";

export default function LaboratoryAtlasSection() {
  const pillars = [
    {
      num: "01",
      title: "Scientific Accuracy",
      desc: "Every model is grounded in peer-reviewed biophysics and biochemistry literature. We do not invent convenient animations that contradict true molecular thermodynamics or enzymatic kinetics."
    },
    {
      num: "02",
      title: "Interactive Causality",
      desc: "Manipulate physical variables directly—solute osmolarity, membrane potential, substrate concentration, or replisome milestones—and witness the exact real-time biophysical consequences."
    },
    {
      num: "03",
      title: "No Gamified Clutter",
      desc: "Not a gamified quiz or flashcard site. High information density, restrained editorial design, and deep molecular inspection for students, researchers, and scientific thinkers."
    },
    {
      num: "04",
      title: "Predict & Discover",
      desc: "Test your hypothesis at critical mechanistic checkpoints: 5'→3' synthesis constraints, Nernst potentials, or allosteric inhibition, then verify the outcome via physical simulation."
    }
  ];

  return (
    <section className="border-t border-border bg-gray-50/40 p-6 md:p-12 font-mono text-xs" aria-labelledby="methodology-heading">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <div className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-1">
              Methodology & Design Architecture
            </div>
            <h2 id="methodology-heading" className="font-display text-2xl md:text-3xl font-medium text-foreground">
              Observe → Interact → Understand → Predict → Experiment
            </h2>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p) => (
            <div key={p.num} className="p-5 bg-white border border-border space-y-2">
              <div className="text-blue-600 font-bold text-xs">{p.num} {"//"}</div>
              <h3 className="font-display text-base font-medium text-foreground">
                {p.title}
              </h3>
              <p className="text-muted leading-relaxed text-[11px]">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Scientific Foundations Citation Box */}
        <div className="p-4 bg-white border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-muted">
          <div>
            <span className="font-bold text-foreground">Primary Scientific Foundations: </span>
            Alberts et al. (Molecular Biology of the Cell) · Lodish et al. (Molecular Cell Biology) · Hodgkin & Huxley (1952) · Watson & Crick (1953)
          </div>
          <div className="shrink-0 font-semibold text-foreground">
            Strict Non-Color Secondary Encoding
          </div>
        </div>
      </div>
    </section>
  );
}
