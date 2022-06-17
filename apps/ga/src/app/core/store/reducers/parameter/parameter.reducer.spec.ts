import { Action } from '@ngrx/store';

import { EnvironmentImpact, LoadLevels, Movement } from '@ga/shared/models';
import {
  PROPERTIES_MOCK,
  PREFERRED_GREASE_MOCK,
  DIALOG_RESPONSE_MOCK,
  PREFERRED_GREASE_OPTION_MOCK,
} from '@ga/testing/mocks';

import * as parametersActions from '../../actions/parameters/parameters.actions';
import {
  initialState,
  parameterReducer,
  ParameterState,
  reducer,
} from './parameter.reducer';

describe('Parameter Reducer', () => {
  describe('Reducer function', () => {
    it('should return parameterReducer', () => {
      // prepare any action
      const action: Action = parametersActions.patchParameters({
        parameters: undefined,
      });
      expect(reducer(initialState, action)).toEqual(
        parameterReducer(initialState, action)
      );
    });
  });

  describe('patchParameters Action', () => {
    it('should patch all parameters', () => {
      const mockParameters: ParameterState = {
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
      } as ParameterState;

      const newState = parameterReducer(
        initialState,
        parametersActions.patchParameters({ parameters: mockParameters })
      );

      expect(newState).toEqual({ ...mockParameters, updating: true });
    });

    it('should patch partial parameters', () => {
      const mockParameters: ParameterState = {
        loads: {
          radial: 10,
          axial: 10,
        },
      } as ParameterState;

      const newState = parameterReducer(
        initialState,
        parametersActions.patchParameters({ parameters: mockParameters })
      );

      expect(newState.loads.axial).toEqual(10);
      expect(newState.loads.radial).toEqual(10);
    });
  });

  describe('modelUpdateSuccess Action', () => {
    it('should set updating to false when params are updated', () => {
      const newState = parameterReducer(
        initialState,
        parametersActions.modelUpdateSuccess()
      );

      expect(newState).toEqual({ ...initialState, updating: false });
    });
  });

  describe('getPropertiesSuccess Action', () => {
    it('should set the properties for the model', () => {
      const newState = parameterReducer(
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
      const newState = parameterReducer(
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
      const newState = parameterReducer(
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
      const newState = parameterReducer(
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
      const newState = parameterReducer(
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
      const newState = parameterReducer(
        initialState,
        parametersActions.resetPreferredGreaseSelection()
      );

      expect(newState).toEqual(initialState);
    });
  });
});
