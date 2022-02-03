import { CalculationType } from './calculation-type.enum';

export interface SapPriceConditionDetail {
  sapConditionType: string;
  conditionTypeDescription: string;
  amount: number;
  conditionValue: number;
  pricingUnit: number;
  conditionUnit: string;
  validTo: Date;
  calculationType: CalculationType;
  sequenceId: number;
}
