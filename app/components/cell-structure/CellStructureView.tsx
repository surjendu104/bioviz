"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getVisualizationById } from "@/lib/registry";
import {
  CellType,
  OrganelleData,
  ORGANELLES,
} from "@/lib/biology/cellStructureModel";
import VisualizationShell from "../shared/VisualizationShell";
import CellStructureRenderer from "./CellStructureRenderer";
import CellStructureControls from "./CellStructureControls";
import CellStructureInfoPanel from "./CellStructureInfoPanel";

export default function CellStructureView() {
  const metadata = getVisualizationById("cell-structure")!;

  const [cellType, setCellType] = useState<CellType>("animal");
  const [selectedOrganelle, setSelectedOrganelle] = useState<OrganelleData | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showRelationships, setShowRelationships] = useState<boolean>(false);
  const [showBoundaries, setShowBoundaries] = useState<boolean>(false);

  // If cell type changes, verify if currently selected organelle is present in new cell type
  const handleCellTypeChange = useCallback((newType: CellType) => {
    setCellType(newType);
    if (selectedOrganelle) {
      if (
        (newType === "animal" && selectedOrganelle.foundIn === "plant-only") ||
        (newType === "plant" && selectedOrganelle.foundIn === "animal-only")
      ) {
        setSelectedOrganelle(null);
        setIsFocused(false);
      }
    }
  }, [selectedOrganelle]);

  const handleReset = useCallback(() => {
    setCellType("animal");
    setSelectedOrganelle(null);
    setIsFocused(false);
    setShowLabels(true);
    setShowRelationships(false);
    setShowBoundaries(false);
  }, []);

  const handleToggleFocus = useCallback(() => {
    if (!selectedOrganelle) {
      // Default to nucleus if nothing is selected
      setSelectedOrganelle(ORGANELLES["nucleus"]);
      setIsFocused(true);
    } else {
      setIsFocused((prev) => !prev);
    }
  }, [selectedOrganelle]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          handleCellTypeChange(cellType === "animal" ? "plant" : "animal");
          break;
        case "z":
        case "Z":
          e.preventDefault();
          handleToggleFocus();
          break;
        case "r":
        case "R":
          e.preventDefault();
          setShowRelationships((r) => !r);
          break;
        case "b":
        case "B":
          e.preventDefault();
          setShowBoundaries((b) => !b);
          break;
        case "l":
        case "L":
          e.preventDefault();
          setShowLabels((l) => !l);
          break;
        case "Escape":
          if (isFocused) {
            setIsFocused(false);
          } else {
            setSelectedOrganelle(null);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cellType, isFocused, handleCellTypeChange, handleToggleFocus]);

  return (
    <VisualizationShell
      metadata={metadata}
      controls={
        <CellStructureControls
          cellType={cellType}
          setCellType={handleCellTypeChange}
          selectedOrganelle={selectedOrganelle}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          showRelationships={showRelationships}
          setShowRelationships={setShowRelationships}
          showBoundaries={showBoundaries}
          setShowBoundaries={setShowBoundaries}
          onReset={handleReset}
        />
      }
      sidebar={
        <CellStructureInfoPanel
          cellType={cellType}
          selectedOrganelle={selectedOrganelle}
          onSelectOrganelle={setSelectedOrganelle}
          isFocused={isFocused}
          onToggleFocus={handleToggleFocus}
        />
      }
    >
      <CellStructureRenderer
        cellType={cellType}
        selectedOrganelle={selectedOrganelle}
        onSelectOrganelle={setSelectedOrganelle}
        isFocused={isFocused}
        onToggleFocus={handleToggleFocus}
        showLabels={showLabels}
        showRelationships={showRelationships}
        showBoundaries={showBoundaries}
      />
    </VisualizationShell>
  );
}
