import { Employee } from './employee.model';
import { FluctuationRate } from './fluctuation-rate';

export class OverviewFluctuationRates {
  allEmployees: Employee[];
  exitEmployees: Employee[];
  fluctuationRate: FluctuationRate;
  unforcedFluctuationRate: FluctuationRate;
  entries: number;
  exits: number;
}
