import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import {
  DemandValidationFilter,
  demandValidationFilterToStringFilter,
} from './demand-validation-filters';

describe('DemandValidationFilters', () => {
  describe('demandValidationFilterToStringFilter', () => {
    it('should return undefined if the input filter is undefined', () => {
      const result = demandValidationFilterToStringFilter(undefined as any);
      expect(result).toBeUndefined();
    });

    it('should return an empty object if the input filter has no values', () => {
      const filter: DemandValidationFilter = {
        customerMaterialNumber: [],
        productLine: [],
        productionLine: [],
        stochasticType: [],
        forecastMaintained: null,
      };
      const result = demandValidationFilterToStringFilter(filter);
      expect(result).toEqual({});
    });

    it('should map filter values to string arrays for non-empty fields', () => {
      const filter: DemandValidationFilter = {
        customerMaterialNumber: [{ id: '123', text: 'Material 123' }],
        productLine: [
          { id: 'PL1', text: 'Product Line 1' },
          { id: 'PL2', text: 'Product Line 2' },
        ],
        productionLine: [],
        stochasticType: [{ id: 'ST1', text: 'Stochastic Type 1' }],
        forecastMaintained: null,
      };
      const result = demandValidationFilterToStringFilter(filter);
      expect(result).toEqual({
        customerMaterialNumber: ['123'],
        productLine: ['PL1', 'PL2'],
        stochasticType: ['ST1'],
      });
    });

    it('should handle filters with all fields populated', () => {
      const filter: DemandValidationFilter = {
        customerMaterialNumber: [{ id: '123', text: 'Material 123' }],
        productLine: [{ id: 'PL1', text: 'Product Line 1' }],
        productionLine: [{ id: 'PL2', text: 'Production Line 2' }],
        stochasticType: [{ id: 'ST1', text: 'Stochastic Type 1' }],
        forecastMaintained: [{ id: 'true', text: 'Yes' }],
      };
      const result = demandValidationFilterToStringFilter(filter);
      expect(result).toEqual({
        customerMaterialNumber: ['123'],
        productLine: ['PL1'],
        productionLine: ['PL2'],
        stochasticType: ['ST1'],
        forecastMaintained: ['true'],
      });
    });

    it('should handle filters with mixed empty and populated fields', () => {
      const filter: DemandValidationFilter = {
        customerMaterialNumber: [],
        productLine: [{ id: 'PL1', text: 'Product Line 1' }],
        productionLine: [],
        stochasticType: [{ id: 'ST1', text: 'Stochastic Type 1' }],
        forecastMaintained: [],
      };
      const result = demandValidationFilterToStringFilter(filter);
      expect(result).toEqual({
        productLine: ['PL1'],
        stochasticType: ['ST1'],
      });
    });

    it('should handle single SelectableValue objects (not arrays)', () => {
      const filter: DemandValidationFilter = {
        customerMaterialNumber: {
          id: '123',
          text: 'Material 123',
        },
        productLine: [{ id: 'PL1', text: 'Product Line 1' }],
        productionLine: [],
        stochasticType: {
          id: 'ST1',
          text: 'Stochastic Type 1',
        },
        forecastMaintained: {
          id: 'true',
          text: 'True',
        },
      };

      const result = demandValidationFilterToStringFilter(filter);
      expect(result).toEqual({
        customerMaterialNumber: ['123'],
        productLine: ['PL1'],
        stochasticType: ['ST1'],
        forecastMaintained: ['true'],
      });
    });

    describe('normalizeToArray', () => {
      it('should handle single SelectableValue correctly', () => {
        const filter: DemandValidationFilter = {
          customerMaterialNumber: {
            id: 'single',
            text: 'Single Value',
          } as SelectableValue,
          productLine: [],
          productionLine: [],
          stochasticType: [],
          forecastMaintained: null,
        };

        const result = demandValidationFilterToStringFilter(filter);
        expect(result).toEqual({
          customerMaterialNumber: ['single'],
        });
      });

      it('should handle null and undefined values correctly', () => {
        const filter: DemandValidationFilter = {
          customerMaterialNumber: null,
          productLine: [],
          productionLine: [],
          stochasticType: [],
          forecastMaintained: undefined,
        };

        const result = demandValidationFilterToStringFilter(filter);
        expect(result).toEqual({});
      });
    });
  });
});
