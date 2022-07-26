import { GreaseReportSubordinate } from './grease-report-subordinate.model';

export interface CompanyInformation {
  url: string;
  company: string;
}

export interface GreaseReport {
  identifier: string;
  programName: string;
  programNameID: string;
  isBeta: boolean;
  method: string;
  methodID: string;
  title: string;
  titleID: string;
  subordinates: GreaseReportSubordinate[];
  companyInformation: CompanyInformation[];
  timeStamp: string;
  programVersion: string;
  transactionFileName: string;
}
