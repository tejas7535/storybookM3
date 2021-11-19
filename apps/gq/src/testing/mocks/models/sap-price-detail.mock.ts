import { CalculationType } from '../../../app/core/store/reducers/sap-price-details/models/calculation-type.enum';
import { SapPriceDetail } from '../../../app/core/store/reducers/sap-price-details/models/sap-price-detail.model';

export const SAP_PRICE_DETAIL_MOCK: SapPriceDetail = {
  sapConditionType: 'condition_type_mock',
  conditionTypeDescription: 'condition_type_description_mock',
  amount: 1,
  calculationType: CalculationType.ABSOLUT,
  conditionUnit: 'PC',
  conditionValue: 1,
  validTo: new Date(),
  pricingUnit: 1,
  sequenceId: 1,
};
