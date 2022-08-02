import { Employee } from '../../shared/models';

export interface JobProfile {
  positionDescription: string;
  employees: Employee[];
  leavers: Employee[];
}
