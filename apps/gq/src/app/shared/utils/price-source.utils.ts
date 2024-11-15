import { SapConditionType } from '@gq/core/store/reducers/sap-price-details/models';
import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
} from '@gq/shared/models';

export function getSapStandardPriceSource(
  detail: QuotationDetail
): PriceSource {
  switch (detail.leadingSapConditionType) {
    case SapConditionType.ZSEK: {
      return PriceSource.SECTOR_DISCOUNT;
    }
    case SapConditionType.ZIEC: {
      return PriceSource.END_CUSTOMER_DISCOUNT;
    }
    case SapConditionType.ZKI1: {
      return PriceSource.ZKI1;
    }
    default: {
      return PriceSource.SAP_STANDARD;
    }
  }
}

export function getSapPriceSource(
  quotationDetail: QuotationDetail
): PriceSource {
  const sapPriceCondition = quotationDetail.sapPriceCondition;
  if (sapPriceCondition === SapPriceCondition.STANDARD) {
    // When price condition is Standard check for special SAP conditions
    // before update price source to send proper type of SAP_STANDARD
    return getSapStandardPriceSource(quotationDetail);
  }
  if (sapPriceCondition === SapPriceCondition.CAP_PRICE) {
    return PriceSource.CAP_PRICE;
  }

  return PriceSource.SAP_SPECIAL;
}
