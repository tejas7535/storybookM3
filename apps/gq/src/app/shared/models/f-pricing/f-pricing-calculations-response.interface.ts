export interface FPricingCalculationsResponse {
  absoluteMvdSurcharge: number;
  absoluteTvdSurcharge: number;
  finalPrice: number;
  gpm: number; // e.g. 0.5554 (4-digits) - needs to be multiplied with 100 for displaying 55.54%
  sanityCheck: CalculationsSanityCheck;
}

export interface CalculationsSanityCheck {
  priceBeforeSanityCheck: number;
  minPrice: number;
  maxPrice: number;
  value: number;
}
