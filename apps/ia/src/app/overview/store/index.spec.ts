import { Action } from '@ngrx/store';

import { AttritionOverTime, EmployeesRequest } from '../../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
  OverviewFluctuationRates,
  ResignedEmployee,
} from '../models';
import { initialState, overviewReducer, OverviewState, reducer } from '.';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesOverviewSuccess,
  loadOpenApplications,
  loadOpenApplicationsFailure,
  loadOpenApplicationsSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
} from './actions/overview.action';

describe('Overview Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadAttritionOverTimeOverview', () => {
    test('should set loading', () => {
      const action = loadAttritionOverTimeOverview({
        orgUnit: 'ACB',
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

  describe('loadFluctuationRatesChartData', () => {
    test('should set loading', () => {
      const action = loadFluctuationRatesChartData({
        request: {} as unknown as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.fluctuationRates.loading).toBeTruthy();
    });
  });

  describe('loadFluctuationRatesChartDataSuccess', () => {
    test('should unset loading and set fluctuation rates data', () => {
      const data: FluctuationRatesChartData =
        {} as unknown as FluctuationRatesChartData;

      const action = loadFluctuationRatesChartDataSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.fluctuationRates.loading).toBeFalsy();
      expect(state.fluctuationRates.data).toEqual(data);
    });
  });

  describe('loadFluctuationRatesChartDataFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadFluctuationRatesChartDataFailure({ errorMessage });
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

  describe('loadOverviewFluctuationRates', () => {
    test('should set loading', () => {
      const action = loadFluctuationRatesOverview({
        request: {} as unknown as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.entriesExits.loading).toBeTruthy();
    });
  });

  describe('loadOverviewFluctuationRatesSuccess', () => {
    test('should unset loading and set fluctuation data', () => {
      const data: OverviewFluctuationRates =
        {} as unknown as OverviewFluctuationRates;

      const action = loadFluctuationRatesOverviewSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.entriesExits.loading).toBeFalsy();
      expect(state.entriesExits.data).toEqual(data);
    });
  });

  describe('loadOverviewFluctuationRatesSuccessFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadFluctuationRatesOverviewFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        entriesExits: {
          ...initialState.entriesExits,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.entriesExits.loading).toBeFalsy();
      expect(state.entriesExits.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadResignedEmployees', () => {
    test('should set loading', () => {
      const action = loadResignedEmployees({
        orgUnit: 'ABC',
      });
      const state = overviewReducer(initialState, action);

      expect(state.resignedEmployees.loading).toBeTruthy();
    });
  });

  describe('loadResignedEmployeesSuccess', () => {
    test('should unset loading and set resigned employees', () => {
      const data: ResignedEmployee[] = [];

      const action = loadResignedEmployeesSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.resignedEmployees.loading).toBeFalsy();
      expect(state.resignedEmployees.data).toEqual(data);
    });
  });

  describe('loadResignedEmployeesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadResignedEmployeesFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        resignedEmployees: {
          ...initialState.resignedEmployees,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.resignedEmployees.loading).toBeFalsy();
      expect(state.resignedEmployees.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadOpenApplications', () => {
    test('should set loading', () => {
      const action = loadOpenApplications({
        orgUnit: 'ABC',
      });
      const state = overviewReducer(initialState, action);

      expect(state.openApplications.loading).toBeTruthy();
    });
  });

  describe('loadOpenApplicationsSuccess', () => {
    test('should unset loading and set open applications', () => {
      const data: OpenApplication[] = [];

      const action = loadOpenApplicationsSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.openApplications.loading).toBeFalsy();
      expect(state.openApplications.data).toEqual(data);
    });
  });

  describe('loadOpenApplicationsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOpenApplicationsFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        openApplications: {
          ...initialState.openApplications,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.openApplications.loading).toBeFalsy();
      expect(state.openApplications.errorMessage).toEqual(errorMessage);
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
