import { Action } from '@ngrx/store';

import { initialState, overviewReducer, OverviewState, reducer } from '.';
import { AttritionOverTime, EmployeesRequest } from '../../shared/models';
import { OverviewFluctuationRates } from '../../shared/models/overview-fluctuation-rates';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesOverviewSuccess,
} from './actions/overview.action';

describe('Overview Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadAttritionOverTimeOverview', () => {
    test('should set loading', () => {
      const action = loadAttritionOverTimeOverview({
        request: {} as unknown as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.attritionOverTime.loading).toBeTruthy();
    });
  });

  describe('loadAttritionOverTimeOverviewSuccess', () => {
    test('should unset loading and set country data', () => {
      const data: AttritionOverTime = {} as unknown as AttritionOverTime;

      const action = loadAttritionOverTimeOverviewSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.attritionOverTime.loading).toBeFalsy();
      expect(state.attritionOverTime.data).toEqual(data);
    });
  });

  describe('loadAttritionOverTimeOverviewFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadAttritionOverTimeOverviewFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        attritionOverTime: {
          ...initialState.attritionOverTime,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.attritionOverTime.loading).toBeFalsy();
      expect(state.attritionOverTime.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadOverviewFluctuationRates', () => {
    test('should set loading', () => {
      const action = loadFluctuationRatesOverview({
        request: {} as unknown as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.fluctuationRates.loading).toBeTruthy();
    });
  });

  describe('loadOverviewFluctuationRatesSuccess', () => {
    test('should unset loading and set fluctuation data', () => {
      const data: OverviewFluctuationRates =
        {} as unknown as OverviewFluctuationRates;

      const action = loadFluctuationRatesOverviewSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.fluctuationRates.loading).toBeFalsy();
      expect(state.fluctuationRates.data).toEqual(data);
    });
  });

  describe('loadOverviewFluctuationRatesSuccessFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadFluctuationRatesOverviewFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        fluctuationRates: {
          ...initialState.fluctuationRates,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.fluctuationRates.loading).toBeFalsy();
      expect(state.fluctuationRates.errorMessage).toEqual(errorMessage);
    });
  });

  describe('Reducer function', () => {
    test('should return overviewReducer', () => {
      // prepare any action
      const action: Action = { type: 'Test' };
      expect(reducer(initialState, action)).toEqual(
        overviewReducer(initialState, action)
      );
    });
  });
});
