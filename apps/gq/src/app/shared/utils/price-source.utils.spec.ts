import { SapConditionType } from '@gq/core/store/reducers/sap-price-details/models';
import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
} from '@gq/shared/models';
import {
  getSapPriceSource,
  getSapStandardPriceSource,
} from '@gq/shared/utils/price-source.utils';

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

  describe('getSapPriceSource', () => {
    test('should return SAP_STANDARD when sap price condition is STANDARD', () => {
      const quotationDetail = {
        sapPriceCondition: SapPriceCondition.STANDARD,
      } as unknown as QuotationDetail;

      const result = getSapPriceSource(quotationDetail);
      expect(result).toEqual(PriceSource.SAP_STANDARD);
    });

    test('should return CAP_PRICE when sap price condition is CAP_PRICE', () => {
      const quotationDetail = {
        sapPriceCondition: SapPriceCondition.CAP_PRICE,
      } as unknown as QuotationDetail;

      const result = getSapPriceSource(quotationDetail);
      expect(result).toEqual(PriceSource.CAP_PRICE);
    });

    test('should return SAP_SPECIAL when sap price condition is not STANDARD or CAP_PRICE', () => {
      const quotationDetail = {
        sapPriceCondition: 'SPECIAL',
      } as unknown as QuotationDetail;

      const result = getSapPriceSource(quotationDetail);
      expect(result).toEqual(PriceSource.SAP_SPECIAL);
    });
  });
});
