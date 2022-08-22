import { Employee, RestResponse } from '../../shared/models';

export interface ResignedEmployeesResponse extends RestResponse {
  employees: Employee[];
  resignedEmployeesCount: number;
}
