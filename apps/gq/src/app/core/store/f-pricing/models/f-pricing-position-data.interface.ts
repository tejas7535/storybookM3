import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';

// eslint-disable-next-line @nx/workspace/gq-scoped-import
import { FPricingState } from '../f-pricing.reducer';
/**
 * contains all related f-pricing data of a position (QuotationDetail)
 */
export interface FPricingPositionData
  extends Omit<
    FPricingState,
    'error' | 'fPricingDataLoading' | 'materialSalesOrgLoading'
  > {
  currency: string;
  materialSalesOrg: MaterialSalesOrg;
  materialSalesOrgAvailable: boolean;
}
