import { ProductType } from '../quotation-detail/material';

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
