import { Employee, EmployeeAttritionMeta } from '../../shared/models/employee';

export interface DimensionFluctuationData {
  id: string;
  parentId: string;
  dimension: string;
  dimensionKey: string;
  managerOfOrgUnit: string;
  directEmployees: number;
  totalEmployees: number;
  directAttrition: number;
  totalAttrition: number;
  attritionMeta: EmployeeAttritionMeta;
  directLeafChildren: Employee[];
}
