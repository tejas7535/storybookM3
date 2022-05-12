export enum SuitabilityLevels {
  'ExtremelySuitable' = '++',
  'HighlySuitable' = '+',
  'Suitable' = '0',
  'LessSuitable' = '-',
  'NotSuitable' = '--',
}

export type SuitabilityLevelsSetting = {
  [key in `${SuitabilityLevels}`]: keyof typeof SuitabilityLevels;
};
