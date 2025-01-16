import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_DETAILS_MOCK,
} from '../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { StatusBarProperties } from '../ag-grid/custom-status-bar/quotation-details-status/model/status-bar.model';
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
      { lastCustomerPrice: 110, price: 120, expected: 0.0909 },
      { lastCustomerPrice: 100, price: 50, expected: -0.5 },
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

      expect(result).toEqual(0.2);
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

      expect(result).toEqual(0.2);
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
          QUOTATION_DETAIL_MOCK.gpi * 100,
          QUOTATION_DETAIL_MOCK.gpm * 100,
          QUOTATION_DETAIL_MOCK.priceDiff * 100,
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
          QUOTATION_DETAIL_MOCK.gpi * 100,
          QUOTATION_DETAIL_MOCK.rfqData.gpm * 100,
          QUOTATION_DETAIL_MOCK.priceDiff * 100,
          details.length
        )
      );
    });
    test('only use max quantity to calculate StatusBarCalculation, if same materialNumber15 appear', () => {
      const result = pricingUtils.calculateStatusBarValues(
        QUOTATION_DETAILS_MOCK
      );
      expect(result).toEqual(
        new StatusBarProperties(2020.4, 24.74, 0.99, 20, 3)
      );
    });

    test('return calculatedValues for statusBar when all incoming Values are undefined', () => {
      const details = [
        {
          material: {
            materialNumber15: '123456789',
          },
        } as unknown as QuotationDetail,
      ];

      const result = pricingUtils.calculateStatusBarValues(details);
      expect(result).toEqual(new StatusBarProperties(0, 0, 0, null, 1));
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
      const manualPrice = pricingUtils.getManualPriceByMarginAndCost(100, 0.2);

      expect(manualPrice).toEqual(125);
    });
  });

  describe('getManualPriceByDiscount', () => {
    test('should return manualPrice', () => {
      const manualPrice = pricingUtils.getManualPriceByDiscount(100, 0.2);

      expect(manualPrice).toEqual(80);
    });
  });

  describe('calculateDiscount', () => {
    test('should skip discount calculation when price is 0', () => {
      const result = pricingUtils.calculateDiscount(0, 200);

      expect(result).toEqual(0);
    });

    test('should return discount', () => {
      const result = pricingUtils.calculateDiscount(100, 200);

      expect(result).toEqual(0.5);
    });
  });

  describe('roundPercentageToTwoDecimals', () => {
    test('should round to two decimals', () => {
      const result = pricingUtils.roundPercentageToTwoDecimals(0.5555);
      expect(result).toEqual(55.55);
    });
  });
});
