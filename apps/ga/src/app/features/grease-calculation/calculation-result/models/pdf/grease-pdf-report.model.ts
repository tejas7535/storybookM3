import { GreaseReportSubordinate } from '../grease-report-subordinate.model';

export interface GreasePdfReportModel {
  reportTitle: string;
  data: GreaseReportSubordinate[];
  legalNote: string;
}
