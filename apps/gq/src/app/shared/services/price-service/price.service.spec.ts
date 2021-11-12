import {
  COMPARABLE_LINKED_TRANSACTION_MOCK,
  EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
  QUATATION_DETAILS_MOCK,
  QUOTATION_DETAIL_MOCK,
} from '../../../../testing/mocks';
import { PriceService } from './price.service';

describe('PriceService', () => {
  describe('addCalculationForDetail', () => {
    test('should return detail', () => {
      const detail = QUOTATION_DETAIL_MOCK;
      detail.gpi = 0;
      detail.percentDifference = 0;
      detail.netValue = 0;
      detail.strategicPrice = 10;

      PriceService.addCalculationsForDetail(detail);

      expect(detail).toEqual(QUOTATION_DETAIL_MOCK);
    });
  });
  describe('multiplyAndRoundValues', () => {
    test('should return multiplied rounded value', () => {
      const result = PriceService.multiplyAndRoundValues(1.111_11, 100);
      expect(result).toEqual(111.11);
    });
    test('should return undefined', () => {
      const result = PriceService.multiplyAndRoundValues(undefined, 100);
      expect(result).toEqual(undefined);
    });
  });
  describe('addCalculationForDetails', () => {
    test('should call addCalculationForDetail', () => {
      const details = [QUOTATION_DETAIL_MOCK];
      PriceService.addCalculationsForDetail = jest.fn();

      PriceService.addCalculationsForDetails(details);
      expect(PriceService.addCalculationsForDetail).toHaveBeenCalledTimes(1);
    });
  });

  describe('calculatePercentDifference should', () => {
    test.each([
      { lastCustomerPrice: 110, price: 120, expected: 9.09 },
      { lastCustomerPrice: 100, price: 50, expected: -50 },
      { lastCustomerPrice: undefined, price: 100, expected: undefined },
      { lastCustomerPrice: 137, price: 137, expected: 0 },
      { lastCustomerPrice: 0.237, price: 0.237, expected: 0 },
    ])('calculate diff in %', ({ lastCustomerPrice, price, expected }) => {
      const detail = {
        lastCustomerPrice,
        price,
      } as any;

      const result = PriceService.calculatePercentDifference(detail);

      expect(result).toEqual(expected);
    });
  });

  describe('calculateNetValue', () => {
    test('should return NetValue', () => {
      const price = 10;
      const quantity = 5;

      const result = PriceService.calculateNetValue(price, quantity);
      expect(result).toEqual(50);
    });
    test('should return undefined', () => {
      const result = PriceService.calculateNetValue(undefined, 10);
      expect(result).toBeUndefined();
    });
  });
  describe('calculateMargin', () => {
    test('should return margin', () => {
      const price = 25;
      const margin = 20;

      const result = PriceService.calculateMargin(price, margin);

      expect(result).toEqual(20);
    });
    test('should return undefined', () => {
      const price = 25;
      const margin = undefined as any;

      const result = PriceService.calculateMargin(price, margin);

      expect(result).toEqual(undefined);
    });
  });

  describe('calculateDiscount', () => {
    test('should return discount', () => {
      const detail = {
        sapGrossPrice: 200,
        price: 100,
        material: { priceUnit: 1 },
      } as any;

      const result = PriceService.calculateDiscount(detail);

      expect(result).toEqual(50);
    });
    test('should return undefined', () => {
      const detail = {
        sapGrossPrice: undefined,
        price: 100,
      } as any;

      const result = PriceService.calculateDiscount(detail);

      expect(result).toEqual(undefined);
    });
  });

  describe('getManualPriceByDiscount', () => {
    test('should return manualPrice', () => {
      const manualPrice = PriceService.getManualPriceByDiscount(100, 20);

      expect(manualPrice).toEqual(80);
    });
  });
  describe('getManualPriceByMarginAndCost', () => {
    test('should return manualPrice', () => {
      const manualPrice = PriceService.getManualPriceByMarginAndCost(100, 20);

      expect(manualPrice).toEqual(125);
    });
  });
  describe('calculateStatusBarValues should', () => {
    test('return calculatedValues', () => {
      const details = [QUOTATION_DETAIL_MOCK];

      const result = PriceService.calculateStatusBarValues(details);

      expect(result).toEqual({
        totalNetValue: QUOTATION_DETAIL_MOCK.netValue,
        totalWeightedGPI: QUOTATION_DETAIL_MOCK.gpi,
        totalWeightedGPM: QUOTATION_DETAIL_MOCK.gpm,
      });
    });
    test('only use max quantity to calculate StatusBarCalculation, if same materialNumber15 appear', () => {
      const result = PriceService.calculateStatusBarValues(
        QUATATION_DETAILS_MOCK
      );

      expect(result).toEqual({
        totalNetValue: 2020.4,
        totalWeightedGPI: 24.74,
        totalWeightedGPM: 0.99,
      });
    });
  });

  describe('keepMaxQuantityIfDuplicate should', () => {
    test('only use max quantity to calculate StatusBarCalculation, if same materialNumber15 appear', () => {
      const result = PriceService.keepMaxQuantityIfDuplicate(
        QUATATION_DETAILS_MOCK
      );

      expect(result.length).toEqual(2);
    });
  });

  describe('roundPercentageToTwoDecimals', () => {
    test('should round to two decimals', () => {
      const result = PriceService.roundPercentageToTwoDecimals(0.5555);
      expect(result).toEqual(55.55);
    });
  });
  describe('roundToTwoDecimals should round to', () => {
    test('two decimals', () => {
      const result = PriceService.roundToTwoDecimals(1.2222);
      expect(result).toEqual(1.22);
    });
    test('undefined', () => {
      const result = PriceService.roundToTwoDecimals(undefined as any);
      // eslint-disable-next-line unicorn/prefer-number-properties
      expect(result).toEqual(NaN);
    });
  });
  describe('multiplyTransactionsWithPriceUnit', () => {
    test('should return multipliedTransacitons', () => {
      const transactions = [COMPARABLE_LINKED_TRANSACTION_MOCK];

      const result = PriceService.multiplyTransactionsWithPriceUnit(
        transactions,
        100
      );

      expect(result).toEqual([
        { ...COMPARABLE_LINKED_TRANSACTION_MOCK, price: 1000 },
      ]);
    });
  });

  describe('multiplyExtendedComparableLinkedTransactionsWithPriceUnit', () => {
    test('should return multiplied ExtendedComparableLinkedTransactions', () => {
      const transactions = [EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK];
      const priceUnit = 100;
      const priceUnitsForQuotationItemIds = [
        { priceUnit, quotationItemId: 60 },
      ];

      const result =
        PriceService.multiplyExtendedComparableLinkedTransactionsWithPriceUnit(
          transactions,
          priceUnitsForQuotationItemIds
        );

      expect(result).toEqual([
        {
          ...EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
          price: EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK.price * priceUnit,
        },
      ]);
    });
  });
});
