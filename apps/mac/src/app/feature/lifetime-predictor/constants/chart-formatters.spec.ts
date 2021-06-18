import { lowPrecisionFormatter, scientificFormatter } from './chart-formatters';

describe('CHART_SETTINGS_WOEHLER', () => {
  describe('formatters', () => {
    it('should exist', () => {
      expect(lowPrecisionFormatter).toBeDefined();
      expect(scientificFormatter).toBeDefined();
    });

    it('should return value if it is not a decimal', () => {
      const result = lowPrecisionFormatter(100);

      expect(result).toEqual('100');
    });

    it('should return value with precision of 2', () => {
      const result = lowPrecisionFormatter(100.555_555_5);

      expect(result).toEqual('100.56');
    });

    it('should return scientific notation for value', () => {
      const result = scientificFormatter(10_000);

      expect(result).toEqual('1.0E + 4');
    });
  });
});
