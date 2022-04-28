export enum SuitabilityLevels {
  'extremelySuitable' = '++',
  'highlySuitable' = '+',
  'suitable' = '0',
  'lessSuitable' = '-',
  'notSuitable' = '--',
}

export type SuitabilityLevelsSetting = {
  [key in `${SuitabilityLevels}`]: keyof typeof SuitabilityLevels;
};
