import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';

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

  describe('addCalculationsForDetail', () => {
    // eslint-disable-next-line unicorn/no-null
    ['asd', undefined, null].forEach((val) => {
      test(`should not round invalid value ${val}`, () => {
        const spy = jest.spyOn(pricingUtils, 'roundValue');
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          price: val as any,
          recommendedPrice: val as any,
          lastCustomerPrice: val as any,
          strategicPrice: val as any,
          targetPrice: val as any,
          gpc: val as any,
          sqv: val as any,
        };

        processCaseUtils.addCalculationsForDetail(detail);

        expect(spy).not.toHaveBeenCalled();
      });
    });

    [
      { value: 20, roundedValue: 20 },
      { value: 20.01, roundedValue: 20.01 },
      { value: 20.012, roundedValue: 20.01 },
      { value: 20.018, roundedValue: 20.02 },
      { value: 20.016, roundedValue: 20.02 },
      { value: 20.024, roundedValue: 20.02 },
      { value: 20.0149, roundedValue: 20.01 },
      { value: 20.0144, roundedValue: 20.01 },
      { value: 20.014_56, roundedValue: 20.01 },
      { value: 20.014_423, roundedValue: 20.01 },
    ].forEach((testCase) => {
      test(`should correctly round all price values of ${testCase.value} to ${testCase.roundedValue}`, () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          price: testCase.value,
          recommendedPrice: testCase.value,
          lastCustomerPrice: testCase.value,
          strategicPrice: testCase.value,
          targetPrice: testCase.value,
          gpc: testCase.value,
          sqv: testCase.value,
        };

        processCaseUtils.addCalculationsForDetail(detail);

        expect(detail.price).toEqual(testCase.roundedValue);
        expect(detail.recommendedPrice).toEqual(testCase.roundedValue);
        expect(detail.lastCustomerPrice).toEqual(testCase.roundedValue);
        expect(detail.strategicPrice).toEqual(testCase.roundedValue);
        expect(detail.targetPrice).toEqual(testCase.roundedValue);
        expect(detail.gpc).toEqual(testCase.roundedValue);
        expect(detail.sqv).toEqual(testCase.roundedValue);
      });
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

  describe('calculatePriceUnitValues', () => {
    test('should convert sapPrice', () => {
      const detail = QUOTATION_DETAIL_MOCK;
      detail.sapPrice = 500;
      detail.sapPriceUnit = 100;
      detail.material.priceUnit = 10;

      processCaseUtils.calculatePriceUnitValues(detail);

      expect(detail.sapPrice).toEqual(5000);
    });

    test('should convert sapGrossPrice', () => {
      const detail = QUOTATION_DETAIL_MOCK;
      detail.sapGrossPrice = 500;
      detail.sapPriceUnit = 100;
      detail.material.priceUnit = 10;

      processCaseUtils.calculatePriceUnitValues(detail);

      expect(detail.sapGrossPrice).toEqual(5000);
    });

    test('should convert relocationCosts', () => {
      const detail = QUOTATION_DETAIL_MOCK;
      detail.relocationCost = 500;
      detail.sapPriceUnit = 100;
      detail.material.priceUnit = 10;

      processCaseUtils.calculatePriceUnitValues(detail);

      expect(detail.relocationCost).toEqual(50_000);
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
