import { Employee } from '../../shared/models/employee.model';
import { FluctuationRate } from '../../shared/models/fluctuation-rate';

export interface OverviewFluctuationRates {
  employees: Employee[];
  fluctuationRate: FluctuationRate;
  unforcedFluctuationRate: FluctuationRate;
  entries: number;
  exits: number;
}
