import { QuantitiesDetails } from '../../app/detail/detail-tab/quantities/model/quantities.model';
import { REFRENCE_TYPE_MOCK } from './reference-type.mock';

export const QUANTITIES_DETAILS_MOCK = new QuantitiesDetails(
  REFRENCE_TYPE_MOCK.pcmQuantity,
  REFRENCE_TYPE_MOCK.netSales,
  REFRENCE_TYPE_MOCK.budgetQuantityCurrentYear,
  REFRENCE_TYPE_MOCK.budgetQuantitySoco,
  REFRENCE_TYPE_MOCK.actualQuantities,
  REFRENCE_TYPE_MOCK.plannedQuantities,
  REFRENCE_TYPE_MOCK.currency
);
