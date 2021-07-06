import { Employee } from './employee.model';
import { FluctuationRate } from './fluctuation-rate.model';

export class OverviewFluctuationRates {
  entryEmployees: Employee[];
  exitEmployees: Employee[];
  fluctuationRate: FluctuationRate;
  unforcedFluctuationRate: FluctuationRate;
}
