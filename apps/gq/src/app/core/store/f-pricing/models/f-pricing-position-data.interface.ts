import { MarketValueDriverDisplayItem } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver-display-item.interface';
import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';

import { ComparableMaterialsRowData } from '../../reducers/transactions/models/f-pricing-comparable-materials.interface';
// eslint-disable-next-line @nx/workspace/gq-scoped-import
import { FPricingState } from '../f-pricing.reducer';
import { MarketValueDriverWarningLevel } from './market-value-driver-warning-level.enum';

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
  comparableTransactionsForDisplay: ComparableMaterialsRowData[];
  comparableTransactionsAvailable: boolean;
  marketValueDriversDisplay: MarketValueDriverDisplayItem[];
  anyMarketValueDriverSelected: boolean;
  allMarketValueDriverSelected: boolean;
  marketValueDriverWarningLevel: MarketValueDriverWarningLevel;
  technicalValueDriversForDisplay: TableItem[];
  sanityChecksForDisplay: TableItem[];
}
