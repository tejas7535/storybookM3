import { ProductType } from '../quotation-detail';

export interface TechnicalValueDriver {
  productType: ProductType;
  topHeatTreatmentValue: string;
  heatTreatmentSurcharge: number;
  topToleranceClassValue: string;
  toleranceClassSurcharge: number;
  clearanceRadialSurcharge: number;
  clearanceAxialSurcharge: number;
  clearanceAxial: string;
  engineeringEffortSurcharge: number;
  surcharge?: number;
  materialNumber?: string;
}
