export enum BearingSelectionType {
  QuickSelection = 'QUICK_SELECTION',
  AdvancedSelection = 'ADVANCED_SELECTION',
}

export type BearingSelectionTypeUnion = `${BearingSelectionType}`;

export interface AdvancedBearingSelectionFilters {
  bearingType: string;
  boreDiameterMin: number;
  boreDiameterMax: number;
  outsideDiameterMin: number;
  outsideDiameterMax: number;
  widthMin: number;
  widthMax: number;
}
