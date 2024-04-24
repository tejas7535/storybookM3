import {
  CalculationsSanityCheck,
  FPricingCalculationsResponse,
} from '@gq/shared/models/f-pricing';

export interface FPricingCalculations extends FPricingCalculationsResponse {
  sanityCheck: FPricingSanityChecks;
}

export interface FPricingSanityChecks extends CalculationsSanityCheck {
  sqv: number;
  lastCustomerPrice: number;
  priceAfterSanityCheck: number;
}
