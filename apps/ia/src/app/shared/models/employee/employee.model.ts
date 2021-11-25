import { Position } from '../position.model';
import { EmployeeAttritionMeta } from './employee-attrition-meta.model';

export interface Employee extends Position {
  employeeId: string;
  employeeName: string;
  jobFamily: string;
  jobFamilyDescription: string;
  age: number;
  tenureInYears: number;
  gender: string;
  nationality: string;
  foreigner: string;
  organizationalLevel: string;
  parentEmployeeId: string;
  exitDate: string;
  entryDate: string;
  internalEntryDate: string;
  internalExitDate: string;
  reasonForLeaving: string;
  regrettedLoss: string;
  level: number;
  directSubordinates: number;
  totalSubordinates: number;
  directAttrition: number;
  totalAttrition: number;
  attritionMeta: EmployeeAttritionMeta;
  directLeafChildren: Employee[];
}
