import {
  QUOTATION_DETAIL_MOCK,
  TRANSACTION_MOCK,
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

  describe('calculatePercentDifference', () => {
    test('should Calculate % diff', () => {
      const detail = {
        lastCustomerPrice: 110,
        price: 120,
      } as any;

      const result = PriceService.calculatePercentDifference(detail);

      expect(result).toEqual(9.09);
    });
    test('should return undefined', () => {
      const detail = {
        lastCustomerPrice: undefined,
        price: 100,
      } as any;

      const result = PriceService.calculatePercentDifference(detail);

      expect(result).toEqual(undefined);
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

  describe('calculateStatusBarValues', () => {
    test('should return calculatedValues', () => {
      const details = [QUOTATION_DETAIL_MOCK];
      const result = PriceService.calculateStatusBarValues(details);

      expect(result).toEqual({
        netValue: QUOTATION_DETAIL_MOCK.netValue,
        weightedGPI: QUOTATION_DETAIL_MOCK.gpi,
        weightedGPM: QUOTATION_DETAIL_MOCK.gpm,
      });
    });
  });

  describe('roundPercentageToTwoDecimals', () => {
    test('should round to two decimals', () => {
      const result = PriceService.roundPercentageToTwoDecimals(0.5555);
      expect(result).toEqual(55.55);
    });
  });
  describe('roundToTwoDecimals', () => {
    test('should round to two decimals', () => {
      const result = PriceService.roundToTwoDecimals(1.2222);
      expect(result).toEqual(1.22);
    });
  });
  describe('multiplyTransactionsWithPriceUnit', () => {
    test('shouldreturn multipliedTransacitons', () => {
      const transactions = [TRANSACTION_MOCK];
      const result = PriceService.multiplyTransactionsWithPriceUnit(
        transactions,
        100
      );

      expect(result).toEqual([{ ...TRANSACTION_MOCK, price: 1000 }]);
    });
  });
});
