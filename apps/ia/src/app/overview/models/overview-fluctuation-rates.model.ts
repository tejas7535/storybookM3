import { Employee } from '../../shared/models';
import { FluctuationRate } from './fluctuation-rate.model';

export class OverviewFluctuationRates {
  entryEmployees: Employee[];
  exitEmployees: Employee[];
  fluctuationRate: FluctuationRate;
  unforcedFluctuationRate: FluctuationRate;
}
