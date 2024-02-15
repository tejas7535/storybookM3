import { ProductType } from '../quotation-detail';

export interface MarketValueDriver {
  questionId: number;
  selectedOptionId: number;
  productType: ProductType;
  options: SurchargeItem[];
}

export interface SurchargeItem {
  optionId: number;
  surcharge: number;
}
