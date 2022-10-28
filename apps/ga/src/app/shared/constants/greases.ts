export const LB_NON_SCHAEFFLER_MPG = 'LB_NON_SCHAEFFLER_MPG';
export const LB_NON_SCHAEFFLER_HTG = 'LB_NON_SCHAEFFLER_HTG';

export const highTemperaturGreases = [
  'Klüberplex BEM41-132',
  'Exxon Polyrex EM',
  'Exxon Mobilith SHC 100',
  'Exxon Unirex N3',
  'Shell Retinax LX2',
];

export const greaseCategories = [
  {
    name: 'parameters.productPreselection.grease.schaefflerGreases',
  },
  {
    name: 'parameters.productPreselection.grease.nonSchaefflerGreases',
    types: [LB_NON_SCHAEFFLER_MPG, LB_NON_SCHAEFFLER_HTG],
  },
];

export const marketGreases = [
  {
    category: LB_NON_SCHAEFFLER_MPG,
    title: 'Non-Schaeffler Multi-Purpose Grease',
    entries: [],
  },
  {
    category: LB_NON_SCHAEFFLER_HTG,
    title: 'Non-Schaeffler High-Temperature Grease',
    entries: highTemperaturGreases,
  },
];
