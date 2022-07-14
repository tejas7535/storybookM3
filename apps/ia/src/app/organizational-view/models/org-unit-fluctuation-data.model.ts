import { Employee, EmployeeAttritionMeta } from '../../shared/models/employee';

export interface OrgUnitFluctuationData {
  id: string;
  parentId: string;
  orgUnit: string;
  orgUnitKey: string;
  managerOfOrgUnit: string;
  directEmployees: number;
  totalEmployees: number;
  directAttrition: number;
  totalAttrition: number;
  attritionMeta: EmployeeAttritionMeta;
  directLeafChildren: Employee[];
}
