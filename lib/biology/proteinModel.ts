export interface TranslationCodon {
  index: number;
  triplet: string;
  aminoAcid: string;
  name: string;
  anticodon: string;
  isStart?: boolean;
  isStop?: boolean;
}

export const mRNA_SEQUENCE: TranslationCodon[] = [
  { index: 0, triplet: 'AUG', aminoAcid: 'Met', name: 'Methionine', anticodon: 'UAC', isStart: true },
  { index: 1, triplet: 'UUU', aminoAcid: 'Phe', name: 'Phenylalanine', anticodon: 'AAA' },
  { index: 2, triplet: 'GGC', aminoAcid: 'Gly', name: 'Glycine', anticodon: 'CCG' },
  { index: 3, triplet: 'CAU', aminoAcid: 'His', name: 'Histidine', anticodon: 'GUA' },
  { index: 4, triplet: 'GAA', aminoAcid: 'Glu', name: 'Glutamic Acid', anticodon: 'CUU' },
  { index: 5, triplet: 'UAC', aminoAcid: 'Tyr', name: 'Tyrosine', anticodon: 'AUG' },
  { index: 6, triplet: 'UGU', aminoAcid: 'Cys', name: 'Cysteine', anticodon: 'ACA' },
  { index: 7, triplet: 'UAA', aminoAcid: 'STOP', name: 'Ochre (Stop)', anticodon: '---', isStop: true },
];

export interface ProteinInspectable {
  id: string;
  name: string;
  category: 'ribosome' | 'trna' | 'site' | 'chemistry';
  function: string;
  keyPrinciple: string;
  equation?: string;
  cellularContext?: string;
}

export const PROTEIN_INSPECTABLES: Record<string, ProteinInspectable> = {
  'ribosome-large': {
    id: 'ribosome-large',
    name: 'Ribosomal Large Subunit (50S / 60S)',
    category: 'ribosome',
    function: 'Contains the peptidyl transferase center (PTC) ribozyme that catalyzes peptide bond formation between adjacent amino acids.',
    keyPrinciple: 'Catalysis is performed by 23S/28S rRNA (an RNA enzyme/ribozyme), proving RNA catalytic origin of life.',
    equation: 'Peptidyl-tRNA (P-site) + Aminoacyl-tRNA (A-site) → Uncharged tRNA + Extended Peptidyl-tRNA',
    cellularContext: 'Forms complete 70S (prokaryotic) or 80S (eukaryotic) translating monosome.'
  },
  'ribosome-small': {
    id: 'ribosome-small',
    name: 'Ribosomal Small Subunit (30S / 40S)',
    category: 'ribosome',
    function: 'Binds mRNA template and mediates high-fidelity codon–anticodon base pairing verification at the decoding center.',
    keyPrinciple: 'Adenine residues A1492 and A1493 in 16S rRNA flip out to inspect minor groove Watson-Crick geometry of the codon-anticodon duplex.',
    cellularContext: 'Initiates translation by scanning for the Kozak consensus / Shine-Dalgarno sequence.'
  },
  'a-site': {
    id: 'a-site',
    name: 'A-Site (Aminoacyl-tRNA Binding Site)',
    category: 'site',
    function: 'Accommodates the incoming charged aminoacyl-tRNA delivering the next amino acid specified by the mRNA codon.',
    keyPrinciple: 'GTP hydrolysis by EF-Tu (eEF1A) ensures kinetic proofreading before accommodation into the catalytic PTC.',
    cellularContext: 'First checkpoint in the translation elongation cycle.'
  },
  'p-site': {
    id: 'p-site',
    name: 'P-Site (Peptidyl-tRNA Binding Site)',
    category: 'site',
    function: 'Holds the tRNA covalently attached to the growing nascent polypeptide chain.',
    keyPrinciple: 'Transfers the peptide chain to the incoming amino acid at the A-site via condensation nucleophilic attack.',
    cellularContext: 'Occupied by initiator tRNA (fMet-tRNA) during translation initiation.'
  },
  'e-site': {
    id: 'e-site',
    name: 'E-Site (Exit Site)',
    category: 'site',
    function: 'Transiently holds deacylated (uncharged) tRNA after peptide bond transfer before dissociation into the cytoplasm.',
    keyPrinciple: 'Uncharged tRNA is released to be recharged by its cognate aminoacyl-tRNA synthetase consuming ATP.',
    cellularContext: 'Ensures unidirectional ribosomal translocation without back-sliding.'
  },
  'peptide-bond': {
    id: 'peptide-bond',
    name: 'Peptide Bond Synthesis (Transpeptidation)',
    category: 'chemistry',
    function: 'Condensation reaction forming a covalent amide linkage (-CO-NH-) between the α-amino group of A-site amino acid and the carboxyl ester of P-site tRNA.',
    keyPrinciple: 'Driven by the ester bond energy of aminoacyl-tRNA charging (thermodynamically favorable).',
    equation: 'R₁-CO-O-tRNA + H₂N-CH(R₂)-CO-O-tRNA → R₁-CO-NH-CH(R₂)-CO-O-tRNA + HO-tRNA',
    cellularContext: 'Synthesizes proteins at ~20 amino acids/sec in bacteria, ~2–4 aa/sec in humans.'
  }
};
