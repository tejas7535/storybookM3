import { RestResponse } from '../rest-response.model';

export interface EmployeeAttritionMeta extends RestResponse {
  title: string;
  employeesLost: number;
  remainingFluctuation: number;
  forcedFluctuation: number;
  unforcedFluctuation: number;
  resignationsReceived: number;
  employeesAdded: number;
  openPositions: number;
}
