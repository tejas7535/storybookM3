import { MarketValueDriverDisplayItem } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver-display-item.interface';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';

import { ComparableMaterialsRowData } from '../../reducers/transactions/models/f-pricing-comparable-materials.interface';
// eslint-disable-next-line @nx/workspace/gq-scoped-import
import { FPricingState } from '../f-pricing.reducer';

/**
 * contains all related f-pricing data of a position (QuotationDetail)
 */
export interface FPricingPositionData
  extends Omit<
    FPricingState,
    | 'error'
    | 'fPricingDataLoading'
    | 'materialSalesOrgLoading'
    | 'comparableTransactionsLoading'
  > {
  currency: string;
  materialSalesOrg: MaterialSalesOrg;
  materialSalesOrgAvailable: boolean;
  marketValueDriversDisplay: MarketValueDriverDisplayItem[];
  anyMarketValueDriverSelection: boolean;

  comparableTransactionsForDisplay: ComparableMaterialsRowData[];
  comparableTransactionsAvailable: boolean;
}
