import { Action } from '@ngrx/store';

import {
  operatingParameters,
  resetCalculationParameters,
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
      const action: Action = resetCalculationParameters();

      expect(reducer(initialState, action)).toEqual(
        calculationParametersReducer(initialState, action)
      );
    });
  });

  describe('patchParameters Action', () => {
    it('should patch all parameters', () => {
      const mockParameters: CalculationParametersState = {
        operationConditions: {
          rotationalSpeed: 1,
          axialLoad: 0,
          radialLoad: 0,
        },
      } as CalculationParametersState;

      const newState = calculationParametersReducer(
        initialState,
        operatingParameters({
          operationConditions: mockParameters.operationConditions,
        })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          operationConditions: expect.objectContaining(
            mockParameters.operationConditions
          ),
        })
      );
    });
  });

  describe('resetCalculationParameters', () => {
    it('should reset all calculation params', () => {
      const newState = calculationParametersReducer(
        initialState,
        resetCalculationParameters()
      );

      expect(newState).toEqual(initialState);
    });
  });
});
