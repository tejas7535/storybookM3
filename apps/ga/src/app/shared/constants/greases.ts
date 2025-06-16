import { GreaseAlternative, GreaseCategory } from '../models';

export const NON_SCHAEFFLER_RHO_SI = 0.9;
export const NON_SCHAEFFLER_RHO_FPS = 0.032_514_562_800_09;

export const LB_NON_SCHAEFFLER_MPG = 'LB_NON_SCHAEFFLER_MPG';
export const LB_NON_SCHAEFFLER_HTG = 'LB_NON_SCHAEFFLER_HTG';

export const generalMultiPurpose: GreaseAlternative = {
  name: 'General Multi-Purpose',
  alternatives: ['Arcanol MULTITOP', 'Arcanol LOAD150'],
  all: true,
};

export const generalHighTemperature: GreaseAlternative = {
  name: 'General High-Temperature',
  alternatives: ['Arcanol TEMP90', 'Arcanol TEMP110'],
};

export const greaseCategories: GreaseCategory[] = [
  {
    name: 'parameters.productPreselection.grease.schaefflerGreases',
  },
  {
    name: 'parameters.productPreselection.grease.nonSchaefflerMultiPurposeGreases',
    type: LB_NON_SCHAEFFLER_MPG,
  },
  {
    name: 'parameters.productPreselection.grease.nonSchaefflerHighTempGreases',
    type: LB_NON_SCHAEFFLER_HTG,
  },
];

export const marketGreases = [
  {
    category: LB_NON_SCHAEFFLER_MPG,
    title: 'Non-Schaeffler Multi-Purpose Grease',
    entries: [generalMultiPurpose.name],
  },
  {
    category: LB_NON_SCHAEFFLER_HTG,
    title: 'Non-Schaeffler High-Temperature Grease',
    entries: [generalHighTemperature.name],
  },
];
