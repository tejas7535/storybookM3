import { extractDeviationValuesFromThermalResult } from './calculation-result.helpers';

describe('CalculationResultHelpers', () => {
  describe('extractDeviationValuesFromThermalResult', () => {
    it('should extract upper and lower deviation values from thermal result', () => {
      const mockResult = {
        inputs: [
          {
            titleID: 'STRING_OUTP_SHAFT',
            subItems: [
              { abbreviation: 'FO_D', value: 0.5 },
              { abbreviation: 'FU_D', value: -0.3 },
            ],
          },
        ],
      };

      const result = extractDeviationValuesFromThermalResult(mockResult as any);
      expect(result).toEqual({ upperDeviation: 0.5, lowerDeviation: -0.3 });
    });

    it('should return undefined for upper and lower deviation if not present', () => {
      const mockResult = {
        inputs: [
          {
            titleID: 'STRING_OUTP_SHAFT',
            subItems: [] as any,
          },
        ],
      };

      const result = extractDeviationValuesFromThermalResult(mockResult as any);
      expect(result).toEqual({
        upperDeviation: undefined,
        lowerDeviation: undefined,
      });
    });

    it('should handle missing inputs gracefully', () => {
      const mockResult = {};

      const result = extractDeviationValuesFromThermalResult(mockResult as any);
      expect(result).toEqual({
        upperDeviation: undefined,
        lowerDeviation: undefined,
      });
    });
  });
});
