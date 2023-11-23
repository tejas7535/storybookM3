import { Action } from '@ngrx/store';

import { CalculationTypesActions } from '../../actions';
import {
  operatingParameters,
  resetCalculationParameters,
  setIsInputInvalid,
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

  describe('operatingParameters', () => {
    it('should update parameters', () => {
      const mockParameters: CalculationParametersState = {
        operationConditions: {
          loadCaseData: [
            {
              load: {
                axialLoad: 1,
                radialLoad: 123,
              },
            },
          ],
        },
        isInputInvalid: true,
        calculationTypes: {},
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
          isInputInvalid: false,
        })
      );
    });
  });

  describe('setIsInputInvalid', () => {
    it('should set missing input', () => {
      const mockParameters: CalculationParametersState = {
        operationConditions: {
          loadCaseData: [
            {
              load: {
                axialLoad: 1,
                radialLoad: 123,
              },
            },
          ],
        },
        isInputInvalid: false,
        calculationTypes: {},
      } as CalculationParametersState;

      const newState = calculationParametersReducer(
        mockParameters,
        setIsInputInvalid({
          isInputInvalid: true,
        })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          isInputInvalid: true,
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

  describe('selectAll', () => {
    it('should select all', () => {
      const newState = calculationParametersReducer(
        {
          ...initialState,
          calculationTypes: {
            ...initialState.calculationTypes,
            emission: {
              ...initialState.calculationTypes.emission,
              disabled: true,
            },
          },
        },
        CalculationTypesActions.selectAll({ selectAll: true })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          calculationTypes: expect.objectContaining({
            emission: expect.objectContaining({
              selected: true,
              disabled: true,
            }),
            frictionalPowerloss: expect.objectContaining({
              selected: true,
              disabled: false,
            }),
          }),
        })
      );
    });

    it('should unselect all if not disabled', () => {
      const newState = calculationParametersReducer(
        {
          ...initialState,
          calculationTypes: {
            ...initialState.calculationTypes,
            emission: {
              ...initialState.calculationTypes.emission,
              disabled: true,
            },
          },
        },
        CalculationTypesActions.selectAll({ selectAll: false })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          calculationTypes: expect.objectContaining({
            emission: expect.objectContaining({
              selected: true,
              disabled: true,
            }),
            frictionalPowerloss: expect.objectContaining({
              selected: false,
              disabled: false,
            }),
          }),
        })
      );
    });
  });

  describe('selectType', () => {
    it('should select type if unselected', () => {
      const newState = calculationParametersReducer(
        initialState,
        CalculationTypesActions.selectType({
          select: true,
          calculationType: 'frictionalPowerloss',
        })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          calculationTypes: expect.objectContaining({
            frictionalPowerloss: expect.objectContaining({
              selected: true,
              disabled: false,
            }),
          }),
        })
      );
    });

    it('should not change select type if disabled', () => {
      const newState = calculationParametersReducer(
        {
          ...initialState,
          calculationTypes: {
            ...initialState.calculationTypes,
            emission: {
              ...initialState.calculationTypes.emission,
              disabled: true,
            },
          },
        },
        CalculationTypesActions.selectType({
          select: false,
          calculationType: 'emission',
        })
      );

      expect(newState).toEqual(
        expect.objectContaining({
          calculationTypes: expect.objectContaining({
            emission: expect.objectContaining({
              selected: true,
              disabled: true,
            }),
          }),
        })
      );
    });
  });
});
