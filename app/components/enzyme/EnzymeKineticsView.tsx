"use client";

import React, { useState } from "react";
import { getVisualizationById } from "@/lib/registry";
import { EnzymeInspectable, ENZYME_INSPECTABLES } from "@/lib/biology/enzymeModel";
import VisualizationShell from "../shared/VisualizationShell";
import EnzymeKineticsCanvas from "./EnzymeKineticsCanvas";
import EnzymeControls from "./EnzymeControls";
import EnzymeInfoPanel from "./EnzymeInfoPanel";

export default function EnzymeKineticsView() {
  const metadata = getVisualizationById("enzyme-kinetics")!;

  const [substrateConc, setSubstrateConc] = useState<number>(20);
  const [enzymeConc, setEnzymeConc] = useState<number>(10);
  const [inhibitorType, setInhibitorType] = useState<"none" | "competitive" | "noncompetitive">("none");
  const [plotType, setPlotType] = useState<"michaelis-menten" | "lineweaver-burk">("michaelis-menten");
  const [isPlaying] = useState<boolean>(true);
  const [selectedObject, setSelectedObject] = useState<EnzymeInspectable | null>(null);

  // Baseline enzyme kinetic parameters
  const baseKm = 25; // uM
  const baseVmax = enzymeConc * 4.5; // uM/min

  // Apparent parameters with inhibition
  let apparentKm = baseKm;
  let apparentVmax = baseVmax;

  if (inhibitorType === "competitive") {
    apparentKm = baseKm * 2.4; // Competitive increases Km
  } else if (inhibitorType === "noncompetitive") {
    apparentVmax = baseVmax * 0.45; // Non-competitive lowers Vmax
  }

  // Calculate current velocity: v = (Vmax * [S]) / (Km + [S])
  const velocity = (apparentVmax * substrateConc) / (apparentKm + substrateConc);

  const handleReset = () => {
    setSubstrateConc(20);
    setEnzymeConc(10);
    setInhibitorType("none");
    setPlotType("michaelis-menten");
    setSelectedObject(null);
  };

  return (
    <VisualizationShell
      metadata={metadata}
      controls={
        <EnzymeControls
          substrateConc={substrateConc}
          setSubstrateConc={setSubstrateConc}
          enzymeConc={enzymeConc}
          setEnzymeConc={setEnzymeConc}
          inhibitorType={inhibitorType}
          setInhibitorType={setInhibitorType}
          plotType={plotType}
          setPlotType={setPlotType}
          onReset={handleReset}
        />
      }
      sidebar={
        <EnzymeInfoPanel
          substrateConc={substrateConc}
          inhibitorType={inhibitorType}
          velocity={velocity}
          km={baseKm}
          apparentKm={apparentKm}
          apparentVmax={apparentVmax}
          selectedObject={selectedObject}
          onSelectObject={setSelectedObject}
        />
      }
    >
      <EnzymeKineticsCanvas
        substrateConc={substrateConc}
        enzymeConc={enzymeConc}
        inhibitorType={inhibitorType}
        plotType={plotType}
        velocity={velocity}
        km={baseKm}
        vmax={baseVmax}
        apparentKm={apparentKm}
        apparentVmax={apparentVmax}
        isPlaying={isPlaying}
        onSelectObject={(id) => setSelectedObject(ENZYME_INSPECTABLES[id] || null)}
      />
    </VisualizationShell>
  );
}
