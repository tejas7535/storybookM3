export interface ProductSelectionState {
  bearingDesignation?: string;
  bearingId?: string;
  calculationModuleInfo?: {
    catalogueCalculation: boolean;
    frictionCalculation: boolean;
  };
  error?: string;
}
