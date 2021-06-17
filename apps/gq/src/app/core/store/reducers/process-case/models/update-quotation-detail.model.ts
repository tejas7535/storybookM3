import { PriceSource } from '../../../../../shared/models/quotation-detail';

export class UpdateQuotationDetail {
  gqPositionId: string;
  price?: number;
  priceSource?: PriceSource;
  orderQuantity?: number;
}
