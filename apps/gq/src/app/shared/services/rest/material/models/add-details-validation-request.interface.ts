import { CustomerId } from '@gq/shared/models/customer/customer-ids.model';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';

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
  targetPrice?: number;
  targetPriceSource?: TargetPriceSource;
}
