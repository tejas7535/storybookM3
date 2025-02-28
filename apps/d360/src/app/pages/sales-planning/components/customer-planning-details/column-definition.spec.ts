import { TranslocoModule } from '@jsverse/transloco';

import { valueFormatters } from './column-definition';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('Column Definitions', () => {
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
