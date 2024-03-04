import { ProductType } from '../quotation-detail/product-type.enum';
import { MarketValueDriver } from './market-value-driver.interface';
import { TechnicalValueDriver } from './technical-value-driver.interface';

export interface FPricingData {
  gqPositionId: string;
  referencePrice: number;
  productType: ProductType;
  marketValueDrivers: MarketValueDriver[];
  technicalValueDrivers: TechnicalValueDriver;
}
