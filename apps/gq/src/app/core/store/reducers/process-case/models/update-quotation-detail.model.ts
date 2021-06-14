import { PriceSource } from '../../../../../shared/models/quotation-detail';

export class UpdateQuotationDetail {
  gqPositionId: string;
  addedToOffer?: boolean;
  price?: number;
  priceSource?: PriceSource;
  orderQuantity?: number;
}
