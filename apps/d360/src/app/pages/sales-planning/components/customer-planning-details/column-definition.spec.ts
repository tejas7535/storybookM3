import { getTranslationKey, valueFormatters } from './column-definition';

describe('Column Definitions', () => {
  describe('getTranslationKey', () => {
    it('should return correct yearly translation key', () => {
      expect(getTranslationKey('sales')).toBe(
        'sales_planning.table.yearly.sales'
      );
    });

    it('should return correct monthly translation key', () => {
      expect(getTranslationKey('forecast', true)).toBe(
        'sales_planning.table.monthly.forecast'
      );
    });
  });

  describe('valueFormatters', () => {
    it('should format monetary values correctly', () => {
      const mockNumberPipe = {
        transform: jest.fn().mockReturnValue('1,000.00'),
      };
      const params = {
        value: 1000,
        context: { numberPipe: mockNumberPipe },
        data: { planningCurrency: 'USD' },
      };
      expect(valueFormatters.monetary(params)).toBe('1,000.00 USD');
      expect(mockNumberPipe.transform).toHaveBeenCalledWith(1000);
    });

    it('should return "-" for monetary value of -1', () => {
      const params = { value: -1, context: {}, data: {} };
      expect(valueFormatters.monetary(params)).toBe('-');
    });

    it('should format percentage values correctly', () => {
      const params = { value: 50 };
      expect(valueFormatters.percentage(params)).toBe('50 %');
    });

    it('should return undefined for default formatter', () => {
      expect(valueFormatters.default).toBeUndefined();
    });
  });
});
