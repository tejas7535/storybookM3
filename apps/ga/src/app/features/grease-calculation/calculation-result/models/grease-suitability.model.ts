export enum GreaseSuitabilityLevels {
  'ExtremelySuitable' = '++',
  'HighlySuitable' = '+',
  'Suitable' = '0',
  'LessSuitable' = '-',
  'NotSuitable' = '--',
}

export type GreaseSuitabilityLevelsSetting = {
  [key in `${GreaseSuitabilityLevels}`]: keyof typeof GreaseSuitabilityLevels;
};
