export type CellType = 'animal' | 'plant';

export type OrganelleCategory = 'genetic' | 'energy' | 'endomembrane' | 'boundary' | 'structural';

export interface OrganelleRelationship {
  targetId: string;
  targetName: string;
  relationshipType: 'functional' | 'spatial' | 'trafficking' | 'structural';
  description: string;
}

export interface OrganelleSubstructure {
  name: string;
  description: string;
}

export interface OrganelleData {
  id: string;
  name: string;
  subtitle: string;
  category: OrganelleCategory;
  categoryLabel: string;
  foundIn: 'both' | 'animal-only' | 'plant-only';
  function: string;
  structure: string;
  location: string;
  keyPrinciple: string;
  dimensions: string;
  relationships: OrganelleRelationship[];
  substructures: OrganelleSubstructure[];
  cellularSignificance: string;
}

export const ORGANELLES: Record<string, OrganelleData> = {
  'nucleus': {
    id: 'nucleus',
    name: 'Nucleus',
    subtitle: 'Genetic Storage & Transcriptional Control',
    category: 'genetic',
    categoryLabel: 'Genetic Center',
    foundIn: 'both',
    function: 'Houses genomic DNA organized into chromatin; serves as the primary site of DNA replication and gene transcription into pre-mRNA and non-coding RNAs.',
    structure: 'Enclosed by a double-membrane nuclear envelope perforated by nuclear pore complexes (~120 nm in diameter); contains chromatin and nucleolus.',
    location: 'Central or eccentric eukaryotic compartment (displaced peripherally in plant cells by the central vacuole).',
    keyPrinciple: 'Spatial compartmentalization of transcription (nucleus) from translation (cytoplasm) permits complex post-transcriptional RNA processing in eukaryotes.',
    dimensions: '5–10 μm diameter (largest organelle in animal cells)',
    relationships: [
      {
        targetId: 'nucleolus',
        targetName: 'Nucleolus',
        relationshipType: 'spatial',
        description: 'Contains the nucleolus where rRNA transcription and ribosomal subunit pre-assembly occur.'
      },
      {
        targetId: 'nuclear-envelope',
        targetName: 'Nuclear Envelope',
        relationshipType: 'spatial',
        description: 'Bounded by the nuclear envelope, whose outer membrane is contiguous with the rough endoplasmic reticulum.'
      },
      {
        targetId: 'rough-er',
        targetName: 'Rough Endoplasmic Reticulum',
        relationshipType: 'trafficking',
        description: 'Transcribes mRNA molecules that exit nuclear pores to be translated on rough ER ribosomes.'
      }
    ],
    substructures: [
      { name: 'Chromatin', description: 'Complex of genomic DNA wound around basic histone octamers (euchromatin and heterochromatin).' },
      { name: 'Nucleoplasm', description: 'Aqueous fluid containing nucleotides, RNA polymerases, and transcription factors.' },
      { name: 'Nuclear Lamina', description: 'Meshwork of intermediate filament lamins providing structural scaffolding beneath the inner membrane.' }
    ],
    cellularSignificance: 'Guards the master genetic blueprint and coordinates cell growth, metabolism, and division.'
  },
  'nucleolus': {
    id: 'nucleolus',
    name: 'Nucleolus',
    subtitle: 'Ribosome Assembly Center',
    category: 'genetic',
    categoryLabel: 'Ribosomal Synthesis',
    foundIn: 'both',
    function: 'Transcribes ribosomal RNA (rRNA) genes via RNA Polymerase I and assembles rRNA with imported ribosomal proteins into 40S and 60S preribosomal subunits.',
    structure: 'Dense, non-membrane-bound biomolecular condensate formed through liquid-liquid phase separation (LLPS); comprises fibrillar centers, dense fibrillar component, and granular component.',
    location: 'Inside the nucleus; dissolves during mitosis and reassembles at nucleolar organizer regions (NORs) during telophase.',
    keyPrinciple: 'Massive biosynthetic hub producing up to ~10,000 ribosomes per minute in rapidly dividing cells.',
    dimensions: '1–3 μm diameter',
    relationships: [
      {
        targetId: 'nucleus',
        targetName: 'Nucleus',
        relationshipType: 'spatial',
        description: 'Located within the nucleoplasm around chromosomal Nucleolar Organizer Regions (NORs).'
      },
      {
        targetId: 'ribosomes',
        targetName: 'Ribosomes',
        relationshipType: 'functional',
        description: 'Synthesizes and exports preribosomal subunits through nuclear pores to form mature cytoplasmic ribosomes.'
      }
    ],
    substructures: [
      { name: 'Fibrillar Center (FC)', description: 'Houses tandem arrays of rDNA genes and RNA Polymerase I.' },
      { name: 'Dense Fibrillar Component (DFC)', description: 'Site of nascent pre-rRNA transcript cleavage and 2′-O-methylation / pseudouridylation.' },
      { name: 'Granular Component (GC)', description: 'Assembly site where processed rRNAs assemble with ribosomal proteins into subunits.' }
    ],
    cellularSignificance: 'Controls cellular translation capacity; nucleolar hypertrophy is a primary hallmark of hyperproliferative cancer cells.'
  },
  'nuclear-envelope': {
    id: 'nuclear-envelope',
    name: 'Nuclear Envelope & Pores',
    subtitle: 'Selective Nucleocytoplasmic Barrier',
    category: 'genetic',
    categoryLabel: 'Nuclear Barrier',
    foundIn: 'both',
    function: 'Encloses the genetic material and strictly regulates bidirectional macromolecular traffic (import of histones/polymerases, export of mRNAs/tRNAs/ribosomal subunits).',
    structure: 'Two concentric lipid bilayers (inner and outer nuclear membranes) separated by a 20–40 nm perinuclear space, fused at nuclear pore complexes (NPCs).',
    location: 'Boundary surrounding the nucleus; outer membrane is studded with ribosomes and continuous with the ER.',
    keyPrinciple: 'Nuclear pore complexes utilize FG-repeat nucleoporins (hydrophobic phenylalanyl-glycine mesh) to exclude molecules >40 kDa without specific nuclear transport receptors (importins/exportins).',
    dimensions: 'Outer/inner bilayer: ~7 nm each; Perinuclear space: 20–40 nm; Pore diameter: ~120 nm',
    relationships: [
      {
        targetId: 'nucleus',
        targetName: 'Nucleus',
        relationshipType: 'spatial',
        description: 'Defines the structural perimeter of the nuclear compartment.'
      },
      {
        targetId: 'rough-er',
        targetName: 'Rough ER',
        relationshipType: 'spatial',
        description: 'Outer nuclear membrane is physically contiguous with the rough ER cisternal membrane network.'
      }
    ],
    substructures: [
      { name: 'Nuclear Pore Complex (NPC)', description: 'Octagonal 125-MDa macromolecular assembly with cytosolic filaments and nuclear basket.' },
      { name: 'Perinuclear Space', description: 'Lumen between inner and outer membranes, continuous with the ER lumen.' }
    ],
    cellularSignificance: 'Prevents immature, un-spliced RNA transcripts from being prematurely translated by cytoplasmic ribosomes.'
  },
  'mitochondria': {
    id: 'mitochondria',
    name: 'Mitochondrion',
    subtitle: 'Cellular Respiration & ATP Generation',
    category: 'energy',
    categoryLabel: 'Energy Metabolism',
    foundIn: 'both',
    function: 'Generates the majority of cellular ATP via the citric acid (Krebs) cycle, fatty acid β-oxidation, and oxidative phosphorylation along the electron transport chain.',
    structure: 'Double-membrane organelle: smooth outer membrane (porin channels) and highly invaginated inner membrane forming cristae; enclosed internal matrix contains mtDNA and 70S ribosomes.',
    location: 'Distributed throughout the cytosol; dynamically clusters at sites of high ATP consumption (e.g. myofibrils, synaptic terminals).',
    keyPrinciple: 'Proton pumping across the inner mitochondrial membrane establishes an electrochemical gradient (proton motive force Δp) that drives rotational catalysis of ATP Synthase.',
    dimensions: '0.5–1.0 μm width, 1–7 μm length (highly dynamic via fission and fusion)',
    relationships: [
      {
        targetId: 'cytoplasm',
        targetName: 'Cytoplasm',
        relationshipType: 'functional',
        description: 'Consumes pyruvate generated by cytosolic glycolysis to drive aerobic respiration.'
      },
      {
        targetId: 'chloroplast',
        targetName: 'Chloroplast (in plants)',
        relationshipType: 'functional',
        description: 'Consumes photosynthetic carbohydrates and oxygen generated by chloroplasts to produce metabolic ATP.'
      }
    ],
    substructures: [
      { name: 'Cristae', description: 'Extensive inner membrane folds that dramatically increase surface area for respiratory Complexes I–IV and ATP Synthase.' },
      { name: 'Matrix', description: 'Viscous interior containing pyruvate dehydrogenase, Krebs cycle enzymes, mitochondrial DNA, and ribosomes.' },
      { name: 'Intermembrane Space', description: 'Compartment where protons are concentrated (low pH) to power chemiosmotic ATP synthesis.' }
    ],
    cellularSignificance: 'Originating via endosymbiosis of an α-proteobacterium ~1.8 billion years ago; central regulator of intrinsic apoptosis via cytochrome c release.'
  },
  'chloroplast': {
    id: 'chloroplast',
    name: 'Chloroplast',
    subtitle: 'Photosynthetic Sugar Synthesis',
    category: 'energy',
    categoryLabel: 'Photosynthesis',
    foundIn: 'plant-only',
    function: 'Converts solar light energy into chemical potential energy (sugars) via the light reactions of photosynthesis (water photolysis, NADPH/ATP synthesis) and carbon fixation (Calvin cycle).',
    structure: 'Triple-membrane plastid: outer membrane, inner membrane (stroma envelope), and internal thylakoid membrane organized into disc-like granum stacks containing chlorophyll pigments.',
    location: 'Distributed along the periphery of plant photosynthetic mesophyll cells, oriented toward incident sunlight.',
    keyPrinciple: 'Photosystems II and I in the thylakoid membrane capture photon energy to split H₂O (releasing O₂), generating a lumenal proton gradient that drives ATP synthesis and sugar production in the stroma.',
    dimensions: '4–6 μm diameter, 1–3 μm thickness',
    relationships: [
      {
        targetId: 'mitochondria',
        targetName: 'Mitochondria',
        relationshipType: 'functional',
        description: 'Produces glucose and O₂ that are catabolized by plant mitochondria to sustain cellular respiration at night.'
      },
      {
        targetId: 'central-vacuole',
        targetName: 'Central Vacuole',
        relationshipType: 'spatial',
        description: 'Pressed against the plasma membrane and cell wall by the turgid central vacuole for optimal light interception.'
      }
    ],
    substructures: [
      { name: 'Thylakoid Grana', description: 'Membrane stacks containing Photosystems I & II, light-harvesting chlorophyll a/b complexes, and ATP synthase.' },
      { name: 'Stroma', description: 'Aqueous alkaline fluid containing RuBisCO, Calvin cycle enzymes, plastid DNA (cpDNA), and 70S ribosomes.' },
      { name: 'Thylakoid Lumen', description: 'Internal compartment where protons accumulate (pH ~4.5) during photosynthetic electron transport.' }
    ],
    cellularSignificance: 'Evolved via primary endosymbiosis of a photosynthetic cyanobacterium; the ultimate primary energy converter for virtually all terrestrial biosphere ecosystems.'
  },
  'central-vacuole': {
    id: 'central-vacuole',
    name: 'Large Central Vacuole',
    subtitle: 'Turgor Pressure & Hydrostatic Support',
    category: 'endomembrane',
    categoryLabel: 'Hydrostatic Storage',
    foundIn: 'plant-only',
    function: 'Maintains plant hydrostatic turgor pressure against the cell wall, stores water, inorganic ions, pigments (anthocyanins), and defensive secondary metabolites, and performs hydrolytic waste degradation.',
    structure: 'Massive fluid-filled internal compartment bounded by a selectively permeable tonoplast membrane equipped with proton v-ATPases and aquaporins.',
    location: 'Occupies 30% to 90% of mature plant cell internal volume, pushing the cytoplasm, nucleus, and chloroplasts against the cell wall.',
    keyPrinciple: 'Active accumulation of solute ions (K⁺, Cl⁻, malate) inside the vacuole draws water in by osmosis, generating internal turgor pressure (~0.1 to 1.0 MPa) that keeps non-woody plant tissue rigid.',
    dimensions: 'Occupies up to 80–90% of cell volume in mature parenchyma cells',
    relationships: [
      {
        targetId: 'cell-wall',
        targetName: 'Cell Wall',
        relationshipType: 'functional',
        description: 'Exerts outward hydrostatic turgor pressure against the rigid cell wall, preventing plant wilting.'
      },
      {
        targetId: 'chloroplast',
        targetName: 'Chloroplasts',
        relationshipType: 'spatial',
        description: 'Forces chloroplasts into a thin peripheral cytoplasmic layer optimized for light capture.'
      }
    ],
    substructures: [
      { name: 'Tonoplast Membrane', description: 'Single lipid bilayer containing proton-pumping v-ATPases, pyrophosphatases, and ion transporters.' },
      { name: 'Cell Sap', description: 'Hypertonic aqueous solution containing sugars, amino acids, mineral ions, tannins, and anthocyanin pigments.' }
    ],
    cellularSignificance: 'Enables plant cells to increase dramatically in physical size with minimal metabolic synthesis cost by simply accumulating water.'
  },
  'rough-er': {
    id: 'rough-er',
    name: 'Rough Endoplasmic Reticulum (RER)',
    subtitle: 'Secretory Protein Synthesis & Folding',
    category: 'endomembrane',
    categoryLabel: 'Protein Processing',
    foundIn: 'both',
    function: 'Site of co-translational translocation, chaperone-assisted folding, disulfide bond formation, and core N-linked glycosylation of membrane, lysosomal, and secretory proteins.',
    structure: 'Interconnected network of flattened membrane sacs (cisternae) studded on the cytosolic face with translating 80S ribosomes; continuous with outer nuclear membrane.',
    location: 'Perinuclear cytoplasm surrounding the nucleus.',
    keyPrinciple: 'Nascent polypeptide chains bearing an N-terminal hydrophobic signal sequence are recognized by SRP (Signal Recognition Particle) and threaded into the ER lumen via the Sec61 translocon channel.',
    dimensions: 'Membrane tubules and sheets spanning 20–40% of total cell membrane area',
    relationships: [
      {
        targetId: 'ribosomes',
        targetName: 'Ribosomes',
        relationshipType: 'spatial',
        description: 'Studded with ribosomes that inject nascent polypeptide chains directly into the RER lumen.'
      },
      {
        targetId: 'golgi-apparatus',
        targetName: 'Golgi Apparatus',
        relationshipType: 'trafficking',
        description: 'Packages properly folded proteins into COPII-coated transport vesicles destined for the cis-Golgi.'
      },
      {
        targetId: 'nuclear-envelope',
        targetName: 'Nuclear Envelope',
        relationshipType: 'spatial',
        description: 'Membrane is physically continuous with the outer membrane of the nuclear envelope.'
      }
    ],
    substructures: [
      { name: 'Cisternae Lumen', description: 'Oxidizing internal compartment containing BiP chaperones, protein disulfide isomerases (PDI), and oligosaccharyltransferase.' },
      { name: 'Sec61 Translocon', description: 'Pore-forming protein complex mediating polypeptide translocation across the ER membrane.' }
    ],
    cellularSignificance: 'Implements rigorous ER Quality Control (ERQC); misfolded proteins are targeted for ER-associated degradation (ERAD) by cytosolic proteasomes.'
  },
  'smooth-er': {
    id: 'smooth-er',
    name: 'Smooth Endoplasmic Reticulum (SER)',
    subtitle: 'Lipid Biosynthesis & Detoxification',
    category: 'endomembrane',
    categoryLabel: 'Lipid Biosynthesis',
    foundIn: 'both',
    function: 'Synthesizes membrane phospholipids, cholesterol, and steroid hormones; metabolizes carbohydrates; detoxifies hydrophobic drugs/poisons via cytochrome P450 enzymes; sequesters Ca²⁺ ions.',
    structure: 'Tubular, branched anastomosing membrane network completely devoid of bound ribosomes.',
    location: 'Adjacent to and continuous with rough ER cisternae; prominent in hepatocytes and steroidogenic adrenal cells.',
    keyPrinciple: 'Hydrophobic enzymes embedded in the SER bilayer synthesize all major eukaryotic cellular lipids (phosphoglycerides, ceramide, sterols) on the cytosolic leaflet.',
    dimensions: 'Tubular diameter: 30–60 nm',
    relationships: [
      {
        targetId: 'rough-er',
        targetName: 'Rough ER',
        relationshipType: 'spatial',
        description: 'Physically continuous with rough ER cisternae, sharing the same continuous luminal space.'
      },
      {
        targetId: 'golgi-apparatus',
        targetName: 'Golgi Apparatus',
        relationshipType: 'trafficking',
        description: 'Supplies newly synthesized membrane lipids and lipid-anchored molecules to the Golgi via vesicles and lipid transfer proteins.'
      }
    ],
    substructures: [
      { name: 'SER Tubules', description: 'Smooth, curved membrane tubules optimized for lipid-modifying enzymes.' },
      { name: 'Sarcoplasmic Reticulum', description: 'Specialized SER in muscle cells storing high-concentration Ca²⁺ for excitation-contraction coupling.' }
    ],
    cellularSignificance: 'Rapidly proliferates in hepatocytes upon chronic exposure to xenobiotic toxins or pharmaceutical sedatives (phenobarbital).'
  },
  'golgi-apparatus': {
    id: 'golgi-apparatus',
    name: 'Golgi Apparatus',
    subtitle: 'Protein Modification & Vesicle Sorting',
    category: 'endomembrane',
    categoryLabel: 'Molecular Post Office',
    foundIn: 'both',
    function: 'Modifies, sorts, and packages glycoproteins and glycolipids arriving from the ER; performs terminal O-linked and complex N-linked glycosylation, sulfation, and phosphorylation (e.g. Mannose-6-Phosphate tag for lysosomes).',
    structure: 'Polarized stack of 4–8 flattened, cup-shaped membrane cisternae with associated vesicular clusters: cis-Golgi network (entry), medial cisternae, and trans-Golgi network (TGN, exit).',
    location: 'Perinuclear zone near the centrosome in animal cells; dispersed as discrete mobile dictyosome stacks in plant cells.',
    keyPrinciple: 'Cisternal maturation model: cisternae physically progress from cis to trans, remodeling their enzymatic cargo via retrograde COPI vesicle recycling.',
    dimensions: '1–3 μm stack diameter, individual cisterna thickness ~20–30 nm',
    relationships: [
      {
        targetId: 'rough-er',
        targetName: 'Rough ER',
        relationshipType: 'trafficking',
        description: 'Receives newly synthesized proteins in COPII transport vesicles at the cis-Golgi entry face.'
      },
      {
        targetId: 'lysosomes',
        targetName: 'Lysosomes',
        relationshipType: 'trafficking',
        description: 'Tags hydrolytic enzymes with Mannose-6-Phosphate (M6P) and buds clathrin-coated vesicles to form lysosomes.'
      },
      {
        targetId: 'plasma-membrane',
        targetName: 'Plasma Membrane',
        relationshipType: 'trafficking',
        description: 'Directs secretory vesicles to fuse with the plasma membrane for constitutive and regulated exocytosis.'
      }
    ],
    substructures: [
      { name: 'cis-Golgi Network (CGN)', description: 'Receives ER vesicles and phosphorylates lysosomal oligosaccharides.' },
      { name: 'Medial Cisternae', description: 'Removes mannose residues and adds N-acetylglucosamine (GlcNAc).' },
      { name: 'trans-Golgi Network (TGN)', description: 'Major sorting hub budding secretory vesicles, lysosomal transport vesicles, and membrane carriers.' }
    ],
    cellularSignificance: 'Ensures that every synthesized cellular protein is stamped with the correct molecular zip code to reach its final biological destination.'
  },
  'ribosomes': {
    id: 'ribosomes',
    name: 'Ribosomes',
    subtitle: 'Protein Translation Engines',
    category: 'genetic',
    categoryLabel: 'Translation Machinery',
    foundIn: 'both',
    function: 'Catalyzes the translation of mRNA triplet codons into polypeptide amino acid chains via peptidyl transferase ribozyme activity.',
    structure: 'Non-membrane ribonucleoprotein particle composed of a large 60S subunit (28S, 5.8S, 5S rRNAs + ~49 proteins) and a small 40S subunit (18S rRNA + ~33 proteins), forming an 80S eukaryotic complex.',
    location: 'Freely suspended in the aqueous cytosol (synthesizing cytoplasmic/nuclear/mitochondrial proteins) or docked onto the rough ER membrane (synthesizing secretory/membrane proteins).',
    keyPrinciple: 'Ribosomes are catalytic ribozymes where ribosomal RNA (28S rRNA in large subunit) directly catalyzes peptide bond formation between aminoacyl-tRNA in the A-site and peptidyl-tRNA in the P-site.',
    dimensions: '25–30 nm diameter',
    relationships: [
      {
        targetId: 'nucleolus',
        targetName: 'Nucleolus',
        relationshipType: 'functional',
        description: 'Preribosomal subunits are transcribed and pre-assembled inside the nucleolus before export to the cytoplasm.'
      },
      {
        targetId: 'rough-er',
        targetName: 'Rough ER',
        relationshipType: 'spatial',
        description: 'Tethered to Sec61 translocons on the rough ER membrane when synthesizing proteins with N-terminal signal peptides.'
      }
    ],
    substructures: [
      { name: '60S Large Subunit', description: 'Contains the Peptidyl Transferase Center (PTC) and exit tunnel for the nascent polypeptide.' },
      { name: '40S Small Subunit', description: 'Contains the mRNA decoding center matching codons with tRNA anticodons.' }
    ],
    cellularSignificance: 'A single mammalian cell contains roughly 10 million ribosomes, expending >60% of total cellular metabolic energy on protein synthesis.'
  },
  'lysosomes': {
    id: 'lysosomes',
    name: 'Lysosomes',
    subtitle: 'Intracellular Digestion & Autophagy',
    category: 'endomembrane',
    categoryLabel: 'Waste Recycling',
    foundIn: 'animal-only',
    function: 'Degrades endocytosed macromolecules, worn-out organelles (autophagy), and engulfed pathogens via ~50 distinct acid hydrolase enzymes (proteases, nucleases, lipases, glycosidases).',
    structure: 'Single-membrane spherical vesicle containing an acidic lumen (pH 4.5–5.0) maintained by vacuolar-type H⁺-ATPases (v-ATPases); inner membrane is heavily glycosylated (LAMPs) to prevent self-digestion.',
    location: 'Scattered throughout the animal cell cytoplasm (functional equivalent in plant cells is the central vacuole).',
    keyPrinciple: 'Acid hydrolases operate exclusively at low pH (4.8). If a lysosome ruptures, the neutral cytosolic pH (7.2) inactivates the enzymes, protecting the host cell from catastrophic self-destruction.',
    dimensions: '0.1–1.2 μm diameter',
    relationships: [
      {
        targetId: 'golgi-apparatus',
        targetName: 'Golgi Apparatus',
        relationshipType: 'trafficking',
        description: 'Receives acid hydrolases tagged with Mannose-6-Phosphate from the trans-Golgi network in clathrin-coated vesicles.'
      },
      {
        targetId: 'plasma-membrane',
        targetName: 'Plasma Membrane',
        relationshipType: 'functional',
        description: 'Fuses with endocytic vesicles and phagosomes to digest extracellular nutrients and engulfed debris.'
      }
    ],
    substructures: [
      { name: 'Acid Hydrolases', description: 'Enzyme suite optimal at pH 4.8 for hydrolytic cleavage of all biological polymers.' },
      { name: 'v-ATPase Proton Pump', description: 'Consumes ATP to pump protons into the lumen against a 100-fold concentration gradient.' }
    ],
    cellularSignificance: 'Defects in specific lysosomal hydrolases cause over 50 fatal Lysosomal Storage Disorders (e.g. Tay-Sachs, Gaucher disease).'
  },
  'centrosome': {
    id: 'centrosome',
    name: 'Centrosome & Centrioles',
    subtitle: 'Microtubule Organizing Center (MTOC)',
    category: 'structural',
    categoryLabel: 'Cell Division MTOC',
    foundIn: 'animal-only',
    function: 'Main primary microtubule-organizing center in animal cells; nucleates and anchors microtubules, regulates cell cycle progression, and organizes the bipolar mitotic spindle during cell division.',
    structure: 'Non-membrane organelle consisting of two perpendicular barrel-shaped centrioles (each composed of 9 triplet microtubules in a pinwheel array) surrounded by pericentriolar material (PCM) rich in γ-tubulin ring complexes.',
    location: 'Positioned adjacent to the nucleus and Golgi apparatus in animal cells (higher plant cells lack centrioles and nucleate microtubules via dispersed cortical MTOCs).',
    keyPrinciple: 'γ-Tubulin Ring Complexes (γ-TuRCs) in the pericentriolar matrix act as templates to nucleate the minus-ends of 13-protofilament tubulin microtubules.',
    dimensions: 'Centriole: ~200 nm diameter, ~400 nm length',
    relationships: [
      {
        targetId: 'nucleus',
        targetName: 'Nucleus',
        relationshipType: 'spatial',
        description: 'Tethered near the nuclear envelope to direct spindle pole separation during prophase of mitosis.'
      },
      {
        targetId: 'cytoskeleton',
        targetName: 'Cytoskeleton',
        relationshipType: 'functional',
        description: 'Nucleates and anchors the radiating array of cytosolic microtubules coordinating organelle positioning.'
      }
    ],
    substructures: [
      { name: 'Mother & Daughter Centrioles', description: 'Orthogonal pair of cylindrical 9-triplet microtubule barrels displaying distal/subdistal appendages.' },
      { name: 'Pericentriolar Material (PCM)', description: 'Protein matrix containing γ-tubulin and pericentrin that nucleates microtubule assembly.' }
    ],
    cellularSignificance: 'Also templates the formation of primary cilia and motile flagellar axonemes (basal bodies).'
  },
  'plasma-membrane': {
    id: 'plasma-membrane',
    name: 'Plasma Membrane',
    subtitle: 'Selective Cellular Boundary',
    category: 'boundary',
    categoryLabel: 'Membrane Boundary',
    foundIn: 'both',
    function: 'Defines the external boundary of the living cell, maintains selective permeability, regulates ion gradients (resting potential), mediates signal transduction, and anchors the cytoskeleton.',
    structure: 'Fluid mosaic lipid bilayer (~5–8 nm thick) composed of amphipathic phospholipids, glycolipids, cholesterol (in animal cells), integral transmembrane proteins, and peripheral membrane proteins.',
    location: 'Outer cellular boundary in animal cells; immediately beneath the rigid cell wall in plant cells.',
    keyPrinciple: 'Hydrophobic fatty acyl core prevents free passive diffusion of polar molecules and ions; selective transport proteins, ion channels, and ATPases govern controlled molecular entry and exit.',
    dimensions: '5–8 nm thickness',
    relationships: [
      {
        targetId: 'cell-wall',
        targetName: 'Cell Wall (in plants)',
        relationshipType: 'spatial',
        description: 'Pressed directly against the rigid inner face of the plant cell wall by vacuolar hydrostatic pressure.'
      },
      {
        targetId: 'cytoskeleton',
        targetName: 'Cytoskeleton',
        relationshipType: 'structural',
        description: 'Anchored on its intracellular leaflet to the cortical actin microfilament network.'
      }
    ],
    substructures: [
      { name: 'Phospholipid Bilayer', description: 'Self-assembling amphipathic sheet with polar hydrophilic phosphate heads and hydrophobic hydrocarbon tails.' },
      { name: 'Glycocalyx', description: 'Carbohydrate-rich outer coat composed of glycoproteins and glycolipids for cell-cell recognition.' }
    ],
    cellularSignificance: 'Crucial for cellular homeostasis; loss of plasma membrane integrity results in immediate cell death (necrosis).'
  },
  'cell-wall': {
    id: 'cell-wall',
    name: 'Plant Cell Wall',
    subtitle: 'Rigid Cellulose Support & Protection',
    category: 'boundary',
    categoryLabel: 'Plant Wall Matrix',
    foundIn: 'plant-only',
    function: 'Provides mechanical tensile strength, maintains cell shape, withstands internal osmotic turgor pressure (~10 atm) to prevent cell bursting (lysis), and defends against pathogen invasion.',
    structure: 'Extracellular matrix composed of crystalline cellulose microfibrils embedded in a cross-linked matrix of hemicellulose, pectin, and structural glycoproteins (plus lignin in secondary walls).',
    location: 'External to the plasma membrane surrounding every plant cell.',
    keyPrinciple: 'Cellulose synthase rosette complexes in the plasma membrane extrude β-1,4-glucan chains that coalesce into high-tensile microfibrils resisting immense hydrostatic pressures.',
    dimensions: '0.1 to >10 μm thickness (primary wall: 0.1–1 μm; secondary wall: up to 10 μm)',
    relationships: [
      {
        targetId: 'plasma-membrane',
        targetName: 'Plasma Membrane',
        relationshipType: 'spatial',
        description: 'Directly encloses the plasma membrane, providing mechanical resistance to prevent osmotic rupture.'
      },
      {
        targetId: 'central-vacuole',
        targetName: 'Central Vacuole',
        relationshipType: 'functional',
        description: 'Counterbalances the osmotic pressure exerted by the vacuole to generate rigid plant tissue turgidity.'
      },
      {
        targetId: 'plasmodesmata',
        targetName: 'Plasmodesmata',
        relationshipType: 'spatial',
        description: 'Traversed by membrane-lined plasmodesmata channels that connect adjacent plant protoplasts.'
      }
    ],
    substructures: [
      { name: 'Middle Lamella', description: 'Pectin-rich adhesive layer cementing adjacent plant cell walls together.' },
      { name: 'Primary Cell Wall', description: 'Thin, flexible layer formed during cell growth containing cellulose, hemicellulose, and pectin.' },
      { name: 'Cellulose Microfibrils', description: 'High-tensile crystalline cables of β-1,4-linked D-glucose polymers.' }
    ],
    cellularSignificance: 'Allows terrestrial plants to grow upright without an internal bony skeleton; represents the most abundant organic polymer biomass on Earth.'
  },
  'plasmodesmata': {
    id: 'plasmodesmata',
    name: 'Plasmodesmata',
    subtitle: 'Intercellular Symplastic Channels',
    category: 'boundary',
    categoryLabel: 'Plant Intercellular Junctions',
    foundIn: 'plant-only',
    function: 'Microscopic membrane-lined channels spanning adjacent plant cell walls, enabling direct symplastic transport of water, ions, sugars, transcription factors, and signaling microRNAs.',
    structure: 'Narrow cylindrical channels (30–50 nm diameter) lined by plasma membrane containing a central appressed endoplasmic reticulum tube (desmotubule).',
    location: 'Traversing the cell wall between neighboring plant cells.',
    keyPrinciple: 'Connects individual plant protoplasts into a continuous physiological syncytium (the symplast), bypassing the restrictive cell wall barrier.',
    dimensions: '30–50 nm diameter, length equals cell wall thickness (100–1000 nm)',
    relationships: [
      {
        targetId: 'cell-wall',
        targetName: 'Cell Wall',
        relationshipType: 'spatial',
        description: 'Pores traversing the rigid cellulose matrix of primary plant cell walls.'
      },
      {
        targetId: 'plasma-membrane',
        targetName: 'Plasma Membrane',
        relationshipType: 'spatial',
        description: 'Plasma membrane of neighboring plant cells is continuous through each plasmodesma channel.'
      }
    ],
    substructures: [
      { name: 'Desmotubule', description: 'Tubule of appressed endoplasmic reticulum connecting ER networks of adjacent plant cells.' },
      { name: 'Cytoplasmic Sleeve', description: 'Fluid annulus between desmotubule and plasma membrane where regulated molecular diffusion occurs.' }
    ],
    cellularSignificance: 'Critical for systemic plant coordination, nutrient distribution in phloem, and developmental patterning.'
  },
  'cytoplasm': {
    id: 'cytoplasm',
    name: 'Cytoplasm & Cytosol',
    subtitle: 'Intracellular Matrix & Metabolic Fluid',
    category: 'structural',
    categoryLabel: 'Cytosolic Matrix',
    foundIn: 'both',
    function: 'Aqueous colloidal medium where glycolysis, fatty acid synthesis, signaling cascades, and protein translations occur; suspends all cellular organelles.',
    structure: 'Crowded aqueous solution (~70–80% water, 20–30% proteins, metabolites, ions, and macromolecular complexes) with an apparent viscosity ~3x water.',
    location: 'The entire intracellular volume bounded by the plasma membrane, excluding the interior of the nucleus.',
    keyPrinciple: 'Intensely crowded with macromolecules (~300–400 mg/mL), promoting thermodynamic molecular crowding and rapid enzyme-substrate channeling.',
    dimensions: 'Fills entire intracellular volume (~1000 to 5000 μm³ in standard animal cells)',
    relationships: [
      {
        targetId: 'plasma-membrane',
        targetName: 'Plasma Membrane',
        relationshipType: 'spatial',
        description: 'Enclosed within the outer plasma membrane boundary.'
      },
      {
        targetId: 'cytoskeleton',
        targetName: 'Cytoskeleton',
        relationshipType: 'structural',
        description: 'Structured by the interconnected mesh of actin, intermediate filaments, and microtubules.'
      }
    ],
    substructures: [
      { name: 'Cytosol', description: 'Soluble liquid fraction containing dissolved ions (K⁺, Mg²⁺), sugars, amino acids, ATP, and enzymes.' },
      { name: 'Inclusion Bodies', description: 'Non-membrane storage granules such as glycogen droplets (animals) and starch granules (plants).' }
    ],
    cellularSignificance: 'The biochemical workshop of the cell hosting the initial stages of cellular energy conversion (glycolysis).'
  },
  'cytoskeleton': {
    id: 'cytoskeleton',
    name: 'Cytoskeleton Network',
    subtitle: 'Mechanical Scaffold & Motor Highway',
    category: 'structural',
    categoryLabel: 'Structural Scaffolding',
    foundIn: 'both',
    function: 'Maintains cell morphology, provides mechanical resistance, organizes spatial position of organelles, powers vesicle and chromosome transport via motor proteins (kinesin, dynein, myosin), and drives cell motility and division.',
    structure: 'Dynamic three-component filamentous protein network: microfilaments (7 nm actin polymer), intermediate filaments (10 nm keratin/vimentin/lamins), and microtubules (25 nm α/β-tubulin hollow cylinders).',
    location: 'Pervades the entire cytosol from the nucleus to the inner face of the plasma membrane.',
    keyPrinciple: 'Filaments exhibit dynamic instability (polymerization and depolymerization), acting as structural struts and trackways for ATP-driven molecular motors.',
    dimensions: 'Actin: 7 nm; Intermediate filaments: 8–12 nm; Microtubules: 25 nm outer diameter',
    relationships: [
      {
        targetId: 'centrosome',
        targetName: 'Centrosome',
        relationshipType: 'functional',
        description: 'Microtubules in animal cells are nucleated and organized from the central centrosome MTOC.'
      },
      {
        targetId: 'plasma-membrane',
        targetName: 'Plasma Membrane',
        relationshipType: 'structural',
        description: 'Cortical actin microfilaments anchor to integral membrane proteins to support plasma membrane shape.'
      }
    ],
    substructures: [
      { name: 'Microfilaments (Actin)', description: 'Helical polymers of G-actin supporting cell cortex and contractility.' },
      { name: 'Microtubules (Tubulin)', description: 'Hollow cylinders of α/β-tubulin dimers acting as highways for vesicle transport.' },
      { name: 'Intermediate Filaments', description: 'Rope-like fibers (e.g. keratins, neurofilaments) providing high mechanical tensile strength.' }
    ],
    cellularSignificance: 'Converts chemical energy into mechanical force for muscle contraction, intracellular vesicle delivery, and cell division.'
  }
};

export const ANIMAL_ORGANELLES = [
  'plasma-membrane',
  'nucleus',
  'nucleolus',
  'nuclear-envelope',
  'mitochondria',
  'rough-er',
  'smooth-er',
  'golgi-apparatus',
  'ribosomes',
  'lysosomes',
  'centrosome',
  'cytoskeleton',
  'cytoplasm'
];

export const PLANT_ORGANELLES = [
  'cell-wall',
  'plasma-membrane',
  'central-vacuole',
  'chloroplast',
  'nucleus',
  'nucleolus',
  'nuclear-envelope',
  'mitochondria',
  'rough-er',
  'smooth-er',
  'golgi-apparatus',
  'ribosomes',
  'plasmodesmata',
  'cytoskeleton',
  'cytoplasm'
];

export interface CellComparisonFeature {
  feature: string;
  animalCell: string;
  plantCell: string;
  significance: string;
}

export const CELL_COMPARISON_TABLE: CellComparisonFeature[] = [
  {
    feature: 'Outer Boundary',
    animalCell: 'Flexible plasma membrane only',
    plantCell: 'Rigid cellulose cell wall + plasma membrane',
    significance: 'Cell wall allows plant cells to withstand high osmotic turgor pressure without bursting.'
  },
  {
    feature: 'Primary Energy Conversion',
    animalCell: 'Mitochondria only (aerobic respiration)',
    plantCell: 'Chloroplasts (photosynthesis) + Mitochondria (respiration)',
    significance: 'Plants are autotrophic producers; animals are heterotrophic consumers.'
  },
  {
    feature: 'Vacuolar Organization',
    animalCell: 'Small, transient vesicles / vacuoles',
    plantCell: 'Large single central vacuole (30–90% cell volume)',
    significance: 'Central vacuole provides hydrostatic turgor support for non-woody plant stems.'
  },
  {
    feature: 'Microtubule Organization',
    animalCell: 'Centrosome with 2 centrioles',
    plantCell: 'Dispersed non-centrosomal cortical MTOCs',
    significance: 'Plant cells assemble mitotic spindles without centrioles.'
  },
  {
    feature: 'Intercellular Communication',
    animalCell: 'Gap junctions & desmosomes',
    plantCell: 'Plasmodesmata channels traversing cell walls',
    significance: 'Plasmodesmata create a continuous symplastic cytoplasm between adjacent plant cells.'
  },
  {
    feature: 'Waste Hydrolysis',
    animalCell: 'Lysosomes with acid hydrolases',
    plantCell: 'Central vacuole lumen with lytic enzymes',
    significance: 'Plant vacuoles perform the degradative recycling role of animal lysosomes.'
  }
];
