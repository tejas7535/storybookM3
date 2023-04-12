import { CustomerId } from '../../../../models/customer';

export interface MaterialValidationRequest {
  customerId: CustomerId;
  materialNumbers: string[];
}
