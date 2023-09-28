import { FilterDimension } from '../../shared/models';
import { EmployeeAttritionMeta } from '../../shared/models/employee';

export interface DimensionFluctuationData {
  id: string;
  parentId: string;
  dimension: string;
  dimensionLongName: string;
  dimensionKey: string;
  filterDimension: FilterDimension;
  managerOfOrgUnit: string;
  directEmployees: number;
  totalEmployees: number;
  directAttrition: number;
  totalAttrition: number;
  attritionMeta: EmployeeAttritionMeta;
}
