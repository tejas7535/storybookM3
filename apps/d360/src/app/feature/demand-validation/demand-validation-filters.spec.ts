import { demandValidationFilterToStringFilter } from './demand-validation-filters';

describe('DemandValidationFilters', () => {
  describe('demandValidationFilterToStringFilter', () => {
    it('should return undefined if the input filter is undefined', () => {
      const result = demandValidationFilterToStringFilter(undefined as any);
      expect(result).toBeUndefined();
    });

    it('should return an empty object if the input filter has no values', () => {
      const filter = {
        customerMaterialNumber: [],
        productLine: [],
        productionLine: [],
        stochasticType: [],
      } as any;
      const result = demandValidationFilterToStringFilter(filter);
      expect(result).toEqual({});
    });

    it('should map filter values to string arrays for non-empty fields', () => {
      const filter = {
        customerMaterialNumber: [{ id: '123', text: 'Material 123' }],
        productLine: [
          { id: 'PL1', text: 'Product Line 1' },
          { id: 'PL2', text: 'Product Line 2' },
        ],
        productionLine: [],
        stochasticType: [{ id: 'ST1', text: 'Stochastic Type 1' }],
      } as any;
      const result = demandValidationFilterToStringFilter(filter);
      expect(result).toEqual({
        customerMaterialNumber: ['123'],
        productLine: ['PL1', 'PL2'],
        stochasticType: ['ST1'],
      });
    });

    it('should handle filters with all fields populated', () => {
      const filter = {
        customerMaterialNumber: [{ id: '123', text: 'Material 123' }],
        productLine: [{ id: 'PL1', text: 'Product Line 1' }],
        productionLine: [{ id: 'PL2', text: 'Production Line 2' }],
        stochasticType: [{ id: 'ST1', text: 'Stochastic Type 1' }],
      };
      const result = demandValidationFilterToStringFilter(filter);
      expect(result).toEqual({
        customerMaterialNumber: ['123'],
        productLine: ['PL1'],
        productionLine: ['PL2'],
        stochasticType: ['ST1'],
      });
    });

    it('should handle filters with mixed empty and populated fields', () => {
      const filter = {
        customerMaterialNumber: [],
        productLine: [{ id: 'PL1', text: 'Product Line 1' }],
        productionLine: [],
        stochasticType: [{ id: 'ST1', text: 'Stochastic Type 1' }],
      } as any;
      const result = demandValidationFilterToStringFilter(filter);
      expect(result).toEqual({
        productLine: ['PL1'],
        stochasticType: ['ST1'],
      });
    });
  });
});
