import { FPricingState } from '@gq/core/store/f-pricing/f-pricing.reducer';
import { ProductType } from '@gq/shared/models';

import { MATERIAL_INFORMATION_MOCK } from '../models';
import { MARKET_VALUE_DRIVERS_MOCK } from '../models/fpricing/market-value-drivers.mock';
import { MARKET_VALUE_DRIVERS_SELECTIONS_MOCK } from '../models/fpricing/market-value-drivers-selections.mock';
import { TECHNICAL_VALUE_DRIVERS_MOCK } from '../models/fpricing/technical-value-drivers.mock';

export const F_PRICING_STATE_MOCK: FPricingState = {
  fPricingDataLoading: false,
  comparableTransactionsLoading: false,
  comparableTransactions: [],
  error: null,
  productType: ProductType.SRB,
  gqPositionId: '1234',
  marketValueDrivers: MARKET_VALUE_DRIVERS_MOCK,
  marketValueDriversSelections: MARKET_VALUE_DRIVERS_SELECTIONS_MOCK,
  referencePrice: 10,
  materialInformation: MATERIAL_INFORMATION_MOCK,
  priceSelected: 14.45,
  technicalValueDrivers: TECHNICAL_VALUE_DRIVERS_MOCK,
  technicalValueDriversToUpdate: [],
};
