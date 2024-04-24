import { FPricingCalculations } from '@gq/core/store/f-pricing/models/f-pricing-calculations.interface';

export const F_PRICING_CALCULATIONS_MOCK: FPricingCalculations = {
  absoluteMvdSurcharge: 0.5,
  absoluteTvdSurcharge: 0.8,
  finalPrice: 450,
  gpm: 60,
  sanityCheck: {
    lastCustomerPrice: undefined,
    maxPrice: 600,
    minPrice: 300,
    priceAfterSanityCheck: 450,
    priceBeforeSanityCheck: 400,
    sqv: 120,
    value: 26,
  },
};
