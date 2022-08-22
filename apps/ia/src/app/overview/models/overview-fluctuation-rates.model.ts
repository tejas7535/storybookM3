import { Employee, RestResponse } from '../../shared/models';
import { FluctuationRate } from './fluctuation-rate.model';

export class OverviewFluctuationRates extends RestResponse {
  entryEmployees: Employee[];
  exitEmployees: Employee[];
  totalEmployeesCount: number;
  fluctuationRate: FluctuationRate;
  unforcedFluctuationRate: FluctuationRate;
  internalExitCount: number;
  externalExitCount: number;
  externalUnforcedExitCount: number;
  internalEntryCount: number;
  externalEntryCount: number;
}
