import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_DETAILS_MOCK,
} from '../../../testing/mocks';
import { ColumnFields } from '../ag-grid/constants/column-fields.enum';
import { KpiValue } from '../components/modal/editing-modal/models/kpi-value.model';
import { StatusBarProperties } from '../models';
import { QuotationDetail } from '../models/quotation-detail';
import * as pricingUtils from './pricing.utils';

describe('PricingUtils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('roundValue', () => {
    test('should use rounding factor 100 if price unit < 1', () => {
      const result = pricingUtils.roundValue(2.5555, 0.9);

      expect(result).toEqual(2.56);
    });
    test('should use rounding factor price unit times 100 if price unit >= 1', () => {
      const result = pricingUtils.roundValue(2.5555, 2);

      expect(result).toEqual(2.555);
    });
  });

  describe('calculateNetValue', () => {
    test('should return net value for priceUnit 1', () => {
      const detail = {
        price: 1,
        orderQuantity: 100,
        leadingPriceUnit: 1,
      } as QuotationDetail;

      const result = pricingUtils.calculateNetValue(detail.price, detail);

      expect(result).toEqual(100);
    });

    test('should return net value for price Unit 100', () => {
      const detail = {
        price: 100,
        orderQuantity: 10,
        leadingPriceUnit: 100,
      } as QuotationDetail;

      const result = pricingUtils.calculateNetValue(detail.price, detail);

      expect(result).toEqual(10);
    });
  });

  describe('calculatePriceDiff should', () => {
    test.each([
      { lastCustomerPrice: 110, price: 120, expected: 9.09 },
      { lastCustomerPrice: 100, price: 50, expected: -50 },
      { lastCustomerPrice: 137, price: 137, expected: 0 },
      { lastCustomerPrice: 0.237, price: 0.237, expected: 0 },
    ])('calculate diff in %', ({ lastCustomerPrice, price, expected }) => {
      const result = pricingUtils.calculatePriceDiff(lastCustomerPrice, price);

      expect(result).toEqual(expected);
    });

    test('should return 0 if last customer price is undefined', () => {
      expect(pricingUtils.calculatePriceDiff(undefined, 250)).toBe(0);
    });
  });

  describe('multiplyAndRoundValues', () => {
    test('should return multiplied rounded value', () => {
      const result = pricingUtils.multiplyAndRoundValues(1.111_11, 100);
      expect(result).toEqual(111.11);
    });
  });

  describe('calculateMargin', () => {
    test('should return margin if cost value is greater than 0', () => {
      const price = 25;
      const margin = 20;

      const result = pricingUtils.calculateMargin(price, margin);

      expect(result).toEqual(20);
    });

    test('should return undefined if cost value is 0', () => {
      const price = 25;
      const costValue = 0;

      const result = pricingUtils.calculateMargin(price, costValue);

      expect(result).toBeUndefined();
    });

    test('should return undefined if cost value is undefined', () => {
      const price = 25;
      const costValue = undefined as any;

      const result = pricingUtils.calculateMargin(price, costValue);

      expect(result).toBeUndefined();
    });

    test('should return margin if price value is greater than 0', () => {
      const price = 25;
      const margin = 20;

      const result = pricingUtils.calculateMargin(price, margin);

      expect(result).toEqual(20);
    });

    test('should return undefined if price value is 0', () => {
      const price = 0;
      const costValue = 20;

      const result = pricingUtils.calculateMargin(price, costValue);

      expect(result).toBeUndefined();
    });

    test('should return undefined if price value is undefined', () => {
      const price = undefined as any;
      const costValue = 20;

      const result = pricingUtils.calculateMargin(price, costValue);

      expect(result).toBeUndefined();
    });
  });

  describe('calculateStatusBarValues should', () => {
    test('return calculatedValues', () => {
      const details = [
        {
          ...QUOTATION_DETAIL_MOCK,
          rfqData: null,
          gpmRfq: null,
        } as QuotationDetail,
      ];

      const result = pricingUtils.calculateStatusBarValues(details);

      expect(result).toEqual(
        new StatusBarProperties(
          QUOTATION_DETAIL_MOCK.netValue,
          QUOTATION_DETAIL_MOCK.gpi,
          QUOTATION_DETAIL_MOCK.gpm,
          QUOTATION_DETAIL_MOCK.priceDiff,
          details.length
        )
      );
    });

    test('return calculatedValues, when RFQ available this one is used', () => {
      const details = [QUOTATION_DETAIL_MOCK];

      const result = pricingUtils.calculateStatusBarValues(details);

      expect(result).toEqual(
        new StatusBarProperties(
          QUOTATION_DETAIL_MOCK.netValue,
          QUOTATION_DETAIL_MOCK.gpi,
          QUOTATION_DETAIL_MOCK.gpmRfq,
          QUOTATION_DETAIL_MOCK.priceDiff,
          details.length
        )
      );
    });
    test('only use max quantity to calculate StatusBarCalculation, if same materialNumber15 appear', () => {
      const result = pricingUtils.calculateStatusBarValues(
        QUOTATION_DETAILS_MOCK
      );
      expect(result).toEqual(
        new StatusBarProperties(2020.4, 24.74, 0.99, 0.2, 3)
      );
    });
  });

  describe('keepMaxQuantityIfDuplicate should', () => {
    test('only use max quantity to calculate StatusBarCalculation, if same materialNumber15 appear', () => {
      const result = pricingUtils.keepMaxQuantityIfDuplicate(
        QUOTATION_DETAILS_MOCK
      );

      expect(result.length).toEqual(2);
    });
  });

  describe('roundToTwoDecimals should round to', () => {
    test('two decimals', () => {
      const result = pricingUtils.roundToTwoDecimals(1.2222);
      expect(result).toEqual(1.22);
    });
    test('two decimals for edge cases', () => {
      const result = pricingUtils.roundToTwoDecimals(37.995);
      expect(result).toEqual(38);
    });
    test('undefined', () => {
      const result = pricingUtils.roundToTwoDecimals(undefined as any);
      expect(result).toEqual(undefined);
    });
    test('undefined when input is "NaN"', () => {
      const result = pricingUtils.roundToTwoDecimals('NaN' as any);
      expect(result).toEqual(undefined);
    });
  });

  describe('getManualPriceByMarginAndCost', () => {
    test('should return manualPrice', () => {
      const manualPrice = pricingUtils.getManualPriceByMarginAndCost(100, 20);

      expect(manualPrice).toEqual(125);
    });
  });

  describe('getManualPriceByDiscount', () => {
    test('should return manualPrice', () => {
      const manualPrice = pricingUtils.getManualPriceByDiscount(100, 20);

      expect(manualPrice).toEqual(80);
    });
  });

  describe('calculateDiscount', () => {
    test('should return discount', () => {
      const result = pricingUtils.calculateDiscount(100, 200);

      expect(result).toEqual(50);
    });
  });

  describe('roundPercentageToTwoDecimals', () => {
    test('should round to two decimals', () => {
      const result = pricingUtils.roundPercentageToTwoDecimals(0.5555);
      expect(result).toEqual(55.55);
    });
  });

  describe('calculateAffectedKPIs', () => {
    afterEach(() => {
      jest.spyOn(pricingUtils, 'multiplyAndRoundValues').mockReset();
      jest.spyOn(pricingUtils, 'calculateMargin').mockReset();
      jest.spyOn(pricingUtils, 'calculateDiscount').mockReset();
      jest.spyOn(pricingUtils, 'getManualPriceByMarginAndCost').mockReset();
      jest.spyOn(pricingUtils, 'getManualPriceByDiscount').mockReset();
    });
    test('should return empty array for quantity', () => {
      const result = pricingUtils.calculateAffectedKPIs(
        1,
        ColumnFields.ORDER_QUANTITY,
        QUOTATION_DETAIL_MOCK
      );
      expect(result).toEqual([]);
    });
    test('should return kpis for price', () => {
      jest.spyOn(pricingUtils, 'multiplyAndRoundValues').mockReturnValue(1);
      jest.spyOn(pricingUtils, 'calculateMargin').mockReturnValue(2);
      jest.spyOn(pricingUtils, 'calculateDiscount').mockReturnValue(3);
      const result = pricingUtils.calculateAffectedKPIs(
        1,
        ColumnFields.PRICE,
        QUOTATION_DETAIL_MOCK
      );

      expect(pricingUtils.multiplyAndRoundValues).toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.PRICE, value: 1 },
        { key: ColumnFields.GPI, value: 2 },
        { key: ColumnFields.GPM, value: 2 },
        { key: ColumnFields.DISCOUNT, value: 3 },
      ];
      expect(result).toEqual(expected);
    });

    test('should return target price and no other kpis', () => {
      jest.spyOn(pricingUtils, 'multiplyAndRoundValues').mockReturnValue(1);

      const result = pricingUtils.calculateAffectedKPIs(
        1,
        ColumnFields.TARGET_PRICE,
        QUOTATION_DETAIL_MOCK
      );

      expect(pricingUtils.multiplyAndRoundValues).toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.TARGET_PRICE, value: 1 },
      ];
      expect(result).toEqual(expected);
    });

    test('should return kpis for gpi', () => {
      jest.spyOn(pricingUtils, 'calculateDiscount').mockReturnValue(3);
      jest.spyOn(pricingUtils, 'calculateMargin').mockReturnValue(1);
      jest
        .spyOn(pricingUtils, 'getManualPriceByMarginAndCost')
        .mockReturnValue(23);

      const result = pricingUtils.calculateAffectedKPIs(
        1,
        ColumnFields.GPI,
        QUOTATION_DETAIL_MOCK
      );

      expect(pricingUtils.getManualPriceByMarginAndCost).toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.PRICE, value: 23 },
        { key: ColumnFields.GPM, value: 1 },
        { key: ColumnFields.DISCOUNT, value: 3 },
      ];
      expect(result).toEqual(expected);
    });

    test('should return kpis for gpm', () => {
      jest.spyOn(pricingUtils, 'calculateMargin').mockReturnValue(1);
      jest
        .spyOn(pricingUtils, 'getManualPriceByMarginAndCost')
        .mockReturnValue(23);
      jest.spyOn(pricingUtils, 'calculateDiscount').mockReturnValue(3);

      const result = pricingUtils.calculateAffectedKPIs(
        1,
        ColumnFields.GPM,
        QUOTATION_DETAIL_MOCK
      );

      expect(pricingUtils.getManualPriceByMarginAndCost).toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.PRICE, value: 23 },
        { key: ColumnFields.GPI, value: 1 },
        { key: ColumnFields.DISCOUNT, value: 3 },
      ];
      expect(result).toEqual(expected);
    });
    test('should return kpis for discount', () => {
      jest.spyOn(pricingUtils, 'calculateMargin').mockReturnValue(1);
      jest.spyOn(pricingUtils, 'getManualPriceByDiscount').mockReturnValue(23);
      jest.spyOn(pricingUtils, 'calculateDiscount').mockReturnValue(3);

      const result = pricingUtils.calculateAffectedKPIs(
        1,
        ColumnFields.DISCOUNT,
        QUOTATION_DETAIL_MOCK
      );

      expect(pricingUtils.getManualPriceByDiscount).toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.PRICE, value: 23 },
        { key: ColumnFields.GPI, value: 1 },
        { key: ColumnFields.GPM, value: 1 },
      ];
      expect(result).toEqual(expected);
    });
    test('should throw error for other columns', () => {
      expect(() =>
        pricingUtils.calculateAffectedKPIs(
          1,
          ColumnFields.FOLLOWING_TYPE,
          QUOTATION_DETAIL_MOCK
        )
      ).toThrowError(new Error('No matching Column Field for computation'));
    });
    test('should return kpis for absolute price', () => {
      jest.spyOn(pricingUtils, 'multiplyAndRoundValues').mockReturnValue(1);
      jest.spyOn(pricingUtils, 'calculateMargin').mockReturnValue(2);
      jest.spyOn(pricingUtils, 'calculateDiscount').mockReturnValue(3);

      const result = pricingUtils.calculateAffectedKPIs(
        1,
        ColumnFields.PRICE,
        QUOTATION_DETAIL_MOCK,
        false
      );

      expect(pricingUtils.multiplyAndRoundValues).not.toHaveBeenCalled();

      const expected: KpiValue[] = [
        { key: ColumnFields.PRICE, value: 1 },
        { key: ColumnFields.GPI, value: 2 },
        { key: ColumnFields.GPM, value: 2 },
        { key: ColumnFields.DISCOUNT, value: 3 },
      ];
      expect(result).toEqual(expected);
    });
  });
});
