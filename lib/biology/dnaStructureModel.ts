export type BaseType = 'A' | 'T' | 'G' | 'C';

export interface NucleotideUnit {
  index: number;
  base: BaseType;
  fullName: string;
  ringType: 'Purine (Bicyclic)' | 'Pyrimidine (Monocyclic)';
  formula: string;
  hBonds: 2 | 3;
  complement: BaseType;
  strand: 'top' | 'bottom';
  polarity: "5' → 3'" | "3' → 5'";
  donorAcceptorInfo: string;
  majorGrooveFacing: boolean;
}

export const DNA_STRUCTURE_SEQUENCE: { top: BaseType[]; bottom: BaseType[] } = {
  top: ['A', 'T', 'G', 'C', 'C', 'A', 'T', 'G', 'A', 'A', 'C', 'G', 'T', 'T', 'A', 'G', 'C', 'A', 'T', 'G', 'C', 'T'],
  bottom: ['T', 'A', 'C', 'G', 'G', 'T', 'A', 'C', 'T', 'T', 'G', 'C', 'A', 'A', 'T', 'C', 'G', 'T', 'A', 'C', 'G', 'A'],
};

export function getBaseFullName(b: BaseType): string {
  switch (b) {
    case 'A': return 'Adenine';
    case 'T': return 'Thymine';
    case 'G': return 'Guanine';
    case 'C': return 'Cytosine';
  }
}

export function getComplementBase(b: BaseType): BaseType {
  switch (b) {
    case 'A': return 'T';
    case 'T': return 'A';
    case 'G': return 'C';
    case 'C': return 'G';
  }
}

export function getHydrogenBondCount(b: BaseType): 2 | 3 {
  return (b === 'A' || b === 'T') ? 2 : 3;
}

export interface DNAStructureInspectable {
  id: string;
  name: string;
  category: 'base' | 'backbone' | 'bond' | 'geometry' | 'principle';
  chemicalClassification?: string;
  formula?: string;
  function: string;
  keyPrinciple: string;
  hydrogenBondDetails?: string;
  cellularSignificance: string;
}

export const DNA_STRUCTURE_INSPECTABLES: Record<string, DNAStructureInspectable> = {
  'adenine': {
    id: 'adenine',
    name: 'Adenine (Purine Base)',
    category: 'base',
    chemicalClassification: 'Purine (Fused 6-membered pyrimidine + 5-membered imidazole ring)',
    formula: 'C₅H₅N₅ (MW: 135.13 g/mol)',
    function: 'Nitrogenous base with an exocyclic amino group at C6 acting as an H-bond donor, and N1 acting as an H-bond acceptor.',
    keyPrinciple: 'Forms exactly 2 Watson-Crick hydrogen bonds with Thymine (N6-H···O4 and N1···H-N3).',
    hydrogenBondDetails: '2 Hydrogen Bonds (~14 kJ/mol total stabilization free energy).',
    cellularSignificance: 'Also forms core moiety of ATP, NAD⁺, FAD, and acetyl-CoA coenzymes.'
  },
  'thymine': {
    id: 'thymine',
    name: 'Thymine (Pyrimidine Base)',
    category: 'base',
    chemicalClassification: 'Pyrimidine (6-membered heterocyclic ring with C5 methyl group)',
    formula: 'C₅H₆N₂O₂ (5-methyluracil, MW: 126.11 g/mol)',
    function: 'Possesses a carbonyl oxygen at C4 (H-bond acceptor) and N3-H (H-bond donor) complementary to Adenine.',
    keyPrinciple: 'Methyl group at C5 projects into the major groove, enabling DNA-binding proteins (transcription factors) to differentiate DNA from RNA.',
    hydrogenBondDetails: '2 Hydrogen Bonds with Adenine.',
    cellularSignificance: 'Presence of thymine instead of uracil prevents mutagenic cytosine deamination from corrupting genetic integrity.'
  },
  'guanine': {
    id: 'guanine',
    name: 'Guanine (Purine Base)',
    category: 'base',
    chemicalClassification: 'Purine (Bicyclic aromatic ring with C6 carbonyl and C2 amino group)',
    formula: 'C₅H₅N₅O (2-amino-6-oxopurine, MW: 151.13 g/mol)',
    function: 'Possesses carbonyl oxygen at C6 (acceptor), N1-H (donor), and C2-NH₂ (donor) matching Cytosine.',
    keyPrinciple: 'Forms 3 stable Watson-Crick hydrogen bonds with Cytosine (O6···H-N4, N1-H···N3, and N2-H···O2).',
    hydrogenBondDetails: '3 Hydrogen Bonds (~21 kJ/mol total stabilization free energy).',
    cellularSignificance: 'High G+C content increases the thermal melting temperature (Tm) of double-stranded DNA.'
  },
  'cytosine': {
    id: 'cytosine',
    name: 'Cytosine (Pyrimidine Base)',
    category: 'base',
    chemicalClassification: 'Pyrimidine (Monocyclic ring with C2 carbonyl and C4 amino group)',
    formula: 'C₄H₅N₃O (MW: 111.10 g/mol)',
    function: 'Has C4-NH₂ (donor), N3 (acceptor), and C2=O (acceptor) precisely complementary to Guanine.',
    keyPrinciple: 'Triple hydrogen bonding with Guanine confers enhanced base stacking and duplex rigidity.',
    hydrogenBondDetails: '3 Hydrogen Bonds with Guanine.',
    cellularSignificance: 'Subject to regulatory epigenetic methylation (5-methylcytosine) in CpG islands for gene silencing.'
  },
  'base-pair-at': {
    id: 'base-pair-at',
    name: 'A–T Base Pair (Adenine–Thymine)',
    category: 'bond',
    chemicalClassification: 'Purine–Pyrimidine Watson-Crick Pair (2 Hydrogen Bonds)',
    function: 'Isosteric base pair measuring 1.08 nm (10.8 Å) across C1′-C1′ glycosidic carbon atoms.',
    keyPrinciple: 'Thermodynamically less stable than G–C (2 vs 3 H-bonds); enriched in replication origins (oriC) and promoter TATA boxes to facilitate strand unwinding.',
    hydrogenBondDetails: '2 Hydrogen Bonds: N6-H···O4 (2.95 Å) and N1···H-N3 (2.82 Å).',
    cellularSignificance: 'Enables precise unwinding at transcription start sites and replication initiation bubbles.'
  },
  'base-pair-gc': {
    id: 'base-pair-gc',
    name: 'G–C Base Pair (Guanine–Cytosine)',
    category: 'bond',
    chemicalClassification: 'Purine–Pyrimidine Watson-Crick Pair (3 Hydrogen Bonds)',
    function: 'Isosteric base pair identical in overall width (1.08 nm) to A–T, preserving uniform duplex diameter (2.0 nm).',
    keyPrinciple: 'Three hydrogen bonds provide higher thermal and mechanical stability compared to A–T pairs.',
    hydrogenBondDetails: '3 Hydrogen Bonds: O6···H-N4 (2.91 Å), N1-H···N3 (2.95 Å), and N2-H···O2 (2.86 Å).',
    cellularSignificance: 'Thermophilic organisms living in extreme thermal vents typically exhibit elevated genomic GC content (>65%).'
  },
  'sugar-phosphate-backbone': {
    id: 'sugar-phosphate-backbone',
    name: 'Sugar-Phosphate Structural Backbone',
    category: 'backbone',
    chemicalClassification: 'Repeating 2-deoxy-D-ribose units linked by 3′,5′-phosphodiester bridges',
    function: 'Forms the continuous, negatively charged hydrophilic exterior of the double helix.',
    keyPrinciple: 'Protects the genetic information (bases) sequestered in the hydrophobic interior while exposing negatively charged phosphate oxygens to aqueous solvent.',
    cellularSignificance: 'Negative charge prevents spontaneous membrane crossing and facilitates electrostatic binding with basic histone octamers.'
  },
  'deoxyribose': {
    id: 'deoxyribose',
    name: '2′-Deoxy-D-Ribose Pentose Sugar',
    category: 'backbone',
    formula: 'C₅H₁₀O₄ (furanose ring in C2′-endo conformation in B-DNA)',
    function: 'Five-carbon cyclic pentose sugar missing the 2′-hydroxyl group present in RNA ribose.',
    keyPrinciple: 'Absence of the 2′-OH prevents alkaline hydrolysis and permits B-form helical geometry with 3.4 Å base stacking.',
    cellularSignificance: 'Differentiates DNA chemically from RNA, granting immense chemical stability across millenia.'
  },
  'phosphodiester-bond': {
    id: 'phosphodiester-bond',
    name: '3′,5′-Phosphodiester Covalent Linkage',
    category: 'backbone',
    function: 'Strong covalent ester bond linking the 3′-carbon of one deoxyribose to the 5′-carbon of the adjacent deoxyribose through a phosphate group.',
    keyPrinciple: 'Possesses directional polarity: a free 5′-phosphate terminus and a free 3′-hydroxyl terminus.',
    cellularSignificance: 'Extremely stable covalent linkage with a half-life of over 30 million years at neutral pH.'
  },
  'hydrogen-bond': {
    id: 'hydrogen-bond',
    name: 'Hydrogen Bonding Network',
    category: 'bond',
    function: 'Dipole-dipole non-covalent attractive forces between partially positive hydrogens (N-H) and electronegative acceptors (O=, N:).',
    keyPrinciple: 'Weak individually (~8–25 kJ/mol) but collectively enormous across millions of base pairs, allowing reversible unzipping for replication and transcription.',
    cellularSignificance: 'Enables rapid, enzyme-mediated transient separation without breaking covalent backbone bonds.'
  },
  'antiparallel-strands': {
    id: 'antiparallel-strands',
    name: 'Antiparallel Directionality (5′→3′ / 3′→5′)',
    category: 'principle',
    function: 'The two complementary polynucleotide strands run in opposite stereochemical orientations.',
    keyPrinciple: 'One strand runs 5′-phosphate to 3′-hydroxyl; the complementary strand runs 3′-hydroxyl to 5′-phosphate. Required for optimal Watson-Crick hydrogen bonding geometry.',
    cellularSignificance: 'Imposes the leading vs lagging strand dichotomy during semiconservative DNA replication.'
  },
  'major-minor-groove': {
    id: 'major-minor-groove',
    name: 'Major & Minor Helical Grooves',
    category: 'geometry',
    function: 'Helical surface indentations arising from the asymmetrical 120°/240° attachment angle of glycosidic bonds across the base pair.',
    keyPrinciple: 'Major groove (~12 Å wide) displays a unique chemical pattern of H-bond donors/acceptors for each base pair, allowing sequence-specific protein recognition without unzipping.',
    cellularSignificance: 'Site where zinc fingers, leucine zippers, and restriction enzymes recognize specific target promoter motifs.'
  },
  'chargaff-rules': {
    id: 'chargaff-rules',
    name: "Chargaff's Equivalence Rules",
    category: 'principle',
    function: 'Empirical discovery by Erwin Chargaff (1950) that in all double-stranded cellular DNA, %A = %T and %G = %C.',
    keyPrinciple: 'Direct physical consequence of strict Watson-Crick complementary base pairing. Purine count (A+G) always equals pyrimidine count (T+C).',
    cellularSignificance: 'Provided the critical experimental clue that led Watson and Crick to deduce the double-helix structure in 1953.'
  }
};
