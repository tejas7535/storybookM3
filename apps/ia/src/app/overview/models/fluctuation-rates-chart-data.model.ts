import { FluctuationRate } from './fluctuation-rate.model';

export interface FluctuationRatesChartData {
  fluctuationRates: FluctuationRate[];
  unforcedFluctuationRates: FluctuationRate[];
}
