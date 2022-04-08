import { Subordinate } from './subordinate.model';

export interface CompanyInformation {
  url: string;
  company: string;
}

export interface Report {
  identifier: string;
  programName: string;
  programNameID: string;
  isBeta: boolean;
  method: string;
  methodID: string;
  title: string;
  titleID: string;
  subordinates: Subordinate[];
  companyInformation: CompanyInformation[];
  timeStamp: string;
  programVersion: string;
  transactionFileName: string;
}
