import { ProductionDetails } from '../../app/detail/detail-tab/production/model/production.details.model';
import { REFERENCE_TYPE_MOCK } from './reference-type.mock';

export const PRODUCTION_DETAILS_MOCK = new ProductionDetails(
  REFERENCE_TYPE_MOCK.procurementType,
  REFERENCE_TYPE_MOCK.plant,
  REFERENCE_TYPE_MOCK.saleableItem,
  '', // TODO add productionTechnology and manufacturingProcess
  '',
  REFERENCE_TYPE_MOCK.specialProcurement,
  REFERENCE_TYPE_MOCK.purchasePriceValidFrom,
  REFERENCE_TYPE_MOCK.purchasePriceValidUntil,
  REFERENCE_TYPE_MOCK.supplier
);
