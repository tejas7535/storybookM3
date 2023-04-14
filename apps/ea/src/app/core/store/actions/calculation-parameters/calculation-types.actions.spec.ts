import { CalculationParametersCalculationTypes } from '../../models';
import {
  selectAll,
  selectType,
  setCalculationTypes,
} from './calculation-types.actions';

describe('CalculationTypes', () => {
  describe('setCalculationTypes', () => {
    it('should update the calculation types', () => {
      const mockParameters: CalculationParametersCalculationTypes = {
        emission: {
          disabled: true,
          selected: true,
          visible: false,
        },
        friction: {
          disabled: true,
          selected: false,
          visible: true,
        },
      };
      const action = setCalculationTypes({ calculationTypes: mockParameters });

      expect(action).toEqual({
        calculationTypes: mockParameters,
        type: '[Calculation Types] Set calculation types',
      });
    });
  });

  describe('selectAll', () => {
    it('should select all', () => {
      const action = selectAll({ selectAll: false });

      expect(action).toEqual({
        selectAll: false,
        type: '[Calculation Types] Select all',
      });
    });
  });

  describe('selectType', () => {
    it('should select a single type', () => {
      const action = selectType({ calculationType: 'emission', select: false });

      expect(action).toEqual({
        select: false,
        calculationType: 'emission',
        type: '[Calculation Types] Select type',
      });
    });
  });
});
