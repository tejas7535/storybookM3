import { Action } from '@ngrx/store';

import { Movement } from './../../../../shared/models/parameters/movement.model';
import { patchParameters } from './../../actions/parameters/parameters.action';
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
          loadRatio: 1,
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
          environmentImpact: 'much',
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
      };

      const newState = parameterReducer(
        initialState,
        patchParameters({ parameters })
      );

      expect(newState).toEqual(parameters);
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
});
