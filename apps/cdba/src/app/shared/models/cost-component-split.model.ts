export interface CostComponentSplit {
  description: string;
  costComponent: string;
  splitType: CostComponentSplitType;
  totalValue: number;
  fixedValue: number;
  variableValue: number;
  currency: string;
}

export type CostComponentSplitType = 'MAIN' | 'AUX' | 'TOTAL';
