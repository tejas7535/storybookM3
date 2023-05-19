export interface QuotationPricingOverview {
  netValue: NumberWarning;
  gpi: NumberWarning;
  gpm: NumberWarning;
  avgGqRating: NumberWarning;
}

export interface NumberWarning {
  value: number;
  warning?: boolean;
}
