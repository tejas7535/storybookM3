import { FPricingState } from '@gq/core/store/f-pricing/f-pricing.reducer';
import { ProductType } from '@gq/shared/models';

import { MATERIAL_INFORMATION_MOCK } from './material-information.mock';
import { SANITY_CHECK_MARGINS_MOCK } from './sanity-check-margins.mock';
import { TECHNICAL_VALUE_DRIVERS_MOCK } from './technical-value-drivers.mock';

export const F_PRICING_STATE_MOCK: FPricingState = {
  fPricingDataLoading: false,
  comparableTransactionsLoading: false,
  error: null,
  materialInformation: MATERIAL_INFORMATION_MOCK,
  gqPositionId: '1243',
  productType: ProductType.CRB,
  referencePrice: 100,
  comparableTransactions: [],
  marketValueDrivers: [],
  marketValueDriversSelections: [],
  technicalValueDrivers: TECHNICAL_VALUE_DRIVERS_MOCK,
  technicalValueDriversToUpdate: [],
  // TODO: remove value when value will be calculated
  technicalValueDriversValueAbsolute: 125.45,
  technicalValueDriversValueRelative: 0.25,
  sanityCheckMargins: SANITY_CHECK_MARGINS_MOCK,
  sanityCheckValue: 155.4,
  // this is the value of either the GqPrice or Manual Price
  priceSelected: null,
};
