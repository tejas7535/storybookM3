import { EmployeeAttritionMeta } from './employee-attrition-meta.model';

export interface Employee {
  employeeId: string;
  employeeName: string;
  subRegion: string;
  hrLocation: string;
  country: string;
  orgUnit: string;
  businessUnit: string;
  division: string;
  jobFamily: string;
  jobFamilyDescription: string;
  positionDescription: string;
  age: number;
  tenureInYears: number;
  gender: string;
  nationality: string;
  foreigner: string;
  organizationalLevel: string;
  parentEmployeeId: string;
  fte: number;
  headcount: number;
  fulltimeParttime: string;
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
