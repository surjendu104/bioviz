export interface OsmosisParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'water' | 'solute';
  chamber: 'left' | 'right';
  radius: number;
  mass: number;
}

export interface OsmosisInspectableObject {
  id: string;
  name: string;
  category: 'membrane' | 'molecule' | 'force' | 'physiology';
  function: string;
  keyPrinciple: string;
  equation?: string;
  cellularContext?: string;
}

export const OSMOSIS_INSPECTABLES: Record<string, OsmosisInspectableObject> = {
  'lipid-bilayer': {
    id: 'lipid-bilayer',
    name: 'Selectively Permeable Lipid Bilayer',
    category: 'membrane',
    function: 'Forms an amphipathic hydrophobic barrier that restricts polar/charged solutes while permitting small non-polar molecules and controlled water flux.',
    keyPrinciple: 'Hydrophobic core (~3 nm thick) presents a high free energy barrier to charged and large polar solutes.',
    equation: 'Permeability P = (K · D) / Δx (where K = partition coeff, D = diffusion coeff)',
    cellularContext: 'Plasma membrane separating intracellular cytosol from extracellular interstitial fluid.'
  },
  'aquaporin': {
    id: 'aquaporin',
    name: 'Aquaporin-1 (AQP1) Water Channel',
    category: 'membrane',
    function: 'Tetrameric water-selective protein channel accelerating bidirectional osmotic water transport (~3 × 10⁹ molecules/sec/monomer).',
    keyPrinciple: 'Conserved NPA (Asn-Pro-Ala) motif and narrow selectivity filter (2.8 Å) exclude protons and ions by preventing Grotthuss proton hopping.',
    cellularContext: 'Abundant in red blood cells and renal proximal tubule epithelia for rapid water equilibration.'
  },
  'water-molecule': {
    id: 'water-molecule',
    name: 'Water Dipole (Solvent)',
    category: 'molecule',
    function: 'Universal biological solvent with polar covalent structure and transient hydrogen bonding network.',
    keyPrinciple: 'Moves down its chemical potential gradient from regions of lower solute concentration (higher solvent activity) to higher solute concentration.',
    equation: 'μ_w = μ_w° + R·T·ln(a_w) + V_w·P',
    cellularContext: 'Constitutes ~70% of cell mass, providing the aqueous medium for all biochemical reactions.'
  },
  'solute-particle': {
    id: 'solute-particle',
    name: 'Sucrose / Hydrated Solute Ion',
    category: 'molecule',
    function: 'Impermeable solute that binds water molecules into hydration shells, reducing the concentration of free, unbonded water.',
    keyPrinciple: 'Cannot cross the semipermeable barrier; creates the chemical potential gradient that drives net osmotic influx.',
    cellularContext: 'Osmotically active solutes include extracellular Na⁺/Cl⁻ and intracellular K⁺/proteins.'
  },
  'osmotic-pressure': {
    id: 'osmotic-pressure',
    name: 'Osmotic Pressure (Π)',
    category: 'force',
    function: 'The exact hydrostatic pressure required to prevent the net inward flow of solvent across a semipermeable membrane.',
    keyPrinciple: 'Calculated via the van \'t Hoff law; directly proportional to solute osmolarity and absolute temperature.',
    equation: 'Π = i · M · R · T (i = van \'t Hoff factor, M = molarity, R = 8.314 J/mol·K, T = Kelvins)',
    cellularContext: 'Governs intracellular turgor pressure in plants and capillary Starling forces in animal microcirculation.'
  },
  'tonicity': {
    id: 'tonicity',
    name: 'Cellular Tonicity & Volume Regulation',
    category: 'physiology',
    function: 'The effective osmotic pressure gradient between a cell interior and external bath governing cell volume changes.',
    keyPrinciple: 'Hypotonic environments cause water influx and cell swelling/lysis; Hypertonic causes water efflux and crenation/plasmolysis; Isotonic maintains homeostatic volume.',
    cellularContext: 'Regulated tightly in animals by the renal countercurrent multiplier and antidiuretic hormone (ADH).'
  }
};
