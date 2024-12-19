import { FPricingState } from '@gq/core/store/f-pricing/f-pricing.reducer';
import { ProductType } from '@gq/shared/models/quotation-detail/material';

import { F_PRICING_CALCULATIONS_MOCK } from '../models/fpricing/f-pricing-calculations.mock';
import { MARKET_VALUE_DRIVERS_MOCK } from '../models/fpricing/market-value-drivers.mock';
import { MARKET_VALUE_DRIVERS_SELECTIONS_MOCK } from '../models/fpricing/market-value-drivers-selections.mock';
import { SANITY_CHECK_MARGINS_MOCK } from '../models/fpricing/sanity-check-margins.mock';
import { TECHNICAL_VALUE_DRIVERS_MOCK } from '../models/fpricing/technical-value-drivers.mock';

export const F_PRICING_STATE_MOCK: FPricingState = {
  fPricingDataLoading: false,
  comparableTransactionsLoading: false,
  fPricingCalculationsLoading: false,
  materialComparisonLoading: false,
  comparableTransactions: [],
  error: null,
  productType: ProductType.SRB,
  gqPositionId: '1234',
  marketValueDrivers: MARKET_VALUE_DRIVERS_MOCK,
  marketValueDriversSelections: MARKET_VALUE_DRIVERS_SELECTIONS_MOCK,
  sanityCheckMargins: SANITY_CHECK_MARGINS_MOCK,
  referencePrice: 10,
  materialComparisonInformation: null,
  manualPrice: 14.45,
  technicalValueDrivers: TECHNICAL_VALUE_DRIVERS_MOCK,
  technicalValueDriversToUpdate: [],
  calculations: F_PRICING_CALCULATIONS_MOCK,
};
