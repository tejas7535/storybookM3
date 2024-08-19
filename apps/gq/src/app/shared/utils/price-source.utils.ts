import { SapConditionType } from '@gq/core/store/reducers/sap-price-details/models';
import { PriceSource, QuotationDetail } from '@gq/shared/models';

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
    default: {
      return PriceSource.SAP_STANDARD;
    }
  }
}
