import { PriceSource } from './price-source.enum';

export class UpdateQuotationDetail {
  gqPositionId: string;
  addedToOffer?: boolean;
  price?: number;
  priceSource?: PriceSource;
}
