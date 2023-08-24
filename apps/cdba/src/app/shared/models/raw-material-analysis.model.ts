import { UnitOfMeasure } from './unit-of-measure.model';
export interface RawMaterialAnalysis {
  materialDesignation: string;
  materialNumber: string;
  costShare: number;
  supplier: string;
  operatingUnit: number;
  unitOfMeasure: UnitOfMeasure;
  uomBaseToPriceFactor: number;
  price: number;
  totalCosts: number;
  totalPrice: number;
  currency: string;
}
