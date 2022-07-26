import { Action } from '@ngrx/store';

import * as parametersActions from '@ga/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { CalculationParametersState } from '@ga/core/store/models';
import { EnvironmentImpact, LoadLevels, Movement } from '@ga/shared/models';
import {
  DIALOG_RESPONSE_MOCK,
  PREFERRED_GREASE_MOCK,
  PREFERRED_GREASE_OPTION_MOCK,
  PROPERTIES_MOCK,
} from '@ga/testing/mocks';

import {
  calculationParametersReducer,
  initialState,
  reducer,
} from './calculation-parameters.reducer';

describe('calculationParametersReducer', () => {
  describe('Reducer function', () => {
    it('should return calculationParametersReducer', () => {
      // prepare any action
      const action: Action = parametersActions.patchParameters({
        parameters: undefined,
      });
      expect(reducer(initialState, action)).toEqual(
        calculationParametersReducer(initialState, action)
      );
    });
  });

  describe('patchParameters Action', () => {
    it('should patch all parameters', () => {
      const mockParameters: CalculationParametersState = {
        loads: {
          radial: 10,
          axial: 10,
          exact: false,
          loadRatio: LoadLevels.LB_MODERATE,
        },
        movements: {
          type: Movement.oscillating,
          rotationalSpeed: 10,
          shiftFrequency: 10,
          shiftAngle: 10,
        },
        environment: {
          operatingTemperature: 170,
          environmentTemperature: 120,
          environmentImpact: EnvironmentImpact.moderate,
        },
        preferredGrease: PREFERRED_GREASE_MOCK,
        valid: true,
        updating: false,
      } as CalculationParametersState;

      const newState = calculationParametersReducer(
        initialState,
        parametersActions.patchParameters({ parameters: mockParameters })
      );

      expect(newState).toEqual({ ...mockParameters, updating: true });
    });

    it('should patch partial parameters', () => {
      const mockParameters: CalculationParametersState = {
        loads: {
          radial: 10,
          axial: 10,
        },
      } as CalculationParametersState;

      const newState = calculationParametersReducer(
        initialState,
        parametersActions.patchParameters({ parameters: mockParameters })
      );

      expect(newState.loads.axial).toEqual(10);
      expect(newState.loads.radial).toEqual(10);
    });
  });

  describe('modelUpdateSuccess Action', () => {
    it('should set updating to false when params are updated', () => {
      const newState = calculationParametersReducer(
        initialState,
        parametersActions.modelUpdateSuccess()
      );

      expect(newState).toEqual({ ...initialState, updating: false });
    });
  });

  describe('getPropertiesSuccess Action', () => {
    it('should set the properties for the model', () => {
      const newState = calculationParametersReducer(
        initialState,
        parametersActions.getPropertiesSuccess({ properties: PROPERTIES_MOCK })
      );

      expect(newState).toEqual({
        ...initialState,
        properties: PROPERTIES_MOCK,
      });
    });
  });

  describe('getDialog', () => {
    it('should set loading to true', () => {
      const newState = calculationParametersReducer(
        initialState,
        parametersActions.getDialog()
      );

      expect(newState).toEqual({
        ...initialState,
        preferredGrease: {
          ...initialState.preferredGrease,
          loading: true,
        },
      });
    });
  });

  describe('getDialogSuccess', () => {
    it('should set preferred grease', () => {
      const newState = calculationParametersReducer(
        initialState,
        parametersActions.getDialogSuccess({
          dialogResponse: DIALOG_RESPONSE_MOCK,
        })
      );

      expect(newState).toEqual({
        ...initialState,
        preferredGrease: {
          ...PREFERRED_GREASE_MOCK,
          selectedGrease: undefined,
        },
      });
    });
  });

  describe('getDialogFailure', () => {
    it('should set loading to false', () => {
      const newState = calculationParametersReducer(
        {
          ...initialState,
          preferredGrease: {
            ...initialState.preferredGrease,
            loading: true,
          },
        },
        parametersActions.getDialogFailure()
      );

      expect(newState).toEqual({
        ...initialState,
        preferredGrease: {
          ...initialState.preferredGrease,
          loading: false,
        },
      });
    });
  });

  describe('setPreferredGreaseSelection', () => {
    it('should set preferred grease selection', () => {
      const newState = calculationParametersReducer(
        initialState,
        parametersActions.setPreferredGreaseSelection({
          selectedGrease: PREFERRED_GREASE_OPTION_MOCK,
        })
      );

      expect(newState).toEqual({
        ...initialState,
        preferredGrease: {
          ...initialState.preferredGrease,
          selectedGrease: PREFERRED_GREASE_OPTION_MOCK,
        },
      });
    });
  });

  describe('resetPreferredGreaseSelection', () => {
    it('should reset preferred grease selection', () => {
      const newState = calculationParametersReducer(
        initialState,
        parametersActions.resetPreferredGreaseSelection()
      );

      expect(newState).toEqual(initialState);
    });
  });
});
