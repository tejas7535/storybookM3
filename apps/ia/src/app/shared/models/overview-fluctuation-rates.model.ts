import { Employee } from './employee.model';
import { FluctuationRate } from './fluctuation-rate.model';

export class OverviewFluctuationRates {
  allEmployees: Employee[];
  exitEmployees: Employee[];
  fluctuationRate: FluctuationRate;
  unforcedFluctuationRate: FluctuationRate;
}
