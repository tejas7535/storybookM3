import { Action } from '@ngrx/store';

import {
  getData,
  getDataFailure,
  getDataSuccess,
  setDataInterval,
  setFrequency,
} from '../../actions/data-view/data-view.actions';
import { dataViewReducer, initialState, reducer } from './data-view.reducer';

describe('Condition Monitoring Reducer', () => {
  describe('getData', () => {
    test('should set loading', () => {
      const action = getData({ deviceId: 'fantasyId' });
      const state = dataViewReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getDataSuccess', () => {
    test('should unset loading and set result', () => {
      const mockResult = [
        {
          type: 'Load',
          description: 'Radial Load y',
          abreviation: 'F_y',
          actualValue: 1635.0,
          minValue: 1700.0,
          maxValue: 1900.0,
        },
      ];
      const action = getDataSuccess({ result: mockResult });

      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = dataViewReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
      expect(state.result).toEqual(mockResult);
    });
  });

  describe('getDataFailure', () => {
    test('should unset loading', () => {
      const action = getDataFailure();
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = dataViewReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('setDataInterval', () => {
    test('should set interval', () => {
      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };
      const action = setDataInterval({ interval: mockInterval });

      const fakeState = {
        ...initialState,
        interval: mockInterval,
      };

      const state = dataViewReducer(fakeState, action);

      expect(state.interval).toEqual(mockInterval);
    });
  });

  describe('setFrequency', () => {
    test('should set frequency', () => {
      const mockFrequency = 1000;
      const action = setFrequency({ frequency: mockFrequency });

      const fakeState = {
        ...initialState,
        frequency: mockFrequency,
      };

      const state = dataViewReducer(fakeState, action);

      expect(state.frequency).toEqual(mockFrequency);
    });
  });

  describe('Reducer function', () => {
    test('should return dataViewReducer', () => {
      // prepare any action
      const action: Action = getDataFailure();
      expect(reducer(initialState, action)).toEqual(
        dataViewReducer(initialState, action)
      );
    });
  });
});
