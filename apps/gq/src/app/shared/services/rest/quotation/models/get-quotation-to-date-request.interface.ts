import { CustomerId } from '@gq/shared/models';

export interface GetQuotationToDateRequest {
  customer: CustomerId;
  inputDate: string;
}
