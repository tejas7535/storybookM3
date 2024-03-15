import { ProductType } from '../quotation-detail/product-type.enum';
import { MarketValueDriver } from './market-value-driver.interface';
import { SanityCheckMargins } from './sanity-check-margins.interface';
import { TechnicalValueDriver } from './technical-value-driver.interface';

export interface FPricingData {
  gqPositionId: string;
  referencePrice: number;
  productType: ProductType;
  marketValueDrivers: MarketValueDriver[];
  technicalValueDrivers: TechnicalValueDriver;
  sanityCheckMargins: SanityCheckMargins;
}
