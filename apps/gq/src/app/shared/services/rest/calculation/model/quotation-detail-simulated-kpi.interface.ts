export interface KpiValues {
  [key: string]: number;
}

export interface QuotationDetailSimulatedKpi {
  gqPositionId: string;
  priceSource: string;
  price: number;
  simulatedKpis: KpiValues;
}
