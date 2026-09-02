import { PredictionScenario } from '../types';

export const PREDICTION_SCENARIOS: Record<string, PredictionScenario> = {
  'pred-direction': {
    id: 'pred-direction',
    triggerProgress: 350,
    question: 'In which chemical direction can DNA Polymerase III add nucleotides to the growing DNA strand?',
    context: 'Primase has just synthesized an initial RNA primer on the leading strand template. DNA Polymerase III is now docking to begin elongation.',
    relatedObjectId: 'polymerase-lead',
    options: [
      {
        id: 'opt-5to3',
        text: '5\' → 3\' (adds to the free 3\'-OH group)',
        isCorrect: true,
        feedback: 'Correct! DNA Polymerase can only add nucleotides to a pre-existing free 3\'-hydroxyl group, extending the strand in the 5\' → 3\' direction.'
      },
      {
        id: 'opt-3to5',
        text: '3\' → 5\' (adds to the free 5\'-phosphate group)',
        isCorrect: false,
        feedback: 'Incorrect. DNA polymerases cannot synthesize 3\' → 5\'. Chemical proofreading requires the high-energy triphosphate bond to reside on the incoming monomer rather than the growing strand.'
      }
    ],
    scientificExplanation: 'All cellular DNA polymerases synthesize exclusively in the 5\' → 3\' direction. The 3\'-OH of the existing terminal nucleotide performs a nucleophilic attack on the α-phosphate of the incoming dNTP, releasing pyrophosphate (PPi) and driving polymerization forward.'
  },

  'pred-lagging': {
    id: 'pred-lagging',
    triggerProgress: 600,
    question: 'Why must the lagging strand be synthesized in discontinuous Okazaki fragments rather than continuously?',
    context: 'The replication fork is advancing to the right. The leading strand follows directly into the fork, but the lagging template requires a different strategy.',
    relatedObjectId: 'lagging-strand',
    options: [
      {
        id: 'opt-antiparallel',
        text: 'Antiparallel strands + 5\' → 3\' synthesis rule forces synthesis away from the fork',
        isCorrect: true,
        feedback: 'Correct! The bottom template is oriented 5\' → 3\' into the fork. Because polymerase can only synthesize 5\' → 3\', it must build backward away from the fork as new template is exposed.'
      },
      {
        id: 'opt-different-pol',
        text: 'The lagging strand uses a slower polymerase that cannot keep up with helicase',
        isCorrect: false,
        feedback: 'Incorrect. Both strands are synthesized by identical catalytic core subunits of the DNA Polymerase III holoenzyme.'
      },
      {
        id: 'opt-energy-lack',
        text: 'The cell lacks enough dNTP energy to synthesize both strands at once',
        isCorrect: false,
        feedback: 'Incorrect. Cellular dNTP concentrations and high-energy phosphate availability are identical on both strands.'
      }
    ],
    scientificExplanation: 'Because DNA strands are antiparallel, opening the fork exposes one template strand running 3\' → 5\' (leading) and one running 5\' → 3\' (lagging). Since synthesis is strictly 5\' → 3\', the lagging strand must be synthesized in piecewise Okazaki fragments directed away from the fork junction.'
  },

  'pred-primer': {
    id: 'pred-primer',
    triggerProgress: 220,
    question: 'Why is RNA Primase required before DNA Polymerase can begin synthesizing DNA?',
    context: 'Helicase has unwound the parental strands, but DNA Polymerase cannot immediately attach the first deoxynucleotide to naked template DNA.',
    relatedObjectId: 'primase',
    options: [
      {
        id: 'opt-need-3oh',
        text: 'DNA Polymerase cannot initiate synthesis de novo; it requires a pre-existing 3\'-OH end',
        isCorrect: true,
        feedback: 'Correct! DNA Polymerases can only extend an existing chain that has a paired 3\'-OH group. RNA Primase can initiate de novo (from scratch).'
      },
      {
        id: 'opt-unwind',
        text: 'RNA primers are required to chemically melt hydrogen bonds between base pairs',
        isCorrect: false,
        feedback: 'Incorrect. Hydrogen bonds are melted by DNA Helicase consuming ATP, not by the RNA primer.'
      },
      {
        id: 'opt-energy',
        text: 'RNA primers provide all the ATP energy needed to power DNA Polymerase movement',
        isCorrect: false,
        feedback: 'Incorrect. Polymerization energy comes from the cleavage of high-energy pyrophosphate (PPi) from each incoming dNTP monomer.'
      }
    ],
    scientificExplanation: 'Unlike RNA polymerases (including Primase), which can join two free nucleotides de novo without an existing primer, DNA Polymerases have a strict requirement for a pre-existing 3\'-OH terminus to perform the nucleophilic substitution on the next dNTP.'
  },

  'pred-ligase': {
    id: 'pred-ligase',
    triggerProgress: 880,
    question: 'Which enzyme catalyzes the final covalent phosphodiester bond to seal adjacent Okazaki fragments?',
    context: 'DNA Polymerase I has removed the RNA primer and filled the gap with deoxynucleotides, but a single nick remains in the sugar-phosphate backbone.',
    relatedObjectId: 'ligase',
    options: [
      {
        id: 'opt-ligase',
        text: 'DNA Ligase (uses ATP/NAD⁺ to seal the backbone nick)',
        isCorrect: true,
        feedback: 'Correct! DNA Ligase activates the 5\'-phosphate using AMP, then catalyzes condensation with the adjacent 3\'-OH to complete an unbroken strand.'
      },
      {
        id: 'opt-helicase',
        text: 'DNA Helicase (relocates to reweld the backbone)',
        isCorrect: false,
        feedback: 'Incorrect. Helicase is an unwinding motor that breaks hydrogen bonds; it cannot form covalent phosphodiester bonds.'
      },
      {
        id: 'opt-topoisomerase',
        text: 'Topoisomerase (swaps the fragments into place)',
        isCorrect: false,
        feedback: 'Incorrect. Topoisomerase acts ahead of the replication fork to relieve supercoiling strain.'
      }
    ],
    scientificExplanation: 'DNA Polymerase I leaves a nick because the adjacent nucleotide only has a monophosphate (not a high-energy triphosphate). DNA Ligase couples ATP (or NAD⁺) hydrolysis to form the final phosphodiester bond, completing lagging-strand maturation.'
  }
};
