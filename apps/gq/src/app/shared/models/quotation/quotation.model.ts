import { Customer } from '../customer';
import { QuotationDetail } from '../quotation-detail';
import { User } from '../user.model';
import { QuotationStatus } from './quotation-status.enum';

export class Quotation {
  public gqId: number;
  public caseName: string;
  public imported: boolean;
  public reImported: boolean;
  public sapId: string;
  public gqCreated: string;
  public gqCreatedByUser: User;
  public gqLastUpdated: string;
  public gqLastUpdatedByUser: User;
  public sapCreated: string;
  public sapLastUpdated: string;
  public sapCreatedByUser: User;
  public customer: Customer;
  public quotationDetails: QuotationDetail[];
  public currency: string;
  public salesChannel: string;
  public division: string;
  public requestedDelDate: string;
  public validTo: string;
  public calculationInProgress: boolean;
  public sapCallInProgress: boolean;
  public statusTypeOfListedQuotation: keyof typeof QuotationStatus;
}
