import { Action } from '@ngrx/store';

import {
  operatingParameters,
  resetCalculationParams,
} from '../../actions/calculation-parameters/calculation-parameters.actions';
import { CalculationParametersState } from '../../models';
import {
  calculationParametersReducer,
  initialState,
  reducer,
} from './calculation-parameters.reducer';

describe('calculationParametersReducer', () => {
  describe('Reducer function', () => {
    it('should return calculationParametersReducer', () => {
      const action: Action = resetCalculationParams();

      expect(reducer(initialState, action)).toEqual(
        calculationParametersReducer(initialState, action)
      );
    });
  });

  describe('patchParameters Action', () => {
    it('should patch all parameters', () => {
      const mockParameters: CalculationParametersState = {
        operationConditions: {
          rotation: 1,
          axial: 0,
          radial: 0,
        },
      } as CalculationParametersState;

      const newState = calculationParametersReducer(
        initialState,
        operatingParameters({ parameters: mockParameters })
      );

      expect(newState).toEqual({ ...mockParameters });
    });
  });

  describe('resetCalculationParams', () => {
    it('should reset all calculation params', () => {
      const newState = calculationParametersReducer(
        initialState,
        resetCalculationParams()
      );

      expect(newState).toEqual(initialState);
    });
  });
});
