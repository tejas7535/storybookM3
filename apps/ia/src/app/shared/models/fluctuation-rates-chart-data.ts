import { FluctuationRate } from './fluctuation-rate';

export interface FluctuationRatesChartData {
  companyName: string;
  orgUnitName: string;
  fluctuationRates: FluctuationRate[];
}
