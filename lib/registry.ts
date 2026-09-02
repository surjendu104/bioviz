export type VisualizationStatus = 'available' | 'in-development';
export type VisualizationCategory = 
  | 'Molecular Genetics'
  | 'Cellular Biophysics'
  | 'Neurophysiology'
  | 'Biochemistry'
  | 'Cell Biology';

export interface VisualizationMetadata {
  id: string;
  title: string;
  shortTitle: string;
  category: VisualizationCategory;
  categoryCode: string;
  eyebrow: string;
  tagline: string;
  description: string;
  scientificConcept: string;
  keyPrinciples: string[];
  status: VisualizationStatus;
  route: string;
  rendererType: 'hybrid' | 'svg' | 'canvas';
  primaryVariables: string[];
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  citation: string;
  previewType: 'cell-structure' | 'dna-structure' | 'dna-replication' | 'osmosis' | 'action-potential' | 'protein-synthesis' | 'enzyme-kinetics' | 'mitosis' | 'photosynthesis' | 'cellular-respiration';
  featuredOrder: number;
}

export const VISUALIZATION_REGISTRY: VisualizationMetadata[] = [
  {
    id: 'cell-structure',
    title: 'Cell Structure: Eukaryotic Architecture',
    shortTitle: 'Cell Structure',
    category: 'Cell Biology',
    categoryCode: 'CEL-01',
    eyebrow: 'Cell Biology / Eukaryotic Organization',
    tagline: 'Internal spatial organization of animal and plant cells: organelles, endomembrane systems, and energy converters.',
    description: 'Explore the architectural organization of eukaryotic animal and plant cells. Inspect organelles in their biologically plausible spatial locations, switch between animal and plant layouts, trace endomembrane trafficking pathways, and zoom into individual organelle ultrastructures.',
    scientificConcept: 'Eukaryotic compartmentalization, endomembrane trafficking, and animal vs plant structural divergence.',
    keyPrinciples: [
      'Membrane compartmentalization separates specialized biochemical environments (e.g. acidic lysosomes, respiratory cristae)',
      'Plant cells are distinguished by rigid cellulose cell walls, large central turgor vacuoles, and photosynthetic chloroplasts',
      'Endomembrane trafficking coordinates protein flow: Nucleus → Rough ER → Golgi Apparatus → Secretory Vesicles / Lysosomes',
      'Mitochondria (aerobic respiration) and Chloroplasts (photosynthesis) originated via primary endosymbiosis'
    ],
    status: 'available',
    route: '/visualizations/cell-structure',
    rendererType: 'hybrid',
    primaryVariables: ['Cell Type (Animal / Plant)', 'Organelle Focus Zoom', 'Endomembrane Pathways', 'Structural Boundaries'],
    difficulty: 'Foundational',
    citation: 'Alberts, B. et al. Molecular Biology of the Cell (6th ed.), Ch. 12 & 14.',
    previewType: 'cell-structure',
    featuredOrder: 1
  },
  {
    id: 'dna-structure',
    title: 'DNA Structure: Double Helix & Base Pairing',
    shortTitle: 'DNA Structure',
    category: 'Molecular Genetics',
    categoryCode: 'GEN-01',
    eyebrow: 'Molecular Genetics / Molecular Architecture',
    tagline: 'Antiparallel double helix, complementary A–T (2 H-bonds) & G–C (3 H-bonds) pairing, and sugar-phosphate backbones.',
    description: 'Explore the architectural principles of DNA. Inspect canonical Watson-Crick base pairs, observe hydrogen bonding geometries, follow antiparallel 5\'→3\' and 3\'→5\' sugar-phosphate backbones, unzip strands reversibly, and discover how molecular structure stores genetic information.',
    scientificConcept: 'Complementary base pairing, hydrogen bonding thermodynamics, and antiparallel helical geometry.',
    keyPrinciples: [
      'Adenine pairs exclusively with Thymine (2 H-bonds); Guanine pairs with Cytosine (3 H-bonds)',
      'The two polynucleotide strands run in opposite stereochemical directions (antiparallel: 5\'→3\' and 3\'→5\')',
      'Sugar-phosphate backbones form the hydrophilic exterior; hydrophobic nitrogenous bases face inward',
      'Unzipping disrupts hydrogen bonds while preserving the continuous covalent phosphodiester backbones'
    ],
    status: 'available',
    route: '/visualizations/dna-structure',
    rendererType: 'hybrid',
    primaryVariables: ['Strand Separation (Unzip)', 'Base Pair Selection', 'Hydrogen Bonds', 'Strand Polarity'],
    difficulty: 'Foundational',
    citation: 'Watson, J. D. & Crick, F. H. C. Molecular Structure of Nucleic Acids. Nature 171, 737–738 (1953).',
    previewType: 'dna-structure',
    featuredOrder: 1
  },
  {
    id: 'dna-replication',
    title: 'DNA Replication & Replisome Coordination',
    shortTitle: 'DNA Replication',
    category: 'Molecular Genetics',
    categoryCode: 'GEN-02',
    eyebrow: 'Molecular Genetics / Replication Fork',
    tagline: '5\' → 3\' directional polymerase elongation, lagging strand Okazaki fragments, and multienzyme replisome mechanics.',
    description: 'Explore the semiconservative copying of genetic duplexes. Observe how DNA Helicase unwinds the double helix, primase provides 3\'-OH RNA primers, DNA Polymerase III executes rapid continuous and discontinuous synthesis, Pol I carries out nick translation, and DNA Ligase seals the phosphodiester backbone.',
    scientificConcept: 'Semiconservative replication, 5\'→3\' polymerase synthesis constraint, and antiparallel fork geometry.',
    keyPrinciples: [
      'Polymerase III synthesizes strictly 5\' → 3\' by nucleophilic attack of the 3\'-OH on incoming dNTPs',
      'Antiparallel strands require leading strand continuous and lagging strand discontinuous (Okazaki) synthesis',
      'Helicase unwinds the parental duplex with ATP hydrolysis while topoisomerase relaxes torsional strain',
      'Pol I excises RNA primers via 5\'→3\' exonuclease; Ligase seals single-strand nicks'
    ],
    status: 'available',
    route: '/visualizations/dna-replication',
    rendererType: 'hybrid',
    primaryVariables: ['Fork Position', 'Replisome State', 'dNTP Flux', 'Strand Polarity'],
    difficulty: 'Intermediate',
    citation: 'Alberts, B. et al. Molecular Biology of the Cell (6th ed.), Ch. 5.',
    previewType: 'dna-replication',
    featuredOrder: 1
  },
  {
    id: 'osmosis',
    title: 'Osmosis, Semipermeability & Osmotic Pressure',
    shortTitle: 'Osmosis & Tonicity',
    category: 'Cellular Biophysics',
    categoryCode: 'BIO-02',
    eyebrow: 'Cellular Biophysics / Membrane Transport',
    tagline: 'Water chemical potential gradients, aquaporin diffusion, and hydrostatic balance across selective lipid bilayers.',
    description: 'Simulate thermodynamic water movement across a selectively permeable membrane. Adjust solute concentration gradients in real-time, witness spontaneous solvent flux from lower solute to higher solute regions, and calculate osmotic pressure via the van \'t Hoff relationship.',
    scientificConcept: 'Solvent chemical potential equilibrium across semipermeable barriers and cell tonicity dynamics.',
    keyPrinciples: [
      'Water flows down its chemical potential gradient through selective aquaporin pores',
      'Impermeable solute particles lower solvent chemical activity, driving net osmotic inflow',
      'Osmotic pressure (Π = iMRT) balances the hydrostatic pressure head at thermodynamic equilibrium',
      'Extracellular tonicity governs red blood cell swelling (hypotonic lysis) or shrinkage (hypertonic crenation)'
    ],
    status: 'available',
    route: '/visualizations/osmosis',
    rendererType: 'hybrid',
    primaryVariables: ['Solute ΔC', 'Membrane Permeability', 'Hydrostatic Head (h)', 'Cell Tonicity'],
    difficulty: 'Foundational',
    citation: 'Lodish, H. et al. Molecular Cell Biology (8th ed.), Ch. 11.',
    previewType: 'osmosis',
    featuredOrder: 2
  },
  {
    id: 'action-potential',
    title: 'Action Potential & Voltage-Gated Ion Channels',
    shortTitle: 'Action Potential',
    category: 'Neurophysiology',
    categoryCode: 'NEU-03',
    eyebrow: 'Neurophysiology / Hodgkin-Huxley Kinetics',
    tagline: 'Transient membrane depolarization, Na+/K+ channel gating kinetics, and electrical spike propagation.',
    description: 'Experiment with excitable neuronal membranes. Inject electrical current to reach the -55 mV threshold, observe the explosive opening of voltage-gated Na+ activation gates, ball-and-chain inactivation, delayed rectifier K+ repolarization, and the refractory period.',
    scientificConcept: 'Time- and voltage-dependent ionic conductances underlying all-or-none electrical signaling.',
    keyPrinciples: [
      'Resting potential (-70 mV) is maintained by Na+/K+ ATPase and non-gated K+ leak channels',
      'Suprathreshold depolarization triggers regenerative Na+ channel opening (Hodgkin cycle)',
      'Na+ channel inactivation and delayed K+ channel opening mediate rapid repolarization',
      'Absolute and relative refractory periods enforce unidirectional propagation and rate coding'
    ],
    status: 'available',
    route: '/visualizations/action-potential',
    rendererType: 'hybrid',
    primaryVariables: ['Membrane Potential V_m', 'g_Na Conductance', 'g_K Conductance', 'Stimulus Current'],
    difficulty: 'Advanced',
    citation: 'Kandel, E. R. et al. Principles of Neural Science (5th ed.), Ch. 7.',
    previewType: 'action-potential',
    featuredOrder: 3
  },
  {
    id: 'enzyme-kinetics',
    title: 'Enzyme Kinetics & Michaelis-Menten Mechanics',
    shortTitle: 'Enzyme Kinetics',
    category: 'Biochemistry',
    categoryCode: 'BCH-04',
    eyebrow: 'Biochemistry / Reaction Catalysis',
    tagline: 'Substrate saturation hyperbolic curves, catalytic turnover (kcat), and competitive vs non-competitive inhibition.',
    description: 'Investigate the rate of enzyme-catalyzed biochemical reactions. Manipulate substrate concentration [S], observe the transition from first-order to zero-order kinetics as active sites saturate at Vmax, and compare reversible enzyme inhibitors on Michaelis-Menten and Lineweaver-Burk plots.',
    scientificConcept: 'Enzyme-substrate intermediate complex equilibrium and steady-state hyperbolic saturation.',
    keyPrinciples: [
      'At low [S], reaction velocity v is linearly proportional to substrate concentration (first-order)',
      'At high [S], all enzyme active sites are occupied, reaching asymptotic saturation Vmax (zero-order)',
      'The Michaelis constant Km represents the substrate concentration at half-maximal velocity (Vmax / 2)',
      'Competitive inhibitors increase apparent Km without altering Vmax; noncompetitive inhibitors lower Vmax'
    ],
    status: 'available',
    route: '/visualizations/enzyme-kinetics',
    rendererType: 'hybrid',
    primaryVariables: ['Substrate [S]', 'Inhibitor Type', 'Velocity v', 'Km & Vmax'],
    difficulty: 'Intermediate',
    citation: 'Berg, J. M., Tymoczko, J. L., Stryer, L. Biochemistry (8th ed.), Ch. 12.',
    previewType: 'enzyme-kinetics',
    featuredOrder: 4
  },
  {
    id: 'protein-synthesis',
    title: 'Protein Synthesis: Ribosomal Translation',
    shortTitle: 'Protein Synthesis',
    category: 'Molecular Genetics',
    categoryCode: 'GEN-05',
    eyebrow: 'Molecular Genetics / Translation Complex',
    tagline: 'mRNA triplet codon reading, aminoacyl-tRNA recruitment, and peptidyl transferase chain elongation.',
    description: 'Follow the molecular decoding of messenger RNA into polypeptide chains. Observe ribosomal A (aminoacyl), P (peptidyl), and E (exit) site transitions, peptide bond formation, GTP-dependent translocation, and termination via release factors.',
    scientificConcept: 'Sequential triplet codon decoding and catalytic ribosomal peptide elongation.',
    keyPrinciples: [
      'Ribosome small subunit reads mRNA 5\' → 3\'; initiator tRNA binds the AUG start codon',
      'Cognate aminoacyl-tRNA enters the A site driven by elongation factor EF-Tu · GTP hydrolysis',
      'Peptidyl transferase ribozyme in the large subunit catalyzes peptide bond synthesis',
      'Translocation advances mRNA by exactly 3 nucleotides (one codon), shifting uncharged tRNA to the E site'
    ],
    status: 'available',
    route: '/visualizations/protein-synthesis',
    rendererType: 'hybrid',
    primaryVariables: ['Codon Position', 'tRNA A/P/E Occupancy', 'Peptide Chain Length', 'GTP Energy'],
    difficulty: 'Intermediate',
    citation: 'Alberts, B. et al. Molecular Biology of the Cell (6th ed.), Ch. 6.',
    previewType: 'protein-synthesis',
    featuredOrder: 5
  },
  {
    id: 'mitosis',
    title: 'Mitosis & Kinetochore Spindle Dynamics',
    shortTitle: 'Mitosis',
    category: 'Cell Biology',
    categoryCode: 'CEL-06',
    eyebrow: 'Cell Biology / Chromosome Segregation',
    tagline: 'Microtubule spindle assembly, metaphase plate alignment, and equational sister chromatid segregation.',
    description: 'Explore the mechanical choreography of cell division across Prophase, Prometaphase, Metaphase, Anaphase, and Telophase. Observe kinetochore tension sensing and spindle checkpoint mechanics.',
    scientificConcept: 'Equal distribution of duplicated genome to two genetically identical daughter nuclei.',
    keyPrinciples: [
      'Chromatin condenses into sister chromatid pairs joined at centromeres',
      'Kinetochores capture dynamic microtubule plus-ends from opposing centrosomes (biorientation)',
      'Spindle Assembly Checkpoint (SAC) delays anaphase onset until all chromosomes exhibit bi-directional tension',
      'Separase cleaves cohesin rings, allowing Anaphase A & B poleward chromatid segregation'
    ],
    status: 'in-development',
    route: '/visualizations/mitosis',
    rendererType: 'hybrid',
    primaryVariables: ['Mitotic Phase', 'Microtubule Tension', 'Cohesin Cleavage', 'Spindle Checkpoint'],
    difficulty: 'Intermediate',
    citation: 'Morgan, D. O. The Cell Cycle: Principles of Control (1st ed.).',
    previewType: 'mitosis',
    featuredOrder: 6
  },
  {
    id: 'photosynthesis',
    title: 'Photosynthetic Light Reactions & Z-Scheme',
    shortTitle: 'Photosynthesis (Light Reactions)',
    category: 'Biochemistry',
    categoryCode: 'BCH-07',
    eyebrow: 'Biochemistry / Photophosphorylation',
    tagline: 'Photon absorption, Photosystem II water photolysis, plastoquinone shuttle, and proton gradient ATP synthesis.',
    description: 'Trace electron transport across the thylakoid membrane from water to NADP+, driving proton accumulation in the lumen and chemiosmotic ATP synthesis via CF0CF1 ATP synthase.',
    scientificConcept: 'Light-driven redox potential climb (Z-scheme) coupling electron transport to proton motive force.',
    keyPrinciples: [
      'P680 reaction center excited by light extracts electrons via water oxidation (O2 byproduct)',
      'Cytochrome b6f complex pumps protons into thylakoid lumen establishing ΔpH',
      'Photosystem I (P700) re-energizes electrons for reduction of NADP+ to NADPH by FNR',
      'Proton motive force drives rotational catalysis of ATP Synthase in the stroma'
    ],
    status: 'in-development',
    route: '/visualizations/photosynthesis',
    rendererType: 'hybrid',
    primaryVariables: ['Photon Flux', 'Lumen pH Gradient', 'Electron Redox Potential', 'ATP Output'],
    difficulty: 'Advanced',
    citation: 'Taiz, L. et al. Plant Physiology and Development (6th ed.), Ch. 7.',
    previewType: 'photosynthesis',
    featuredOrder: 7
  },
  {
    id: 'cellular-respiration',
    title: 'Cellular Respiration: Electron Transport & Chemiosmosis',
    shortTitle: 'Cellular Respiration',
    category: 'Biochemistry',
    categoryCode: 'BCH-08',
    eyebrow: 'Biochemistry / Oxidative Phosphorylation',
    tagline: 'Mitochondrial Complexes I–IV redox cascade, proton pumping, and rotary ATP synthesis.',
    description: 'Follow high-energy electrons from NADH and FADH2 through Complexes I, II, III, and IV to terminal oxygen, generating the electrochemical proton gradient that drives the F1F0 ATP synthase motor.',
    scientificConcept: 'Chemiosmotic coupling of mitochondrial respiratory electron transfer to oxidative phosphorylation.',
    keyPrinciples: [
      'NADH and FADH2 donate electrons to Complexes I and II respectively',
      'Protons are translocated across the inner mitochondrial membrane into the intermembrane space',
      'Molecular O2 acts as the terminal electron acceptor, forming metabolic water (H2O)',
      'Electrochemical gradient (ΔΨ + ΔpH) powers ATP synthase rotor rotation to synthesize ATP'
    ],
    status: 'in-development',
    route: '/visualizations/cellular-respiration',
    rendererType: 'hybrid',
    primaryVariables: ['NADH/NAD+ Ratio', 'Intermembrane ΔΨ', 'O2 Consumption', 'ATP Production'],
    difficulty: 'Advanced',
    citation: 'Nelson, D. L., Cox, M. M. Lehninger Principles of Biochemistry (7th ed.), Ch. 19.',
    previewType: 'cellular-respiration',
    featuredOrder: 8
  }
];

export function getVisualizationById(id: string): VisualizationMetadata | undefined {
  return VISUALIZATION_REGISTRY.find((item) => item.id === id);
}

export function getAvailableVisualizations(): VisualizationMetadata[] {
  return VISUALIZATION_REGISTRY.filter((item) => item.status === 'available');
}
