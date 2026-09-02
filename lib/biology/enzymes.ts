import { InspectableObject } from '../types';

export const MOLECULAR_OBJECTS: Record<string, InspectableObject> = {
  'helicase': {
    id: 'helicase',
    name: 'DNA Helicase',
    category: 'enzyme',
    systematicName: 'DnaB Hexameric Helicase',
    function: 'Unwinds double-stranded parental DNA by breaking hydrogen bonds between complementary base pairs.',
    direction: 'Translocates 5\' → 3\' along the lagging template strand into the duplex',
    keyPrinciple: 'ATP-driven motor. Consumes 1 ATP per base pair separated, creating the Y-shaped replication fork.',
    reactionEquation: 'dsDNA + ATP + H2O → 2 ssDNA + ADP + Pi',
    cofactors: 'ATP, Mg²⁺',
    cellularContext: 'Recruited to the origin of replication; operates as the central unwinding engine at the fork apex.'
  },

  'topoisomerase': {
    id: 'topoisomerase',
    name: 'Topoisomerase (Gyrase)',
    category: 'enzyme',
    systematicName: 'DNA Topoisomerase II / DNA Gyrase',
    function: 'Relieves positive supercoiling and torsional strain accumulating ahead of the advancing replication fork.',
    direction: 'Operates upstream on parental duplex DNA ahead of helicase',
    keyPrinciple: 'Introduces transient double-strand breaks, passes intact duplex through, and religates the phosphodiester backbone.',
    reactionEquation: 'Positively supercoiled DNA + ATP → Relaxed DNA + ADP + Pi',
    cofactors: 'ATP, Mg²⁺',
    cellularContext: 'Without topoisomerase, torsional resistance halts fork progression within ~100 turns.'
  },

  'ssb': {
    id: 'ssb',
    name: 'Single-Strand Binding Protein (SSB)',
    category: 'enzyme',
    systematicName: 'Single-Stranded DNA-Binding Protein Tetramer',
    function: 'Stabilizes exposed single-stranded template DNA and prevents re-annealing or hairpin formation.',
    direction: 'Non-directional cooperative binding along exposed single strands',
    keyPrinciple: 'Binds cooperatively without sequence specificity, straightening the phosphodiester backbone for polymerase access.',
    reactionEquation: 'ssDNA + SSB₄ ⇌ [ssDNA · SSB₄] (stabilized complex)',
    cofactors: 'None (electrostatic and aromatic base-stacking interactions)',
    cellularContext: 'Coats exposed single strands, especially along the lagging strand loop, until displacement by DNA polymerase.'
  },

  'primase': {
    id: 'primase',
    name: 'RNA Primase',
    category: 'enzyme',
    systematicName: 'DnaG RNA Polymerase',
    function: 'Synthesizes short RNA oligonucleotides (~10–12 nt) complementary to the single-stranded DNA template.',
    direction: 'Synthesizes 5\' → 3\' using ribonucleotides (ATP, UTP, GTP, CTP)',
    keyPrinciple: 'Can initiate de novo synthesis without a pre-existing primer, providing the essential 3\'-OH group required by DNA polymerase.',
    reactionEquation: 'ssDNA template + NTPs → RNA Primer (with free 3\'-OH) + PPi',
    cofactors: 'Mg²⁺, NTPs',
    cellularContext: 'Acts once on the leading strand, but repeatedly on the lagging strand for each Okazaki fragment.'
  },

  'polymerase-lead': {
    id: 'polymerase-lead',
    name: 'DNA Polymerase III (Leading)',
    category: 'enzyme',
    systematicName: 'DNA Polymerase III Holoenzyme (α, ε, θ core + β sliding clamp)',
    function: 'Catalyzes continuous 5\' → 3\' synthesis of the leading daughter strand towards the opening replication fork.',
    direction: '5\' → 3\' synthesis (reading template 3\' → 5\')',
    keyPrinciple: 'Attacks incoming dNTP α-phosphate with the primer 3\'-OH group. Tethered by the β-sliding clamp for extreme processivity (>50,000 bp).',
    reactionEquation: '(DNA)ₙ + dNTP xrightarrow{Mg²⁺} (DNA)ₙ₊₁ + PPi (ΔG°\' = -3.5 kcal/mol)',
    cofactors: 'Mg²⁺, Zn²⁺ (catalytic and structural metal ions), dNTPs',
    cellularContext: 'Coordinates directly with helicase via the τ (tau) subunit complex to synchronize replication speeds.'
  },

  'polymerase-lag': {
    id: 'polymerase-lag',
    name: 'DNA Polymerase III (Lagging)',
    category: 'enzyme',
    systematicName: 'DNA Polymerase III Holoenzyme (Lagging Subunit)',
    function: 'Synthesizes Okazaki fragments discontinuously in the 5\' → 3\' direction away from the replication fork.',
    direction: '5\' → 3\' synthesis (opposite to fork movement)',
    keyPrinciple: 'Requires repeated loading and unloading at each new RNA primer, looping the template strand (trombone model).',
    reactionEquation: '(DNA)ₙ + dNTP xrightarrow{Mg²⁺} (DNA)ₙ₊₁ + PPi',
    cofactors: 'Mg²⁺, β-clamp loader (γ complex), dNTPs',
    cellularContext: 'Releases the template upon encountering the 5\' RNA end of the previous fragment, then rebinds the next upstream primer.'
  },

  'polymerase-i': {
    id: 'polymerase-i',
    name: 'DNA Polymerase I',
    category: 'enzyme',
    systematicName: 'DNA Polymerase I (Exonuclease / Repair Polymerase)',
    function: 'Removes RNA primers via 5\' → 3\' exonuclease activity while simultaneously replacing them with deoxynucleotides.',
    direction: '5\' → 3\' exonuclease degradation & simultaneous 5\' → 3\' synthesis (Nick Translation)',
    keyPrinciple: 'Possesses dual enzymatic activities: 5\'→3\' exonuclease to excise ribonucleotides and 5\'→3\' polymerase to fill DNA gaps.',
    reactionEquation: 'RNA primer + dNTPs → Nicked DNA duplex + NMPs + PPi',
    cofactors: 'Mg²⁺, dNTPs',
    cellularContext: 'Converts discontinuous Okazaki fragments with RNA primers into contiguous all-DNA strands, leaving a single nick.'
  },

  'ligase': {
    id: 'ligase',
    name: 'DNA Ligase',
    category: 'enzyme',
    systematicName: 'DNA Ligase (ATP / NAD⁺-dependent)',
    function: 'Catalyzes the formation of a phosphodiester bond to seal single-strand nicks between adjacent Okazaki fragments.',
    direction: 'Acts at single-strand nicks with adjacent 3\'-OH and 5\'-phosphate',
    keyPrinciple: 'Transfers AMP to 5\'-phosphate to activate the bond, then catalyzes nucleophilic attack by the adjacent 3\'-OH to form a seamless backbone.',
    reactionEquation: 'Nicked DNA + ATP (or NAD⁺) → Sealed DNA + AMP + PPi (or NMN)',
    cofactors: 'ATP (eukaryotes/phages) or NAD⁺ (bacteria), Mg²⁺',
    cellularContext: 'Final maturation enzyme on the lagging strand, completing the intact covalently bonded daughter chromosome.'
  },

  'parental-top': {
    id: 'parental-top',
    name: 'Parental Template Strand (Top)',
    category: 'strand',
    function: 'Serves as the template for continuous leading-strand synthesis.',
    direction: '3\' (left) → 5\' (right, into fork)',
    keyPrinciple: 'Because this template enters the fork 3\' → 5\', its complementary daughter strand is synthesized 5\' → 3\' directly into the opening fork.',
    cellularContext: 'Original unmethylated or methylated parental double-helix strand.'
  },

  'parental-bottom': {
    id: 'parental-bottom',
    name: 'Parental Template Strand (Bottom)',
    category: 'strand',
    function: 'Serves as the template for discontinuous lagging-strand synthesis.',
    direction: '5\' (left) → 3\' (right, into fork)',
    keyPrinciple: 'Because this template enters the fork 5\' → 3\', new DNA must be synthesized 5\' → 3\' pointing BACKWARDS away from the fork.',
    cellularContext: 'Forms the physical constraint necessitating Okazaki fragments.'
  },

  'leading-strand': {
    id: 'leading-strand',
    name: 'Leading Strand (New DNA)',
    category: 'strand',
    function: 'Continuously synthesized daughter DNA strand moving in the same direction as the replication fork.',
    direction: '5\' → 3\' (continuous towards fork apex)',
    keyPrinciple: 'Requires only one initial RNA primer; elongation matches the exact unwinding velocity of helicase.',
    cellularContext: 'Synthesized at rates of ~500–1000 bp/sec in E. coli, ~50 bp/sec in humans.'
  },

  'lagging-strand': {
    id: 'lagging-strand',
    name: 'Lagging Strand & Okazaki Fragments',
    category: 'strand',
    function: 'Discontinuously synthesized daughter DNA strand composed of transient discrete fragments (~100–200 nt in eukaryotes).',
    direction: '5\' → 3\' (individual fragments synthesized away from fork)',
    keyPrinciple: 'Each fragment begins with an RNA primer and ends where the previous fragment began.',
    cellularContext: 'Named after Reiji and Tsuneko Okazaki who discovered the discontinuous replication mechanism in 1968.'
  },

  'rna-primer': {
    id: 'rna-primer',
    name: 'RNA Primer',
    category: 'feature',
    function: 'Short sequence of RNA (10–12 nt) providing the initial 3\'-OH group necessary for DNA polymerase extension.',
    direction: '5\' → 3\' (ribonucleotides: A, U, G, C)',
    keyPrinciple: 'DNA polymerases cannot initiate synthesis de novo—they can only add dNTPs to a pre-existing 3\'-OH terminus.',
    reactionEquation: 'Contains ribose sugar with 2\'-OH and 3\'-OH; uracil (U) replaces thymine (T).',
    cellularContext: 'Temporarily marks the initiation site of every new DNA synthesis tract before excision by Pol I.'
  },

  'base-pairs': {
    id: 'base-pairs',
    name: 'Complementary Base Pairing',
    category: 'chemistry',
    function: 'Watson-Crick hydrogen bonding that guarantees high-fidelity replication of genetic information.',
    keyPrinciple: 'Adenine pairs with Thymine via 2 hydrogen bonds (A=T); Guanine pairs with Cytosine via 3 hydrogen bonds (G≡C).',
    reactionEquation: 'A + T (2 H-bonds: ~14 kJ/mol) | G + C (3 H-bonds: ~21 kJ/mol)',
    cellularContext: 'Complementary base pairing ensures that each daughter duplex receives an exact replica of the parental genetic code.'
  },

  'dntps': {
    id: 'dntps',
    name: 'Deoxynucleotide Triphosphates (dNTPs)',
    category: 'chemistry',
    function: 'Activated high-energy monomer building blocks for DNA replication (dATP, dTTP, dCTP, dGTP).',
    keyPrinciple: 'Hydrolysis of high-energy phosphoanhydride bonds between α and β/γ phosphates drives the endergonic polymerization forward.',
    reactionEquation: 'dNTP → dNMP (incorporated) + PPi → 2 Pi (exergonic driving force)',
    cellularContext: 'Maintained at balanced concentrations in the nucleoplasm to prevent mutation and replication stalling.'
  },

  'replication-fork': {
    id: 'replication-fork',
    name: 'Replication Fork Junction',
    category: 'feature',
    function: 'The Y-shaped transition zone where double-stranded parental DNA is split into two single template strands.',
    direction: 'Moves rightward into unreplicated parental chromatin',
    keyPrinciple: 'The structural epicenter of the replisome multiprotein complex coordinating unwinding, priming, and synthesis.',
    cellularContext: 'Two bidirectional replication forks typically originate from each replication origin bubble.'
  }
};
