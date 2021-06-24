import { FluctuationRate } from './fluctuation-rate.model';

export interface FluctuationRatesChartData {
  companyName: string;
  orgUnitName: string;
  fluctuationRates: FluctuationRate[];
}
