import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';

export interface UpdateFPricingDataRequest {
  marketValueDriverSelections: MarketValueDriverSelection[];
  selectedPrice: number;
}
