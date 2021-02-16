import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { loadQuotationSuccess } from '../../../core/store';
import { PriceService } from './price.service';

describe('PriceService', () => {
  describe('addCalculations', () => {
    test('should call addCalculations', () => {
      PriceService.addCalculationsForDetails = jest
        .fn()
        .mockReturnValue([QUOTATION_DETAIL_MOCK]);

      const result = PriceService.addCalculations(QUOTATION_MOCK);

      expect(result).toEqual({
        item: QUOTATION_MOCK,
        type: loadQuotationSuccess.type,
      });
    });
  });

  describe('addCalculationForDetails', () => {
    test('should call addCalculationForDetail', () => {
      const details = [QUOTATION_DETAIL_MOCK];
      PriceService.addCalculationsForDetail = jest.fn(() => details[0]);

      const result = PriceService.addCalculationsForDetails(details);
      expect(result).toEqual(result);
    });
  });

  describe('addCalculationForDetail', () => {
    test('should return detail', () => {
      const detail = QUOTATION_DETAIL_MOCK;

      const result = PriceService.addCalculationsForDetail(detail);
      expect(result).toEqual({
        ...detail,
        percentDifference: QUOTATION_DETAIL_MOCK.percentDifference,
        netValue: QUOTATION_DETAIL_MOCK.netValue,
      });
    });
  });

  describe('calculatePercentDifference', () => {
    test('should Calculate % diff', () => {
      const detail = {
        lastCustomerPrice: 110,
        price: 120,
      } as any;

      const result = PriceService.calculatePercentDiffernce(detail);

      expect(result).toEqual(9.09);
    });
    test('should return undefined', () => {
      const detail = {
        lastCustomerPrice: undefined,
        price: 100,
      } as any;

      const result = PriceService.calculatePercentDiffernce(detail);

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
  describe('calculateGPI', () => {
    test('should return gpi', () => {
      const price = 25;
      const gpc = 20;

      const result = PriceService.calculateGPI(price, gpc);

      expect(result).toEqual(20);
    });
    test('should return undefined', () => {
      const price = 25;
      const gpc = undefined as any;

      const result = PriceService.calculateGPI(price, gpc);

      expect(result).toEqual(undefined);
    });
  });

  describe('roundToTwoDecimals', () => {
    test('should round to two decimals', () => {
      const result = PriceService.roundToTwoDecimals(0.5555);
      expect(result).toEqual(55.55);
    });
  });
});
