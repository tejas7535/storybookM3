import { Employee } from './employee.model';
import { FluctuationRate } from './fluctuation-rate';

export class OverviewFluctuationRates {
  employees: Employee[];
  fluctuationRate: FluctuationRate;
  unforcedFluctuationRate: FluctuationRate;
  entries: number;
  exits: number;
}
