export interface FPricingCalculationsRequest {
  referencePrice: number;
  relativeMvdSurcharge: number;
  relativeTvdSurcharge: number;
  sanityCheck: {
    minMargin: number;
    maxMargin: number;
    sqv: number;
    lastCustomerPrice: number;
  };
}
