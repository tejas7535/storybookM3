export interface QuotationPricingOverview {
  netValue: NumberWarning;
  gpi: NumberWarning;
  gpm: NumberWarning;
  avgGqRating: NumberWarning;
  deviation: NumberWarning;
}

export interface NumberWarning {
  value: number;
  warning?: boolean;
}
