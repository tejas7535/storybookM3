import { QuotationDetail } from '@gq/shared/models/quotation-detail';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_IDENTIFIER_MOCK,
} from '../../../../testing/mocks';
import { SapConditionType, SapPriceConditionDetail } from '../reducers/models';
import * as processCaseUtils from './active-case.utils';

describe('ActiveCaseUtils', () => {
  describe('addCalculationForDetails', () => {
    test('should call addCalculationForDetail', () => {
      const details = [QUOTATION_DETAIL_MOCK];
      jest.spyOn(processCaseUtils, 'addCalculationsForDetail');

      processCaseUtils.addCalculationsForDetails(details);
      expect(processCaseUtils.addCalculationsForDetail).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('addCalculationForDetail', () => {
    test('should set netValueBySapPriceUnit', () => {
      const detail = {
        price: 100,
        orderQuantity: 10,
        sapPriceUnit: 100,
      } as QuotationDetail;

      processCaseUtils.addCalculationsForDetail(detail);
      expect(detail.netValue).toEqual(10);
    });

    test('should set netValue by materialPriceUnit', () => {
      const detail = {
        price: 100,
        orderQuantity: 10,
        material: { priceUnit: 100 },
      } as QuotationDetail;

      processCaseUtils.addCalculationsForDetail(detail);
      expect(detail.netValue).toEqual(10);
    });
  });

  describe('calculateSapPriceValues', () => {
    test('should set msp & rsp', () => {
      const detail = {
        filteredSapConditionDetails: [
          {
            sapConditionType: SapConditionType.ZMIN,
            amount: 100,
          } as SapPriceConditionDetail,
          {
            sapConditionType: SapConditionType.ZRTU,
            amount: 15.001,
          } as SapPriceConditionDetail,
        ],
      } as QuotationDetail;

      processCaseUtils.calculateSapPriceValues(detail);
      expect(detail.msp).toEqual(85);
      expect(detail.rsp).toEqual(100);
    });

    test('should set msp & rsp for existing sapPriceUnit', () => {
      const detail = {
        sapPriceUnit: 100,
        filteredSapConditionDetails: [
          {
            sapConditionType: SapConditionType.ZMIN,
            amount: 100,
            pricingUnit: 1,
          } as SapPriceConditionDetail,
          {
            sapConditionType: SapConditionType.ZRTU,
            amount: 15,
          } as SapPriceConditionDetail,
        ],
      } as QuotationDetail;

      processCaseUtils.calculateSapPriceValues(detail);
      expect(detail.msp).toEqual(8500);
      expect(detail.rsp).toEqual(10_000);
    });

    test('should not set msp & rsp when missing conditions', () => {
      const detail = {
        sapPriceUnit: 100,
        filteredSapConditionDetails: [
          {
            sapConditionType: SapConditionType.ZRTU,
            amount: 15,
          } as SapPriceConditionDetail,
        ],
      } as QuotationDetail;

      processCaseUtils.calculateSapPriceValues(detail);
      expect(detail.msp).toEqual(undefined);
      expect(detail.rsp).toEqual(undefined);
    });
  });

  describe('calculateMsp', () => {
    test('should return msp', () => {
      const result = processCaseUtils.calculateMsp(100, 15);

      expect(result).toEqual(85);
    });
  });

  describe('mapQueryParamsToIdentifier', () => {
    let queryParams;

    test('should return undefined, if mandatory params are missing', () => {
      queryParams = {};

      expect(
        processCaseUtils.mapQueryParamsToIdentifier(queryParams)
      ).toBeUndefined();
    });

    test('should return QuotationIdentifier', () => {
      queryParams = {
        quotation_number: QUOTATION_IDENTIFIER_MOCK.gqId,
        customer_number: QUOTATION_IDENTIFIER_MOCK.customerNumber,
        sales_org: QUOTATION_IDENTIFIER_MOCK.salesOrg,
      };

      expect(processCaseUtils.mapQueryParamsToIdentifier(queryParams)).toEqual(
        QUOTATION_IDENTIFIER_MOCK
      );
    });
  });

  describe('mapQuotationIdentifierToQueryParamsString', () => {
    test('should QuotationIdentifier to query params string', () => {
      const gqId = 999;
      const customerNumber = '20577';
      const salesOrg = '7895';

      const quotationIdentifier = {
        gqId,
        customerNumber,
        salesOrg,
      };

      expect(
        processCaseUtils.mapQuotationIdentifierToQueryParamsString(
          quotationIdentifier
        )
      ).toBe(
        `quotation_number=${gqId}&customer_number=${customerNumber}&sales_org=${salesOrg}`
      );
    });
  });

  describe('checkEqualityOfIdentifier', () => {
    let fromRoute;
    let current;
    let result;

    beforeEach(() => {
      fromRoute = undefined;
      current = undefined;
      result = undefined;
    });

    test('should return false, if current value is undefined', () => {
      fromRoute = QUOTATION_IDENTIFIER_MOCK;
      current = undefined;

      result = processCaseUtils.checkEqualityOfIdentifier(fromRoute, current);

      expect(result).toBeFalsy();
    });

    test('should return false, if one value differs', () => {
      fromRoute = QUOTATION_IDENTIFIER_MOCK;
      current = {
        ...QUOTATION_IDENTIFIER_MOCK,
        gqId: 62_456,
      };

      result = processCaseUtils.checkEqualityOfIdentifier(fromRoute, current);

      expect(result).toBeFalsy();
    });
    test('should return true, if all values are the same', () => {
      fromRoute = QUOTATION_IDENTIFIER_MOCK;
      current = fromRoute;

      result = processCaseUtils.checkEqualityOfIdentifier(fromRoute, current);

      expect(result).toBeTruthy();
    });
  });
});
