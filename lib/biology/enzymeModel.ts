export interface EnzymeInspectable {
  id: string;
  name: string;
  category: 'enzyme' | 'substrate' | 'complex' | 'inhibitor' | 'plot';
  function: string;
  keyPrinciple: string;
  equation?: string;
  cellularContext?: string;
}

export const ENZYME_INSPECTABLES: Record<string, EnzymeInspectable> = {
  'apoenzyme': {
    id: 'apoenzyme',
    name: 'Free Enzyme (E)',
    category: 'enzyme',
    function: 'Biocatalyst that accelerates reaction rates by stabilizing transition states and lowering activation energy (ΔG‡) without altering overall equilibrium (ΔG°).',
    keyPrinciple: 'Recycled unchanged after each catalytic turnover cycle: E + S ⇌ ES → E + P.',
    equation: 'k_cat = V_max / [E_total] (turnover number, s⁻¹)',
    cellularContext: 'Enzymes accelerate biochemical reactions by factors of 10⁶ to 10¹⁷ fold.'
  },
  'substrate': {
    id: 'substrate',
    name: 'Substrate Molecule (S)',
    category: 'substrate',
    function: 'Reactant molecule that binds selectively into the enzyme catalytic pocket via complementary non-covalent interactions.',
    keyPrinciple: 'At low [S] (first-order regime), reaction velocity is limited by collision frequency; at saturating [S] (zero-order regime), velocity is limited by catalytic turnover rate.',
    cellularContext: 'Cellular metabolites maintained under dynamic homeostatic flux.'
  },
  'es-complex': {
    id: 'es-complex',
    name: 'Enzyme-Substrate Complex (ES)',
    category: 'complex',
    function: 'Transient catalytic intermediate formed when substrate binds the active site cleft via induced-fit conformational changes.',
    keyPrinciple: 'Steady-state assumption (Briggs-Haldane): the rate of ES formation equals the rate of ES breakdown (d[ES]/dt ≈ 0).',
    equation: 'K_m = (k_-1 + k_cat) / k_1',
    cellularContext: 'The core intermediate governing Michaelis-Menten kinetics.'
  },
  'competitive-inhibitor': {
    id: 'competitive-inhibitor',
    name: 'Competitive Inhibitor (I_c)',
    category: 'inhibitor',
    function: 'Structural analog of substrate that competes directly for binding to the catalytic active site cleft.',
    keyPrinciple: 'Can be outcompeted by high substrate concentration [S]. Increases apparent K_m (K_m,app = K_m(1 + [I]/K_i)) without changing V_max.',
    equation: 'v = (V_max · [S]) / (K_m(1 + [I]/K_i) + [S])',
    cellularContext: 'Clinically important class of drugs including statins (HMG-CoA reductase inhibitors) and methotrexate.'
  },
  'noncompetitive-inhibitor': {
    id: 'noncompetitive-inhibitor',
    name: 'Non-Competitive / Allosteric Inhibitor (I_nc)',
    category: 'inhibitor',
    function: 'Binds an allosteric regulatory site distinct from the active site, inducing a conformational change that inactivates catalytic turnover.',
    keyPrinciple: 'Cannot be overcome by increasing substrate concentration [S]. Decreases V_max (V_max,app = V_max / (1 + [I]/K_i)) while K_m remains unchanged.',
    equation: 'v = (V_max / (1 + [I]/K_i) · [S]) / (K_m + [S])',
    cellularContext: 'Crucial for feedback inhibition in metabolic pathways (e.g. ATP inhibiting phosphofructokinase).'
  },
  'michaelis-menten-plot': {
    id: 'michaelis-menten-plot',
    name: 'Michaelis-Menten Hyperbolic Curve',
    category: 'plot',
    function: 'Fundamental rate equation describing initial velocity (v₀) as a function of substrate concentration [S].',
    keyPrinciple: 'Shows rectangular hyperbolic saturation. Half-maximal velocity v = V_max / 2 occurs exactly when [S] = K_m.',
    equation: 'v₀ = (V_max · [S]) / (K_m + [S])',
    cellularContext: 'Standard kinetic model for non-allosteric single-substrate enzymatic reactions.'
  }
};
