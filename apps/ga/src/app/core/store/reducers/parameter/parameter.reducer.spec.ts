import { Action } from '@ngrx/store';

import { MOCK_PROPERTIES } from '@ga/testing/mocks';

import { EnvironmentImpact, LoadLevels } from '../../../../shared/models';
import { Movement } from './../../../../shared/models/parameters/movement.model';
import {
  getPropertiesSuccess,
  modelUpdateSuccess,
  patchParameters,
} from './../../actions/parameters/parameters.actions';
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
      const action: Action = patchParameters({ parameters: {} });
      expect(reducer(initialState, action)).toEqual(
        parameterReducer(initialState, action)
      );
    });
  });

  describe('patchParameters Action', () => {
    it('should patch all parameters', () => {
      const parameters: ParameterState = {
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
        greaseEnabled: true,
        grease: {
          greaseList: ['grease 1'],
          selectedGrease: 'grease 1',
          maxTemperature: 20,
          viscosity: 10,
          nlgiClass: 1,
        },
        valid: true,
        updating: false,
      };

      const newState = parameterReducer(
        initialState,
        patchParameters({ parameters })
      );

      expect(newState).toEqual({ ...parameters, updating: true });
    });

    it('should patch partial parameters', () => {
      const parameters: ParameterState = {
        loads: {
          radial: 10,
          axial: 10,
        },
      };

      const newState = parameterReducer(
        initialState,
        patchParameters({ parameters })
      );

      expect(newState.loads.axial).toEqual(10);
      expect(newState.loads.radial).toEqual(10);
    });
  });

  describe('modelUpdateSuccess Action', () => {
    it('should set updating to false when params are updated', () => {
      const newState = parameterReducer(initialState, modelUpdateSuccess());

      expect(newState).toEqual({ ...initialState, updating: false });
    });
  });

  describe('getPropertiesSuccess Action', () => {
    it('should set the properties for the model', () => {
      const newState = parameterReducer(
        initialState,
        getPropertiesSuccess({ properties: MOCK_PROPERTIES })
      );

      expect(newState).toEqual({
        ...initialState,
        properties: MOCK_PROPERTIES,
      });
    });
  });
});
