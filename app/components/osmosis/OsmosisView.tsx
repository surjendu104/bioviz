"use client";

import React, { useState } from "react";
import { getVisualizationById } from "@/lib/registry";
import { OsmosisInspectableObject, OSMOSIS_INSPECTABLES } from "@/lib/biology/osmosisModel";
import VisualizationShell from "../shared/VisualizationShell";
import OsmosisCanvas from "./OsmosisCanvas";
import OsmosisControls from "./OsmosisControls";
import OsmosisInfoPanel from "./OsmosisInfoPanel";

export default function OsmosisView() {
  const metadata = getVisualizationById("osmosis")!;

  const [leftSoluteConc, setLeftSoluteConc] = useState<number>(0.1);
  const [rightSoluteConc, setRightSoluteConc] = useState<number>(0.6);
  const [permeabilityMode, setPermeabilityMode] = useState<"selective" | "impermeable" | "pore-open">("selective");
  const [temperatureK, setTemperatureK] = useState<number>(298);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [selectedObject, setSelectedObject] = useState<OsmosisInspectableObject | null>(null);

  const handleSelectObjectById = (id: string) => {
    const obj = OSMOSIS_INSPECTABLES[id];
    if (obj) setSelectedObject(obj);
  };

  const handleReset = () => {
    setLeftSoluteConc(0.2);
    setRightSoluteConc(0.2);
    setPermeabilityMode("selective");
    setTemperatureK(298);
    setIsPlaying(true);
    setSelectedObject(null);
  };

  return (
    <VisualizationShell
      metadata={metadata}
      controls={
        <OsmosisControls
          leftSoluteConc={leftSoluteConc}
          setLeftSoluteConc={setLeftSoluteConc}
          rightSoluteConc={rightSoluteConc}
          setRightSoluteConc={setRightSoluteConc}
          setPermeabilityMode={setPermeabilityMode}
          temperatureK={temperatureK}
          setTemperatureK={setTemperatureK}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onReset={handleReset}
          showVectors={showVectors}
          setShowVectors={setShowVectors}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
        />
      }
      sidebar={
        <OsmosisInfoPanel
          leftSoluteConc={leftSoluteConc}
          rightSoluteConc={rightSoluteConc}
          temperatureK={temperatureK}
          selectedObject={selectedObject}
          onSelectObject={setSelectedObject}
        />
      }
    >
      <OsmosisCanvas
        leftSoluteConc={leftSoluteConc}
        rightSoluteConc={rightSoluteConc}
        permeabilityMode={permeabilityMode}
        temperatureK={temperatureK}
        isPlaying={isPlaying}
        onSelectObject={handleSelectObjectById}
        showVectors={showVectors}
        showLabels={showLabels}
      />
    </VisualizationShell>
  );
}
