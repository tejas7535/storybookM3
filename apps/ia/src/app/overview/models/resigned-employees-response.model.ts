import { RestResponse } from '../../shared/models';
import { ResignedEmployee } from './resigned-employee.model';

export interface ResignedEmployeesResponse extends RestResponse {
  employees: ResignedEmployee[];
  resignedEmployeesCount: number;
}
