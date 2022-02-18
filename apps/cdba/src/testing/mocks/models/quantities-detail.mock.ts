import { QuantitiesDetails } from '@cdba/shared/models';

import { REFERENCE_TYPE_MOCK } from './reference-type.mock';

export const QUANTITIES_DETAILS_MOCK = new QuantitiesDetails(
  REFERENCE_TYPE_MOCK.pcmCalculations,
  REFERENCE_TYPE_MOCK.netSales,
  REFERENCE_TYPE_MOCK.budgetQuantityCurrentYear,
  REFERENCE_TYPE_MOCK.budgetQuantitySoco,
  REFERENCE_TYPE_MOCK.actualQuantities,
  REFERENCE_TYPE_MOCK.plannedQuantities,
  REFERENCE_TYPE_MOCK.currency
);
