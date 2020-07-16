import { PriceDetails } from '../../app/detail/pricing/model/price.details.model';
import { REFRENCE_TYPE_MOCK } from './reference-type.mock';

export const PRICE_DETAILS_MOCK = new PriceDetails(
  REFRENCE_TYPE_MOCK.pcmSqv,
  REFRENCE_TYPE_MOCK.pcmCalculationDate,
  REFRENCE_TYPE_MOCK.sqvSapLatestMonth,
  REFRENCE_TYPE_MOCK.sqvDate,
  REFRENCE_TYPE_MOCK.gpcLatestYear,
  REFRENCE_TYPE_MOCK.gpcDate,
  REFRENCE_TYPE_MOCK.puUm,
  REFRENCE_TYPE_MOCK.currency
);
