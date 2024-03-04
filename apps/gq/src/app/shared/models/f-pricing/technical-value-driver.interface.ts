import { ProductType } from '../quotation-detail';

export interface TechnicalValueDriver {
  productType: ProductType;
  // TODO: needed for the description
  topHeatTreatmentValue: string;
  heatTreatmentSurcharge: number;
  // TODO: needed for the description
  topToleranceClassValue: string;
  toleranceClassSurcharge: number;
  clearanceRadialSurcharge: number;
  clearanceAxialSurcharge: number;
  // TODO: needed for the description
  clearanceAxial: string;
  engineeringEffortSurcharge: number;
  surcharge?: number;
  materialNumber?: string;
}
