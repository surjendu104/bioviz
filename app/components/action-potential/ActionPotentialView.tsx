"use client";

import React, { useState, useEffect, useRef } from "react";
import { getVisualizationById } from "@/lib/registry";
import { ActionPotentialInspectable, ACTION_POTENTIAL_INSPECTABLES } from "@/lib/biology/actionPotentialModel";
import VisualizationShell from "../shared/VisualizationShell";
import ActionPotentialCanvas from "./ActionPotentialCanvas";
import ActionPotentialControls from "./ActionPotentialControls";
import ActionPotentialInfoPanel from "./ActionPotentialInfoPanel";

export default function ActionPotentialView() {
  const metadata = getVisualizationById("action-potential")!;

  const [vm, setVm] = useState<number>(-70);
  const [gNa, setGNa] = useState<number>(2);
  const [gK, setGK] = useState<number>(5);
  const [phase, setPhase] = useState<string>("Resting State (-70 mV)");
  const [naGateOpen, setNaGateOpen] = useState<boolean>(false);
  const [naInactivated, setNaInactivated] = useState<boolean>(false);
  const [kGateOpen, setKGateOpen] = useState<boolean>(false);
  const [blocker, setBlocker] = useState<"none" | "ttx" | "tea">("none");
  const [isPlaying] = useState<boolean>(true);
  const [showConductance, setShowConductance] = useState<boolean>(true);
  const [selectedObject, setSelectedObject] = useState<ActionPotentialInspectable | null>(null);

  // Time series buffer for oscilloscope
  const [timeHistory, setTimeHistory] = useState<{ t: number; vm: number; gNa: number; gK: number }[]>(() => {
    const init = [];
    for (let i = 0; i < 150; i++) {
      init.push({ t: i, vm: -70, gNa: 2, gK: 5 });
    }
    return init;
  });

  // Action Potential Event State Machine
  const apStateRef = useRef<{
    active: boolean;
    stage: "idle" | "depol" | "overshoot" | "repol" | "hyperpol" | "passive_decay";
    timer: number;
  }>({
    active: false,
    stage: "idle",
    timer: 0,
  });

  const handleStimulate = (intensity: "subthreshold" | "suprathreshold") => {
    if (apStateRef.current.active) return; // In refractory period

    apStateRef.current.active = true;
    apStateRef.current.timer = 0;

    if (intensity === "subthreshold" || blocker === "ttx") {
      apStateRef.current.stage = "passive_decay";
      setPhase("Subthreshold EPSP (Graded Potential)");
    } else {
      apStateRef.current.stage = "depol";
      setPhase("Phase 01: Regenerative Depolarization");
    }
  };

  const handleReset = () => {
    apStateRef.current = { active: false, stage: "idle", timer: 0 };
    setVm(-70);
    setGNa(2);
    setGK(5);
    setNaGateOpen(false);
    setNaInactivated(false);
    setKGateOpen(false);
    setPhase("Resting State (-70 mV)");
    setBlocker("none");
  };

  // Main Simulation Tick (Hodgkin-Huxley Kinetic approximation)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const ap = apStateRef.current;

      let curVm = -70;
      let curGNa = 2;
      let curGK = 5;
      let curNaOpen = false;
      let curNaInact = false;
      let curKOpen = false;
      let curPhase = "Resting State (-70 mV)";

      if (!ap.active) {
        curVm = -70;
        curGNa = 2;
        curGK = 5;
      } else {
        ap.timer += 1;

        if (ap.stage === "passive_decay") {
          // Passive RC decay
          curVm = -70 + 12 * Math.exp(-ap.timer * 0.15);
          curPhase = "Passive Subthreshold Decay (No Spike)";
          if (ap.timer > 25) {
            ap.active = false;
            ap.stage = "idle";
          }
        } else if (ap.stage === "depol") {
          // Rapid Na+ activation
          curNaOpen = true;
          curGNa = Math.min(95, 2 + ap.timer * 18);
          curVm = Math.min(35, -70 + ap.timer * 22);
          curPhase = "Phase 01: Na⁺ Influx (Depolarization)";

          if (curVm >= 30) {
            ap.stage = "overshoot";
            ap.timer = 0;
          }
        } else if (ap.stage === "overshoot") {
          // Peak & Inactivation
          curNaOpen = true;
          curNaInact = true;
          curGNa = 60;
          curGK = blocker === "tea" ? 5 : Math.min(80, 5 + ap.timer * 15);
          curVm = 35 - ap.timer * 3;
          curPhase = "Phase 02: Overshoot (+35 mV) & Inactivation";

          if (ap.timer > 8) {
            ap.stage = "repol";
            ap.timer = 0;
          }
        } else if (ap.stage === "repol") {
          // Repolarization via K+ efflux
          curNaInact = true;
          curGNa = Math.max(2, 40 - ap.timer * 5);
          curKOpen = blocker !== "tea";
          curGK = blocker === "tea" ? 5 : Math.max(30, 85 - ap.timer * 3);
          curVm = blocker === "tea" ? 10 - ap.timer * 1 : 25 - ap.timer * 8;
          curPhase = "Phase 03: K⁺ Efflux (Repolarization)";

          if (curVm <= -75) {
            ap.stage = "hyperpol";
            ap.timer = 0;
          }
        } else if (ap.stage === "hyperpol") {
          // Undershoot & Refractory Period
          curNaInact = ap.timer < 15;
          curKOpen = ap.timer < 20 && blocker !== "tea";
          curGK = Math.max(5, 30 - ap.timer * 1.5);
          curVm = -85 + ap.timer * 0.75;
          curPhase = "Phase 04: Hyperpolarization & Refractory Period";

          if (ap.timer >= 22 || curVm >= -70.5) {
            curVm = -70;
            ap.active = false;
            ap.stage = "idle";
          }
        }
      }

      setVm(curVm);
      setGNa(curGNa);
      setGK(curGK);
      setNaGateOpen(curNaOpen);
      setNaInactivated(curNaInact);
      setKGateOpen(curKOpen);
      setPhase(curPhase);

      // Append to oscilloscope rolling buffer
      setTimeHistory((prev) => {
        const next = [...prev.slice(1), { t: prev[prev.length - 1].t + 1, vm: curVm, gNa: curGNa, gK: curGK }];
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isPlaying, blocker]);

  return (
    <VisualizationShell
      metadata={metadata}
      controls={
        <ActionPotentialControls
          onStimulate={handleStimulate}
          blocker={blocker}
          setBlocker={setBlocker}
          onReset={handleReset}
          showConductance={showConductance}
          setShowConductance={setShowConductance}
        />
      }
      sidebar={
        <ActionPotentialInfoPanel
          vm={vm}
          phase={phase}
          gNa={gNa}
          gK={gK}
          selectedObject={selectedObject}
          onSelectObject={setSelectedObject}
        />
      }
    >
      <ActionPotentialCanvas
        vm={vm}
        timeHistory={timeHistory}
        phase={phase}
        naGateOpen={naGateOpen}
        naInactivated={naInactivated}
        kGateOpen={kGateOpen}
        blocker={blocker}
        showConductance={showConductance}
        onSelectObject={(id) => setSelectedObject(ACTION_POTENTIAL_INSPECTABLES[id] || null)}
      />
    </VisualizationShell>
  );
}
