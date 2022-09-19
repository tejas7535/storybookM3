import { FluctuationRate } from './fluctuation-rate.model';

export class OverviewFluctuationRates {
  totalEmployeesCount: number;
  fluctuationRate: FluctuationRate;
  unforcedFluctuationRate: FluctuationRate;
  internalExitCount: number;
  externalExitCount: number;
  externalUnforcedExitCount: number;
  internalEntryCount: number;
  externalEntryCount: number;
}
