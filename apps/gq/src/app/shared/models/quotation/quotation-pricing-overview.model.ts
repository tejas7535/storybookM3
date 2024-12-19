export interface QuotationPricingOverview {
  netValue: NumberWarning;
  netValueEur?: number;
  currency?: string;
  gpi: NumberWarning;
  gpm: NumberWarning;
  avgGqRating: NumberWarning;
  deviation: NumberWarning;
}

export interface NumberWarning {
  value: number;
  warning?: boolean;
}
