import { SapConditionType } from '@gq/core/store/reducers/sap-price-details/models';
import { PriceSource, QuotationDetail } from '@gq/shared/models';
import { getSapStandardPriceSource } from '@gq/shared/utils/price-source.utils';

describe('PriceSourceUtils', () => {
  describe('getSapStandardPriceSource', () => {
    test('should return SAP_STANDARD as a default price source', () => {
      const detail = {
        leadingSapConditionType: null,
      } as QuotationDetail;

      const result = getSapStandardPriceSource(detail);
      expect(result).toEqual(PriceSource.SAP_STANDARD);
    });

    test('should return SECTOR_DISCOUNT when leading sap condition type is ZSEK', () => {
      const detail = {
        leadingSapConditionType: SapConditionType.ZSEK,
      } as QuotationDetail;

      const result = getSapStandardPriceSource(detail);
      expect(result).toEqual(PriceSource.SECTOR_DISCOUNT);
    });
  });
});
