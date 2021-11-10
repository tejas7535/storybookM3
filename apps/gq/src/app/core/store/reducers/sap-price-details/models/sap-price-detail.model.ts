import { CalculationType } from './calculation-type.enum';

export interface SapPriceDetail {
  sapConditionType: string;
  conditionTypeDescription: string;
  amount: number;
  conditionValue: number;
  pricingUnit: number;
  conditionUnit: string;
  validTo: Date;
  calculationType: CalculationType;
}
