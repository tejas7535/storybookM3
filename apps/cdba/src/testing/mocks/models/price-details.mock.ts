import { PriceDetails } from '@cdba/shared/models';

import { REFERENCE_TYPE_MOCK } from './reference-type.mock';

export const PRICE_DETAILS_MOCK = new PriceDetails(
  REFERENCE_TYPE_MOCK.pcmCalculations,
  REFERENCE_TYPE_MOCK.sqvSapLatestMonth,
  REFERENCE_TYPE_MOCK.sqvDate,
  REFERENCE_TYPE_MOCK.gpcLatestYear,
  REFERENCE_TYPE_MOCK.gpcDate,
  REFERENCE_TYPE_MOCK.puUm,
  REFERENCE_TYPE_MOCK.currency,
  REFERENCE_TYPE_MOCK.averagePrices[0]
);
