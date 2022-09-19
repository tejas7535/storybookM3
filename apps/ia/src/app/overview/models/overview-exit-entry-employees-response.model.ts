import { EmployeeWithAction, RestResponse } from '../../shared/models';

export interface OverviewExitEntryEmployeesResponse extends RestResponse {
  employees: EmployeeWithAction[];
}
