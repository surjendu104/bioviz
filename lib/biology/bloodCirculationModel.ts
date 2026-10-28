export type CirculationMode = 'full' | 'pulmonary' | 'systemic' | 'trace';

export type OxygenationState = 'oxygen-poor' | 'oxygen-rich';

export interface AnatomicalEntity {
  id: string;
  name: string;
  subtitle: string;
  category: 'chamber' | 'valve' | 'vessel' | 'organ' | 'circuit';
  patientSide?: 'right' | 'left';
  oxygenation: OxygenationState;
  oxygenSaturation: string; // e.g. "75% sO2" or "98% sO2"
  pressureTypical: string; // e.g. "2–8 mmHg" or "120/80 mmHg"
  function: string;
  downstreamDestination: string;
  upstreamSource: string;
  keyPrinciple: string;
  clinicalSignificance: string;
}

export interface CirculationStepDefinition {
  step: number;
  id: string;
  structureName: string;
  circuit: 'pulmonary' | 'systemic' | 'transition';
  oxygenation: OxygenationState;
  title: string;
  description: string;
  downstreamNext: string;
}

export const CIRCULATION_STEPS: CirculationStepDefinition[] = [
  {
    step: 1,
    id: 'right-atrium',
    structureName: 'Right Atrium',
    circuit: 'systemic',
    oxygenation: 'oxygen-poor',
    title: '01 / Venous Blood Return',
    description: 'Deoxygenated blood returning from systemic body tissues enters the thin-walled Right Atrium via the Superior Vena Cava (head/arms) and Inferior Vena Cava (torso/legs).',
    downstreamNext: 'Tricuspid Valve → Right Ventricle'
  },
  {
    step: 2,
    id: 'right-ventricle',
    structureName: 'Right Ventricle',
    circuit: 'transition',
    oxygenation: 'oxygen-poor',
    title: '02 / Right Ventricular Filling',
    description: 'During ventricular diastole (filling), the Tricuspid Valve opens and deoxygenated blood flows from the right atrium into the crescent-shaped Right Ventricle.',
    downstreamNext: 'Pulmonary Valve → Pulmonary Arteries'
  },
  {
    step: 3,
    id: 'pulmonary-arteries',
    structureName: 'Pulmonary Trunk & Arteries',
    circuit: 'pulmonary',
    oxygenation: 'oxygen-poor',
    title: '03 / Pulmonary Outflow',
    description: 'The right ventricle contracts during systole, forcing blood through the open Pulmonary Valve into the Pulmonary Trunk, which bifurcates into left and right pulmonary arteries.',
    downstreamNext: 'Alveolar Capillaries in Lungs'
  },
  {
    step: 4,
    id: 'lungs',
    structureName: 'Pulmonary Capillaries (Lungs)',
    circuit: 'pulmonary',
    oxygenation: 'oxygen-rich',
    title: '04 / Pulmonary Gas Exchange',
    description: 'In alveolar capillary networks of the lungs, carbon dioxide (CO₂) diffuses out into alveoli to be exhaled, and inhaled oxygen (O₂) diffuses into erythrocytes, binding to hemoglobin (sO₂ rises to 98%).',
    downstreamNext: 'Pulmonary Veins → Left Atrium'
  },
  {
    step: 5,
    id: 'left-atrium',
    structureName: 'Left Atrium',
    circuit: 'pulmonary',
    oxygenation: 'oxygen-rich',
    title: '05 / Oxygenated Pulmonary Return',
    description: 'Four pulmonary veins (two from each lung) deliver freshly oxygenated, bright red blood directly into the smooth-walled Left Atrium.',
    downstreamNext: 'Mitral / Bicuspid Valve → Left Ventricle'
  },
  {
    step: 6,
    id: 'left-ventricle',
    structureName: 'Left Ventricle',
    circuit: 'transition',
    oxygenation: 'oxygen-rich',
    title: '06 / Left Ventricular Filling',
    description: 'During diastole, the Mitral (Bicuspid) Valve opens, allowing oxygen-rich blood to fill the heavily muscled, thick-walled Left Ventricle.',
    downstreamNext: 'Aortic Valve → Ascending Aorta'
  },
  {
    step: 7,
    id: 'aorta',
    structureName: 'Aorta & Systemic Arteries',
    circuit: 'systemic',
    oxygenation: 'oxygen-rich',
    title: '07 / High-Pressure Systemic Pumping',
    description: 'The thick left ventricle generates massive systolic pressure (~120 mmHg), driving oxygenated blood through the Aortic Valve into the Aorta Arch to supply the entire body.',
    downstreamNext: 'Systemic Capillary Beds (Brain & Body)'
  },
  {
    step: 8,
    id: 'body-tissues',
    structureName: 'Systemic Capillaries (Body)',
    circuit: 'systemic',
    oxygenation: 'oxygen-poor',
    title: '08 / Systemic Nutrient & Oxygen Delivery',
    description: 'Throughout systemic capillaries in muscle, brain, kidneys, and organs, oxygen (O₂) and glucose are unloaded to sustain cellular metabolism, while metabolic CO₂ waste is collected.',
    downstreamNext: 'Systemic Venules & Vena Cava'
  },
  {
    step: 9,
    id: 'vena-cava',
    structureName: 'Superior & Inferior Vena Cava',
    circuit: 'systemic',
    oxygenation: 'oxygen-poor',
    title: '09 / Venous Return to Heart',
    description: 'Deoxygenated blood converges into the Superior and Inferior Vena Cava veins to re-enter the Right Atrium, completing the continuous cardiovascular loop.',
    downstreamNext: 'Right Atrium (Loop repeats)'
  }
];

export const CIRCULATION_INSPECTABLES: Record<string, AnatomicalEntity> = {
  'right-atrium': {
    id: 'right-atrium',
    name: 'Right Atrium',
    subtitle: 'Systemic Venous Inflow Chamber (Patient Right)',
    category: 'chamber',
    patientSide: 'right',
    oxygenation: 'oxygen-poor',
    oxygenSaturation: '70–75% sO₂ (Deoxygenated)',
    pressureTypical: '2–6 mmHg (Low Pressure)',
    function: 'Receives deoxygenated systemic venous return from the superior vena cava, inferior vena cava, and coronary sinus; primes the right ventricle.',
    upstreamSource: 'Superior & Inferior Vena Cava',
    downstreamDestination: 'Right Ventricle (via Tricuspid Valve)',
    keyPrinciple: 'Thin-walled low-pressure reservoir containing the Sinoatrial (SA) node, the intrinsic pacemaker initiating cardiac contraction.',
    clinicalSignificance: 'Elevated central venous pressure in right heart failure leads to jugular venous distention and peripheral edema.'
  },
  'right-ventricle': {
    id: 'right-ventricle',
    name: 'Right Ventricle',
    subtitle: 'Pulmonary Pumping Chamber (Patient Right)',
    category: 'chamber',
    patientSide: 'right',
    oxygenation: 'oxygen-poor',
    oxygenSaturation: '70–75% sO₂ (Deoxygenated)',
    pressureTypical: '25/4 mmHg (Low-Resistance Circuit)',
    function: 'Pumps deoxygenated blood through the pulmonary semilunar valve into the low-resistance pulmonary circulation of the lungs.',
    upstreamSource: 'Right Atrium (via Tricuspid Valve)',
    downstreamDestination: 'Pulmonary Trunk & Arteries (via Pulmonary Valve)',
    keyPrinciple: 'Thinner crescent-shaped myocardial wall compared to left ventricle (~4–5 mm thick) optimized for low-pressure volume displacement.',
    clinicalSignificance: 'Subject to hypertrophy and failure in chronic pulmonary arterial hypertension (cor pulmonale).'
  },
  'left-atrium': {
    id: 'left-atrium',
    name: 'Left Atrium',
    subtitle: 'Pulmonary Venous Receiving Chamber (Patient Left)',
    category: 'chamber',
    patientSide: 'left',
    oxygenation: 'oxygen-rich',
    oxygenSaturation: '95–98% sO₂ (Oxygenated)',
    pressureTypical: '4–10 mmHg',
    function: 'Receives freshly oxygenated blood from the four pulmonary veins; delivers blood to the left ventricle across the mitral valve during diastole.',
    upstreamSource: 'Four Pulmonary Veins (Lungs)',
    downstreamDestination: 'Left Ventricle (via Mitral Valve)',
    keyPrinciple: 'Smooth-walled chamber posterior to the aortic root; contributes ~20% of left ventricular filling volume via atrial systole (atrial kick).',
    clinicalSignificance: 'Atrial fibrillation in an enlarged left atrium promotes stasis and thrombus formation, increasing ischemic stroke risk.'
  },
  'left-ventricle': {
    id: 'left-ventricle',
    name: 'Left Ventricle',
    subtitle: 'High-Pressure Systemic Workhorse (Patient Left)',
    category: 'chamber',
    patientSide: 'left',
    oxygenation: 'oxygen-rich',
    oxygenSaturation: '95–98% sO₂ (Oxygenated)',
    pressureTypical: '120/8 mmHg (High-Pressure System)',
    function: 'Generates high systolic pressure to pump oxygenated blood through the aortic valve into the systemic arterial tree supplying all bodily organs.',
    upstreamSource: 'Left Atrium (via Mitral Valve)',
    downstreamDestination: 'Aorta (via Aortic Valve)',
    keyPrinciple: 'Thick, conical muscular wall (8–12 mm, ~3x thicker than right ventricle) to overcome the high peripheral vascular resistance of the systemic circuit.',
    clinicalSignificance: 'Left ventricular ejection fraction (LVEF, normal 55–70%) is the primary clinical parameter measuring systolic cardiac performance.'
  },
  'tricuspid-valve': {
    id: 'tricuspid-valve',
    name: 'Tricuspid Valve',
    subtitle: 'Right Atrioventricular (AV) Valve',
    category: 'valve',
    patientSide: 'right',
    oxygenation: 'oxygen-poor',
    oxygenSaturation: '75% sO₂',
    pressureTypical: 'Opens in diastole (<6 mmHg), Closes in systole',
    function: 'Opens during ventricular diastole to allow blood flow from right atrium to right ventricle; closes during ventricular systole to prevent backflow into the atrium.',
    upstreamSource: 'Right Atrium',
    downstreamDestination: 'Right Ventricle',
    keyPrinciple: 'Composed of 3 fibrous cusps anchored by chordae tendineae to papillary muscles that contract to prevent cusp prolapse into the atrium.',
    clinicalSignificance: 'Closure contributes to the first heart sound (S1 "lub").'
  },
  'pulmonary-valve': {
    id: 'pulmonary-valve',
    name: 'Pulmonary Valve',
    subtitle: 'Right Ventricular Outflow Semilunar Valve',
    category: 'valve',
    patientSide: 'right',
    oxygenation: 'oxygen-poor',
    oxygenSaturation: '75% sO₂',
    pressureTypical: 'Opens when RV pressure exceeds ~10 mmHg',
    function: 'Opens during right ventricular systole to allow blood ejection into the pulmonary trunk; closes in diastole to prevent pulmonary arterial backflow.',
    upstreamSource: 'Right Ventricle',
    downstreamDestination: 'Pulmonary Trunk / Arteries',
    keyPrinciple: 'Composed of 3 pocket-like crescent semilunar cusps that seal passively under arterial diastolic backpressure without chordae tendineae.',
    clinicalSignificance: 'Closure contributes to the pulmonary component (P2) of the second heart sound (S2 "dub").'
  },
  'mitral-valve': {
    id: 'mitral-valve',
    name: 'Mitral (Bicuspid) Valve',
    subtitle: 'Left Atrioventricular (AV) Valve',
    category: 'valve',
    patientSide: 'left',
    oxygenation: 'oxygen-rich',
    oxygenSaturation: '98% sO₂',
    pressureTypical: 'Withstands up to 120 mmHg systolic pressure',
    function: 'Prevents backflow from the high-pressure left ventricle into the low-pressure left atrium during ventricular systole.',
    upstreamSource: 'Left Atrium',
    downstreamDestination: 'Left Ventricle',
    keyPrinciple: 'Composed of 2 large cusps (anterior and posterior) reinforced by heavy chordae tendineae and powerful anterolateral/posteromedial papillary muscles.',
    clinicalSignificance: 'Mitral valve prolapse or regurgitation causes systolic murmurs and retrograde pulmonary venous congestion.'
  },
  'aortic-valve': {
    id: 'aortic-valve',
    name: 'Aortic Valve',
    subtitle: 'Left Ventricular Outflow Semilunar Valve',
    category: 'valve',
    patientSide: 'left',
    oxygenation: 'oxygen-rich',
    oxygenSaturation: '98% sO₂',
    pressureTypical: 'Opens when LV pressure exceeds aortic pressure (~80 mmHg); closes as LV pressure falls',
    function: 'Opens during left ventricular systole to eject stroke volume into the aorta; snaps shut during diastole to maintain systemic arterial diastolic pressure (~80 mmHg).',
    upstreamSource: 'Left Ventricle',
    downstreamDestination: 'Ascending Aorta',
    keyPrinciple: '3 robust semilunar cusps; sinuses of Valsalva above cusps direct blood flow into the left and right coronary artery ostia during diastole.',
    clinicalSignificance: 'Aortic stenosis (calcification) forces left ventricular hypertrophy and causes exertional syncope or angina.'
  },
  'aorta': {
    id: 'aorta',
    name: 'Aorta & Aortic Arch',
    subtitle: 'Main Systemic High-Pressure Conduit',
    category: 'vessel',
    patientSide: 'left',
    oxygenation: 'oxygen-rich',
    oxygenSaturation: '98% sO₂ (Oxygenated)',
    pressureTypical: '120/80 mmHg (Systemic Arterial)',
    function: 'Carries high-pressure oxygenated blood from the left ventricle; distributes arterial blood to the head, arms, thoracic organs, abdominal viscera, and legs.',
    upstreamSource: 'Left Ventricle (via Aortic Valve)',
    downstreamDestination: 'Systemic Arterial Tree & Capillaries',
    keyPrinciple: 'Elastic Windkessel vessel: expands during systole to dampen pressure spikes and recoils elastically during diastole to maintain continuous forward perfusion.',
    clinicalSignificance: 'Aortic dissection or aneurysm represents a life-threatening structural vascular emergency.'
  },
  'vena-cava': {
    id: 'vena-cava',
    name: 'Superior & Inferior Vena Cava',
    subtitle: 'Great Systemic Venous Trunks',
    category: 'vessel',
    patientSide: 'right',
    oxygenation: 'oxygen-poor',
    oxygenSaturation: '70–75% sO₂ (Deoxygenated)',
    pressureTypical: '2–6 mmHg (Central Venous Pressure)',
    function: 'Superior Vena Cava drains deoxygenated blood from the head, neck, and upper limbs; Inferior Vena Cava drains blood from the abdomen and lower extremities.',
    upstreamSource: 'Systemic Venous Capillaries',
    downstreamDestination: 'Right Atrium',
    keyPrinciple: 'Large-capacitance veins possessing thin compliant walls operating under minimal pressure gradients assisted by the respiratory thoracoabdominal pump.',
    clinicalSignificance: 'Central venous catheterization access route for hemodynamic monitoring and medication infusion.'
  },
  'pulmonary-arteries': {
    id: 'pulmonary-arteries',
    name: 'Pulmonary Trunk & Arteries',
    subtitle: 'Deoxygenated Outflow to Lungs',
    category: 'vessel',
    patientSide: 'right',
    oxygenation: 'oxygen-poor',
    oxygenSaturation: '70–75% sO₂ (Deoxygenated)',
    pressureTypical: '25/10 mmHg (Mean ~15 mmHg)',
    function: 'The ONLY postnatal arteries that carry deoxygenated blood; bifurcates into left and right branches conveying blood to pulmonary alveolar capillary beds.',
    upstreamSource: 'Right Ventricle (via Pulmonary Valve)',
    downstreamDestination: 'Pulmonary Capillaries (Lungs)',
    keyPrinciple: 'Thinner, more compliant walls with 1/6th the vascular resistance of the systemic arterial system to protect fragile alveolar gas exchange membranes.',
    clinicalSignificance: 'Pulmonary embolism occurs when deep vein thrombosis (DVT) clots migrate and occlude these arterial branches.'
  },
  'pulmonary-veins': {
    id: 'pulmonary-veins',
    name: 'Pulmonary Veins',
    subtitle: 'Oxygenated Return from Lungs',
    category: 'vessel',
    patientSide: 'left',
    oxygenation: 'oxygen-rich',
    oxygenSaturation: '95–98% sO₂ (Oxygenated)',
    pressureTypical: '4–10 mmHg',
    function: 'The ONLY postnatal veins that carry fully oxygenated blood; 4 separate veins (two left, two right) enter the posterodorsal wall of the left atrium.',
    upstreamSource: 'Pulmonary Capillaries (Lungs)',
    downstreamDestination: 'Left Atrium',
    keyPrinciple: 'Lack venous valves; changes in left atrial pressure reflect directly back into pulmonary capillaries (causing pulmonary edema if left heart fails).',
    clinicalSignificance: 'Ectopic electrical foci around the pulmonary vein ostia are the most common trigger of atrial fibrillation.'
  },
  'lungs': {
    id: 'lungs',
    name: 'Lungs (Pulmonary Capillaries)',
    subtitle: 'External Alveolar Gas Exchange Bed',
    category: 'organ',
    oxygenation: 'oxygen-rich',
    oxygenSaturation: 'Transition: 75% → 98% sO₂',
    pressureTypical: 'Mean Capillary Pressure ~8–10 mmHg',
    function: 'Gas exchange interface where erythrocyte hemoglobin unloads metabolic carbon dioxide (CO₂) and binds oxygen (O₂) across the 0.5 μm alveolar-capillary barrier.',
    upstreamSource: 'Pulmonary Arteries',
    downstreamDestination: 'Pulmonary Veins',
    keyPrinciple: 'Enormous surface area (~70–100 m², size of a tennis court) with red blood cells passing in single file in <0.75 seconds to ensure complete equilibration.',
    clinicalSignificance: 'Pulmonary edema impairs oxygen diffusion, leading to hypoxemia and respiratory distress.'
  },
  'body-tissues': {
    id: 'body-tissues',
    name: 'Systemic Capillary Beds (Body)',
    subtitle: 'Internal Tissue Oxygen & Nutrient Delivery',
    category: 'organ',
    oxygenation: 'oxygen-poor',
    oxygenSaturation: 'Transition: 98% → 75% sO₂',
    pressureTypical: 'Arteriolar 35 mmHg → Venular 15 mmHg',
    function: 'Delivers oxygen, glucose, amino acids, and hormones to peripheral tissues (brain, muscles, kidneys, viscera) and collects metabolic waste products (CO₂, urea).',
    upstreamSource: 'Aorta & Systemic Arteries',
    downstreamDestination: 'Systemic Venules & Vena Cava',
    keyPrinciple: 'Precapillary sphincters dynamically regulate local perfusion based on metabolic demand (hypoxia, adenosine, nitric oxide, low pH).',
    clinicalSignificance: 'Septic or anaphylactic shock causes widespread systemic vasodilation, resulting in severe organ hypoperfusion.'
  }
};
