import { CustomerId } from '@gq/shared/models/customer/customer-ids.model';

export interface AddDetailsValidationRequest {
  customerId: CustomerId;
  details: ValidationDetail[];
}

export interface ValidationDetail {
  id: number;
  data: ValidationDetailData;
}

export interface ValidationDetailData {
  materialNumber15: string;
  quantity: number;
  customerMaterial?: string;
}
