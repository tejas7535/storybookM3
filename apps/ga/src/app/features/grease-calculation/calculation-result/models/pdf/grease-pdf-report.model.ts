import { GreaseReportSubordinate } from '../grease-report-subordinate.model';
import { GreaseResult } from '../grease-result.model';

export interface GreasePdfReportModel {
  reportTitle: string;
  sectionSubTitle: string;
  data: GreaseReportSubordinate[];
  results: GreaseResult[];
  legalNote: string;
  automaticLubrication: boolean;
  versions?: string;
}
