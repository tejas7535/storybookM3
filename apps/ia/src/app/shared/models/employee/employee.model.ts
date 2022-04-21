import { Position } from '../position.model';
import { EmployeeAction } from './employee-action.model';
import { EmployeeAttritionMeta } from './employee-attrition-meta.model';

export interface Employee extends Position {
  employeeId: string;
  reportDate: string;
  employeeName: string;
  parentEmployeeId: string;
  exitDate: string;
  entryDate: string;
  reasonForLeaving: string;
  level: number;
  directSubordinates: number;
  totalSubordinates: number;
  directAttrition: number;
  totalAttrition: number;
  attritionMeta: EmployeeAttritionMeta;
  directLeafChildren: Employee[];
  actions: EmployeeAction[];
}
