import { Customer } from '@gq/shared/models/customer';
export class GeneralInformation {
  approvalLevel: string;
  validityFrom: string;
  validityTo: string;
  duration: string;
  project: string;
  projectInformation: string;
  customer: Customer;
  requestedQuotationDate: string;
  comment: string;
}
