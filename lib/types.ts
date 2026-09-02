export type InspectableCategory = 'enzyme' | 'strand' | 'feature' | 'chemistry';

export interface InspectableObject {
  id: string;
  name: string;
  category: InspectableCategory;
  systematicName?: string;
  function: string;
  direction?: string;
  keyPrinciple: string;
  reactionEquation?: string;
  cofactors?: string;
  cellularContext?: string;
}

export interface StepDefinition {
  id: number;
  target: number; // progress 0 to 1000
  name: string;
  phase: string;
  desc: string;
  keyTakeaway: string;
  activeEnzymes: {
    id: string;
    name: string;
    state: 'active' | 'waiting' | 'complete' | 'dissociated';
  }[];
  predictionId?: string;
}

export interface PredictionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface PredictionScenario {
  id: string;
  triggerProgress: number;
  question: string;
  context: string;
  options: PredictionOption[];
  scientificExplanation: string;
  relatedObjectId?: string;
}

export interface AppState {
  isPlaying: boolean;
  progress: number; // 0 to 1000
  speed: number;
  selectedObject: InspectableObject | null;
  showLabels: boolean;
  showDirection: boolean;
  showBaseLetters: boolean;
  showEnzymes: boolean;
  showParticles: boolean;
  showActiveSiteModal?: boolean;
}
