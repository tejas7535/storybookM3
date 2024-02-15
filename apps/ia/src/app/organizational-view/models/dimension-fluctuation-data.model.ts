import { FilterDimension } from '../../shared/models';
import { EmployeeAttritionMeta } from '../../shared/models/employee';
import { OrgChartFluctuationRate } from './org-chart-fluctuation-rate.model';

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
  fluctuationRate: OrgChartFluctuationRate;
  directFluctuationRate: OrgChartFluctuationRate;
  absoluteFluctuation: OrgChartFluctuationRate;
  directAbsoluteFluctuation: OrgChartFluctuationRate;
  attritionMeta: EmployeeAttritionMeta;
}
