import { Duration } from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import { OfferType } from '@gq/shared/models/offer-type.interface';
export class GeneralInformation {
  approvalLevel: string;
  validityFrom: string;
  validityTo: string;
  duration: Duration;
  projectInformation: string;
  customer: Customer;
  requestedQuotationDate: string;
  comment: string;
  offerType: OfferType;
}
