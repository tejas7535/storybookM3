import { Action } from '@ngrx/store';

import { AttritionOverTime, EmployeesRequest } from '../../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
  OverviewExitEntryEmployeesResponse,
  OverviewFluctuationRates,
  ResignedEmployeesResponse,
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
  loadOpenApplicationsCount,
  loadOpenApplicationsCountFailure,
  loadOpenApplicationsCountSuccess,
  loadOpenApplicationsFailure,
  loadOpenApplicationsSuccess,
  loadOverviewEntryEmployees,
  loadOverviewEntryEmployeesFailure,
  loadOverviewEntryEmployeesSuccess,
  loadOverviewExitEmployees,
  loadOverviewExitEmployeesFailure,
  loadOverviewExitEmployeesSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
} from './actions/overview.action';

describe('Overview Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadAttritionOverTimeOverview', () => {
    test('should set loading', () => {
      const action = loadAttritionOverTimeOverview({
        request: { value: 'ACB' } as EmployeesRequest,
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

  describe('loadFluctuationRatesOverview', () => {
    test('should set loading', () => {
      const action = loadFluctuationRatesOverview({
        request: {} as unknown as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.entriesExitsMeta.loading).toBeTruthy();
    });
  });

  describe('loadFluctuationRatesOverviewSuccess', () => {
    test('should unset loading and set fluctuation data', () => {
      const data: OverviewFluctuationRates =
        {} as unknown as OverviewFluctuationRates;

      const action = loadFluctuationRatesOverviewSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.entriesExitsMeta.loading).toBeFalsy();
      expect(state.entriesExitsMeta.data).toEqual(data);
    });
  });

  describe('loadFluctuationRatesOverviewFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadFluctuationRatesOverviewFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        entriesExitsMeta: {
          ...initialState.entriesExitsMeta,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.entriesExitsMeta.loading).toBeFalsy();
      expect(state.entriesExitsMeta.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadResignedEmployees', () => {
    test('should set loading', () => {
      const action = loadResignedEmployees({
        request: { value: 'abc' } as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.resignedEmployees.loading).toBeTruthy();
    });
  });

  describe('loadResignedEmployeesSuccess', () => {
    test('should unset loading and set resigned employees', () => {
      const data: ResignedEmployeesResponse = {
        employees: [],
        resignedEmployeesCount: 5,
        responseModified: true,
      };

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
      const action = loadOpenApplications();
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

  describe('loadOverviewExitEmployees', () => {
    test('should set loading', () => {
      const action = loadOverviewExitEmployees();
      const state = overviewReducer(initialState, action);

      expect(state.exitEmployees.loading).toBeTruthy();
    });
  });

  describe('loadOverviewExitEmployeesSuccess', () => {
    test('should unset loading and set exit employees', () => {
      const data: OverviewExitEntryEmployeesResponse =
        {} as unknown as OverviewExitEntryEmployeesResponse;

      const action = loadOverviewExitEmployeesSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.exitEmployees.loading).toBeFalsy();
      expect(state.exitEmployees.data).toEqual(data);
    });
  });

  describe('loadOverviewExitEmployeesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOverviewExitEmployeesFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        exitEmployees: {
          ...initialState.exitEmployees,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.exitEmployees.loading).toBeFalsy();
      expect(state.exitEmployees.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadOverviewEntryEmployees', () => {
    test('should set loading', () => {
      const action = loadOverviewEntryEmployees();
      const state = overviewReducer(initialState, action);

      expect(state.entryEmployees.loading).toBeTruthy();
    });
  });

  describe('loadOverviewEntryEmployeesSuccess', () => {
    test('should unset loading and set entry employees', () => {
      const data: OverviewExitEntryEmployeesResponse =
        {} as unknown as OverviewExitEntryEmployeesResponse;

      const action = loadOverviewEntryEmployeesSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.entryEmployees.loading).toBeFalsy();
      expect(state.entryEmployees.data).toEqual(data);
    });
  });

  describe('loadOverviewEntryEmployeesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOverviewEntryEmployeesFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        entryEmployees: {
          ...initialState.entryEmployees,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.entryEmployees.loading).toBeFalsy();
      expect(state.entryEmployees.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadOpenApplicationsCount', () => {
    test('should set loading', () => {
      const action = loadOpenApplicationsCount({
        request: {} as unknown as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.openApplicationsCount.loading).toBeTruthy();
    });
  });

  describe('loadOpenApplicationsCountSuccess', () => {
    test('should unset loading and set open applications count', () => {
      const openApplicationsCount = 5;

      const action = loadOpenApplicationsCountSuccess({
        openApplicationsCount,
      });

      const state = overviewReducer(initialState, action);

      expect(state.openApplicationsCount.loading).toBeFalsy();
      expect(state.openApplicationsCount.data).toEqual(openApplicationsCount);
    });
  });

  describe('loadOpenApplicationsCountFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOpenApplicationsCountFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        openApplicationsCount: {
          ...initialState.openApplicationsCount,
          loading: true,
          data: 80,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.openApplicationsCount.data).toBeUndefined();
      expect(state.openApplicationsCount.loading).toBeFalsy();
      expect(state.openApplicationsCount.errorMessage).toEqual(errorMessage);
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
