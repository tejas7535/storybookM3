import { ProductionDetails } from '../../app/detail/detail-tab/production/model/production.details.model';
import { REFRENCE_TYPE_MOCK } from './reference-type.mock';

export const PRODUCTION_DETAILS_MOCK = new ProductionDetails(
  REFRENCE_TYPE_MOCK.procurementType,
  REFRENCE_TYPE_MOCK.plant,
  REFRENCE_TYPE_MOCK.saleableItem,
  '', // TODO add productionTechnology and manufacturingProcess
  '',
  REFRENCE_TYPE_MOCK.specialProcurement,
  REFRENCE_TYPE_MOCK.purchasePriceValidFrom,
  REFRENCE_TYPE_MOCK.purchasePriceValidUntil,
  REFRENCE_TYPE_MOCK.supplier
);
