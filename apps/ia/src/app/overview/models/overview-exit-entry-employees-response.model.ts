import { EmployeeWithAction, RestResponse } from '../../shared/models';

export interface ExitEntryEmployeesResponse extends RestResponse {
  employees: EmployeeWithAction[];
}
