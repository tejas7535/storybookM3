import { TargetPriceSource } from '../quotation/target-price-source.enum';

export class MaterialQuantities {
  quotationItemId: number;
  materialId: string;
  quantity: number;
  customerMaterial?: string;
  targetPrice?: number;
  targetPriceSource?: TargetPriceSource;
}
