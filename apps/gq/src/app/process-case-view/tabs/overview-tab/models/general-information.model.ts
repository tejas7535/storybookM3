import { Duration } from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
export class GeneralInformation {
  approvalLevel: string;
  validityFrom: string;
  validityTo: string;
  duration: Duration;
  projectInformation: string;
  customer: Customer;
  requestedQuotationDate: string;
  comment: string;
}
