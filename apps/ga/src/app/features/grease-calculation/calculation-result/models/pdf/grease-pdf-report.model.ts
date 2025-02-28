import { GreaseReportSubordinate } from '../grease-report-subordinate.model';

export interface GreasePdfReportModel {
  reportTitle: string;
  sectionSubTitle: string;
  data: GreaseReportSubordinate[];
  legalNote: string;
  automaticLubrication: boolean;
  versions?: string;
}
