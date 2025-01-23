import { PriceSource } from '@gq/shared/models';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';

export class UpdateQuotationDetail {
  gqPositionId: string;
  price?: number;
  priceSource?: PriceSource;
  orderQuantity?: number;
  comment?: string;
  priceComment?: string;
  targetPrice?: number;
  targetPriceSource?: TargetPriceSource;
}
