import { StepDefinition } from '../types';

export const TOP_TEMPLATE_BASES = [
  'T','A','C','G','G','A','C','T','T','A','G','C','C','A','T','G','A','A','C','G','T','T','A','G','C','C','T','A','C','G','G','A','T','T','C','C','G','A','T','A','C','G','G','A','T','C','A','T'
];

export const BOTTOM_TEMPLATE_BASES = [
  'A','T','G','C','C','T','G','A','A','T','C','G','G','T','A','C','T','T','G','C','A','A','T','C','G','G','A','T','G','C','C','T','A','A','G','G','C','T','A','T','G','C','C','T','A','G','T','A'
];

// Returns complementary DNA base
export function getComplementaryBase(base: string): string {
  switch (base) {
    case 'A': return 'T';
    case 'T': return 'A';
    case 'G': return 'C';
    case 'C': return 'G';
    case 'U': return 'A';
    default: return 'N';
  }
}

// Returns complementary RNA base (U instead of T)
export function getRNABase(templateBase: string): string {
  switch (templateBase) {
    case 'A': return 'U';
    case 'T': return 'A';
    case 'G': return 'C';
    case 'C': return 'G';
    default: return 'N';
  }
}

// Number of hydrogen bonds between bases
export function getHydrogenBondCount(base1: string, base2: string): number {
  const b1 = base1.toUpperCase();
  const b2 = base2.toUpperCase();
  if ((b1 === 'A' && (b2 === 'T' || b2 === 'U')) || ((b1 === 'T' || b1 === 'U') && b2 === 'A')) {
    return 2;
  }
  if ((b1 === 'G' && b2 === 'C') || (b1 === 'C' && b2 === 'G')) {
    return 3;
  }
  return 2;
}

export const BIOLOGICAL_STEPS: StepDefinition[] = [
  {
    id: 1,
    target: 0,
    name: 'Parental DNA Duplex',
    phase: '01 / INITIATION',
    desc: 'The original double-stranded DNA template in its stable antiparallel configuration (3\'→5\' top strand, 5\'→3\' bottom strand). Complementary base pairs are bonded by hydrogen bonds (A=T with 2 H-bonds, G≡C with 3 H-bonds). Topoisomerase relieves upstream torsional tension.',
    keyTakeaway: 'DNA is antiparallel and tightly bound by hydrogen bonds, requiring enzymatic unwinding before replication can occur.',
    activeEnzymes: [
      { id: 'topoisomerase', name: 'Topoisomerase', state: 'active' },
      { id: 'helicase', name: 'Helicase', state: 'waiting' },
      { id: 'ssb', name: 'SSB Proteins', state: 'waiting' },
      { id: 'primase', name: 'Primase', state: 'waiting' },
      { id: 'polymerase-lead', name: 'Pol III (Leading)', state: 'waiting' },
      { id: 'polymerase-lag', name: 'Pol III (Lagging)', state: 'waiting' },
      { id: 'polymerase-i', name: 'Pol I', state: 'waiting' },
      { id: 'ligase', name: 'DNA Ligase', state: 'waiting' }
    ]
  },
  {
    id: 2,
    target: 150,
    name: 'Helicase Unwinding & SSB Stabilization',
    phase: '02 / UNWINDING',
    desc: 'Hexameric DNA Helicase hydrolyzes ATP to separate the parental strands, creating an expanding Y-shaped replication fork. Single-Strand DNA-Binding Proteins (SSBs) rapidly coat the exposed template to prevent re-annealing and secondary hairpin loops.',
    keyTakeaway: 'Helicase unwinds at the fork apex; SSBs protect exposed single-stranded template DNA.',
    predictionId: 'pred-primer',
    activeEnzymes: [
      { id: 'topoisomerase', name: 'Topoisomerase', state: 'active' },
      { id: 'helicase', name: 'Helicase', state: 'active' },
      { id: 'ssb', name: 'SSB Proteins', state: 'active' },
      { id: 'primase', name: 'Primase', state: 'waiting' },
      { id: 'polymerase-lead', name: 'Pol III (Leading)', state: 'waiting' },
      { id: 'polymerase-lag', name: 'Pol III (Lagging)', state: 'waiting' },
      { id: 'polymerase-i', name: 'Pol I', state: 'waiting' },
      { id: 'ligase', name: 'DNA Ligase', state: 'waiting' }
    ]
  },
  {
    id: 3,
    target: 300,
    name: 'Leading Strand RNA Priming',
    phase: '03 / PRIMING',
    desc: 'RNA Primase binds the top template strand and synthesizes a short RNA primer (5\' → 3\'). Because DNA Polymerase III cannot initiate synthesis de novo from naked single-stranded DNA, this RNA primer provides the essential free 3\'-OH group.',
    keyTakeaway: 'Primase provides the essential 3\'-OH chemical starting block required by all DNA polymerases.',
    predictionId: 'pred-direction',
    activeEnzymes: [
      { id: 'topoisomerase', name: 'Topoisomerase', state: 'active' },
      { id: 'helicase', name: 'Helicase', state: 'active' },
      { id: 'ssb', name: 'SSB Proteins', state: 'active' },
      { id: 'primase', name: 'Primase', state: 'active' },
      { id: 'polymerase-lead', name: 'Pol III (Leading)', state: 'waiting' },
      { id: 'polymerase-lag', name: 'Pol III (Lagging)', state: 'waiting' },
      { id: 'polymerase-i', name: 'Pol I', state: 'waiting' },
      { id: 'ligase', name: 'DNA Ligase', state: 'waiting' }
    ]
  },
  {
    id: 4,
    target: 450,
    name: 'Continuous Leading Strand Synthesis',
    phase: '04 / ELONGATION',
    desc: 'DNA Polymerase III docks onto the 3\'-OH end of the RNA primer. Clamped by the β-sliding clamp, it incorporates complementary dNTPs (dATP, dTTP, dCTP, dGTP) in the 5\' → 3\' direction, moving continuously toward the opening fork in synchrony with helicase.',
    keyTakeaway: 'The leading strand is synthesized continuously in the 5\' → 3\' direction towards the advancing fork.',
    predictionId: 'pred-lagging',
    activeEnzymes: [
      { id: 'topoisomerase', name: 'Topoisomerase', state: 'active' },
      { id: 'helicase', name: 'Helicase', state: 'active' },
      { id: 'ssb', name: 'SSB Proteins', state: 'active' },
      { id: 'primase', name: 'Primase', state: 'waiting' },
      { id: 'polymerase-lead', name: 'Pol III (Leading)', state: 'active' },
      { id: 'polymerase-lag', name: 'Pol III (Lagging)', state: 'waiting' },
      { id: 'polymerase-i', name: 'Pol I', state: 'waiting' },
      { id: 'ligase', name: 'DNA Ligase', state: 'waiting' }
    ]
  },
  {
    id: 5,
    target: 600,
    name: 'Lagging Strand Priming (Fragment 1)',
    phase: '05 / DISCONTINUOUS PRIMING',
    desc: 'On the bottom template (oriented 5\'→3\' into the fork), synthesis cannot proceed toward the fork. Primase binds near the newly opened fork junction and synthesizes an RNA primer oriented 5\' → 3\' pointing AWAY from the fork.',
    keyTakeaway: 'Lagging strand primers are placed near the fork and synthesized in the reverse direction.',
    activeEnzymes: [
      { id: 'topoisomerase', name: 'Topoisomerase', state: 'active' },
      { id: 'helicase', name: 'Helicase', state: 'active' },
      { id: 'ssb', name: 'SSB Proteins', state: 'active' },
      { id: 'primase', name: 'Primase', state: 'active' },
      { id: 'polymerase-lead', name: 'Pol III (Leading)', state: 'active' },
      { id: 'polymerase-lag', name: 'Pol III (Lagging)', state: 'waiting' },
      { id: 'polymerase-i', name: 'Pol I', state: 'waiting' },
      { id: 'ligase', name: 'DNA Ligase', state: 'waiting' }
    ]
  },
  {
    id: 6,
    target: 750,
    name: 'Okazaki Fragment 1 Elongation',
    phase: '06 / OKAZAKI ELONGATION',
    desc: 'DNA Polymerase III engages the primer on the lagging strand, synthesizing Okazaki Fragment 1 in the 5\' → 3\' direction (leftward) until it reaches the origin of replication. Meanwhile, the leading strand continues uninterrupted.',
    keyTakeaway: 'Okazaki fragments are synthesized discontinuously in the 5\' → 3\' direction away from the fork.',
    activeEnzymes: [
      { id: 'topoisomerase', name: 'Topoisomerase', state: 'active' },
      { id: 'helicase', name: 'Helicase', state: 'active' },
      { id: 'ssb', name: 'SSB Proteins', state: 'active' },
      { id: 'primase', name: 'Primase', state: 'waiting' },
      { id: 'polymerase-lead', name: 'Pol III (Leading)', state: 'active' },
      { id: 'polymerase-lag', name: 'Pol III (Lagging)', state: 'active' },
      { id: 'polymerase-i', name: 'Pol I', state: 'waiting' },
      { id: 'ligase', name: 'DNA Ligase', state: 'waiting' }
    ]
  },
  {
    id: 7,
    target: 900,
    name: 'Fragment 2 & Okazaki Maturation',
    phase: '07 / MATURATION',
    desc: 'As the fork opens further, Primase and Pol III synthesize Okazaki Fragment 2. DNA Polymerase I uses 5\'→3\' exonuclease nick translation to replace RNA primers with DNA. DNA Ligase uses ATP to catalyze phosphodiester bonds, sealing all nicks.',
    keyTakeaway: 'Pol I removes RNA primers; DNA Ligase seals the phosphodiester backbone into a contiguous strand.',
    predictionId: 'pred-ligase',
    activeEnzymes: [
      { id: 'topoisomerase', name: 'Topoisomerase', state: 'active' },
      { id: 'helicase', name: 'Helicase', state: 'active' },
      { id: 'ssb', name: 'SSB Proteins', state: 'waiting' },
      { id: 'primase', name: 'Primase', state: 'complete' },
      { id: 'polymerase-lead', name: 'Pol III (Leading)', state: 'active' },
      { id: 'polymerase-lag', name: 'Pol III (Lagging)', state: 'active' },
      { id: 'polymerase-i', name: 'Pol I', state: 'active' },
      { id: 'ligase', name: 'DNA Ligase', state: 'active' }
    ]
  },
  {
    id: 8,
    target: 1000,
    name: 'Two Semiconservative Daughter Helices',
    phase: '08 / COMPLETION',
    desc: 'Replication finishes with two identical daughter DNA double helices. Each daughter duplex contains exactly one conserved parental template strand and one newly synthesized complementary strand (semiconservative model).',
    keyTakeaway: 'Semiconservative replication produces two genetically identical duplexes, each half-parental and half-new.',
    activeEnzymes: [
      { id: 'topoisomerase', name: 'Topoisomerase', state: 'complete' },
      { id: 'helicase', name: 'Helicase', state: 'complete' },
      { id: 'ssb', name: 'SSB Proteins', state: 'dissociated' },
      { id: 'primase', name: 'Primase', state: 'complete' },
      { id: 'polymerase-lead', name: 'Pol III (Leading)', state: 'complete' },
      { id: 'polymerase-lag', name: 'Pol III (Lagging)', state: 'complete' },
      { id: 'polymerase-i', name: 'Pol I', state: 'complete' },
      { id: 'ligase', name: 'DNA Ligase', state: 'complete' }
    ]
  }
];
