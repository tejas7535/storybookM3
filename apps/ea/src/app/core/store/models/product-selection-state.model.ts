export interface ProductSelectionState {
  bearingDesignation?: string;
  bearingId?: string;
  calculationModuleInfo?: {
    catalogueCalculation: boolean;
    frictionCalculation: boolean;
  };
  error?: string;
  loadcaseTemplate?: ProductSelectionTemplate[];
  operatingConditionsTemplate?: ProductSelectionTemplate[];
}

export interface ProductSelectionTemplate {
  id: string;
  minimum: number;
  maximum: number;
  options: { value: string }[];
}
