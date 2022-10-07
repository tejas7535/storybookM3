import { CalculationType } from '../../../app/core/store/reducers/sap-price-details/models/calculation-type.enum';
import { SapConditionType } from '../../../app/core/store/reducers/sap-price-details/models/sap-condition-type.enum';
import {
  ExtendedSapPriceConditionDetail,
  SapPriceConditionDetail,
} from '../../../app/core/store/reducers/sap-price-details/models/sap-price-condition-detail.model';

export const SAP_PRICE_DETAIL_ZMIN_MOCK: SapPriceConditionDetail = {
  sapConditionType: SapConditionType.ZMIN,
  conditionTypeDescription: 'condition_type_description_mock',
  amount: 1,
  calculationType: CalculationType.ABSOLUT,
  conditionUnit: 'PC',
  conditionValue: 1,
  validTo: new Date(),
  pricingUnit: 1,
  sequenceId: 1,
};
export const SAP_PRICE_DETAIL_ZRTU_MOCK: SapPriceConditionDetail = {
  sapConditionType: SapConditionType.ZRTU,
  conditionTypeDescription: 'condition_type_description_mock',
  amount: 1,
  calculationType: CalculationType.ABSOLUT,
  conditionUnit: 'PC',
  conditionValue: 1,
  validTo: new Date(),
  pricingUnit: 1,
  sequenceId: 1,
};
export const SAP_PRICE_DETAIL_ZEVO_MOCK: SapPriceConditionDetail = {
  sapConditionType: SapConditionType.ZEVO,
  conditionTypeDescription: 'condition_type_description_mock',
  amount: 0.5,
  calculationType: CalculationType.PERCENTAGE,
  conditionUnit: 'PC',
  conditionValue: 1,
  validTo: new Date(),
  pricingUnit: 1,
  sequenceId: 2,
};
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
