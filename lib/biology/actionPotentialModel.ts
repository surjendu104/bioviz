export interface ActionPotentialInspectable {
  id: string;
  name: string;
  category: 'channel' | 'pump' | 'phase' | 'biophysics';
  function: string;
  keyPrinciple: string;
  equation?: string;
  cellularContext?: string;
}

export const ACTION_POTENTIAL_INSPECTABLES: Record<string, ActionPotentialInspectable> = {
  'na-channel': {
    id: 'na-channel',
    name: 'Voltage-Gated Sodium Channel (Nav1.2)',
    category: 'channel',
    function: 'Fast-opening voltage-gated ion channel responsible for the rapid upstroke (depolarization) of the action potential.',
    keyPrinciple: 'Features two gates: an activation gate (m-gate) that opens rapidly upon depolarization above -55 mV, and an inactivation loop (h-gate, ball-and-chain) that plugs the pore within ~1 ms.',
    equation: 'I_Na = g_Na_max · m³ · h · (V_m - E_Na), where E_Na ≈ +60 mV',
    cellularContext: 'Dense in the axon initial segment (AIS) and Nodes of Ranvier for action potential initiation and saltatory transmission.'
  },
  'k-channel': {
    id: 'k-channel',
    name: 'Delayed Rectifier Potassium Channel (Kv1.1)',
    category: 'channel',
    function: 'Voltage-gated potassium channel mediating outward K⁺ current for membrane repolarization.',
    keyPrinciple: 'Opens with a characteristic 0.5–1 ms kinetic delay following depolarization (n-gate), allowing K⁺ efflux down its electrochemical gradient to restore negative potential.',
    equation: 'I_K = g_K_max · n⁴ · (V_m - E_K), where E_K ≈ -90 mV',
    cellularContext: 'Clustered in the juxta-paranodal axon regions to terminate the action potential waveform.'
  },
  'nak-pump': {
    id: 'nak-pump',
    name: 'Na⁺/K⁺-ATPase Electrogenic Pump',
    category: 'pump',
    function: 'P-type primary active transporter consuming 1 ATP to export 3 Na⁺ ions and import 2 K⁺ ions against their concentration gradients.',
    keyPrinciple: 'Maintains long-term ionic gradients: high intracellular K⁺ (~140 mM) and high extracellular Na⁺ (~145 mM). Generates a small net hyperpolarizing outward current.',
    equation: '3 Na⁺_in + 2 K⁺_out + ATP + H2O → 3 Na⁺_out + 2 K⁺_in + ADP + Pi',
    cellularContext: 'Accounts for ~20–40% of all metabolic ATP expenditure in the mammalian brain.'
  },
  'resting-leak': {
    id: 'resting-leak',
    name: 'K⁺ Inward Rectifier / Non-Gated Leak Channels',
    category: 'channel',
    function: 'Constitutively open two-pore domain potassium channels (K2P) establishing resting membrane conductance.',
    keyPrinciple: 'High resting permeability to K⁺ pulls the resting membrane potential close to the Nernst equilibrium potential of potassium (E_K ≈ -90 mV).',
    equation: 'Goldman-Hodgkin-Katz (GHK) Equation: V_m = (RT/F) · ln[(P_K[K⁺]_out + P_Na[Na⁺]_out) / (P_K[K⁺]_in + P_Na[Na⁺]_in)]',
    cellularContext: 'Maintains the stable resting potential of -70 mV in physiological neurons.'
  },
  'depolarization-phase': {
    id: 'depolarization-phase',
    name: 'Depolarization & Hodgkin Cycle (Phase 01)',
    category: 'phase',
    function: 'Regenerative all-or-none upward voltage swing from threshold (-55 mV) to overshoot peak (+35 mV).',
    keyPrinciple: 'Depolarization increases Na⁺ conductance (g_Na), allowing Na⁺ influx, which causes further depolarization—a classic positive feedback loop terminated only by h-gate inactivation.',
    cellularContext: 'Guarantees the all-or-none threshold nature of neuronal firing.'
  },
  'refractory-period': {
    id: 'refractory-period',
    name: 'Absolute & Relative Refractory Periods',
    category: 'biophysics',
    function: 'Enforces unidirectional propagation and limits maximal neuronal spike firing frequency (~500–1000 Hz).',
    keyPrinciple: 'Absolute refractory period is caused by Nav channel inactivation (h-gates closed). Relative refractory period is caused by elevated residual K⁺ conductance (hyperpolarization).',
    cellularContext: 'Prevents backward reverberation of spikes back down the axon toward the soma.'
  }
};
