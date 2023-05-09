import { PriceSource } from '@gq/shared/models';

export class UpdateQuotationDetail {
  gqPositionId: string;
  price?: number;
  priceSource?: PriceSource;
  orderQuantity?: number;
  comment?: string;
}
