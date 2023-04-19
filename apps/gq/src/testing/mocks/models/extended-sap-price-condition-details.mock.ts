import { CalculationType } from '../../../app/core/store/reducers/sap-price-details/models/calculation-type.enum';
import { SapConditionType } from '../../../app/core/store/reducers/sap-price-details/models/sap-condition-type.enum';
import { ExtendedSapPriceConditionDetail } from '../../../app/core/store/reducers/sap-price-details/models/sap-price-condition-detail.model';

export const EXTENDED_SAP_PRICE_DETAIL_MOCK: ExtendedSapPriceConditionDetail = {
  sapConditionType: SapConditionType.ZMIN,
  conditionTypeDescription: 'condition_type_description_mock',
  amount: 1,
  calculationType: CalculationType.ABSOLUT,
  conditionUnit: 'PC',
  conditionValue: 1,
  validTo: new Date(),
  pricingUnit: 1,
  sequenceId: 1,
  quotationItemId: 10,
};
