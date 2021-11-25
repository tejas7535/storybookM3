import { Action } from '@ngrx/store';

import { initialState, organizationalViewReducer, reducer } from '.';
import {
  AttritionOverTime,
  Employee,
  EmployeesRequest,
} from '../../shared/models';
import { ChartType } from '../models/chart-type.enum';
import { CountryData } from '../world-map/models/country-data.model';
import {
  chartTypeSelected,
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartFailure,
  loadAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from './actions/organizational-view.action';

describe('Organization View Reducer', () => {
  const errorMessage = 'An error occured';

  describe('chartTypeSelected', () => {
    test('should set chart type', () => {
      const action = chartTypeSelected({
        chartType: ChartType.WORLD_MAP,
      });
      const state = organizationalViewReducer(initialState, action);

      expect(state.selectedChart).toEqual(ChartType.WORLD_MAP);
    });
  });
  describe('loadOrgChart', () => {
    test('should set loading', () => {
      const action = loadOrgChart({
        request: {} as unknown as EmployeesRequest,
      });
      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.loading).toBeTruthy();
    });
  });

  describe('loadOrgChartSuccess', () => {
    test('should unset loading and set employees', () => {
      const employees: Employee[] = [{} as unknown as Employee];

      const action = loadOrgChartSuccess({ employees });

      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.loading).toBeFalsy();
      expect(state.orgChart.data).toEqual(employees);
    });
  });

  describe('loadOrgChartFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOrgChartFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = organizationalViewReducer(fakeState, action);

      expect(state.orgChart.loading).toBeFalsy();
      expect(state.orgChart.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadWorldMap', () => {
    test('should set loading', () => {
      const action = loadWorldMap({
        request: {} as unknown as EmployeesRequest,
      });
      const state = organizationalViewReducer(initialState, action);

      expect(state.worldMap.loading).toBeTruthy();
    });
  });

  describe('loadWorldMapSuccess', () => {
    test('should unset loading and set country data', () => {
      const data: CountryData[] = [{} as unknown as CountryData];

      const action = loadWorldMapSuccess({ data });

      const state = organizationalViewReducer(initialState, action);

      expect(state.worldMap.loading).toBeFalsy();
      expect(state.worldMap.data).toEqual(data);
    });
  });

  describe('loadWorldMapFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadWorldMapFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = organizationalViewReducer(fakeState, action);

      expect(state.worldMap.loading).toBeFalsy();
      expect(state.worldMap.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadAttritionOverTimeOrgChart', () => {
    test('should set loading', () => {
      const action = loadAttritionOverTimeOrgChart({
        request: {} as unknown as EmployeesRequest,
      });
      const state = organizationalViewReducer(initialState, action);

      expect(state.attritionOverTime.loading).toBeTruthy();
    });
  });

  describe('loadAttritionOverTimeOrgChartSuccess', () => {
    test('should unset loading and set country data', () => {
      const data: AttritionOverTime = {} as unknown as AttritionOverTime;

      const action = loadAttritionOverTimeOrgChartSuccess({ data });

      const state = organizationalViewReducer(initialState, action);

      expect(state.attritionOverTime.loading).toBeFalsy();
      expect(state.attritionOverTime.data).toEqual(data);
    });
  });

  describe('loadAttritionOverTimeOrgChartFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadAttritionOverTimeOrgChartFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        attritionOverTime: {
          ...initialState.attritionOverTime,
          loading: true,
        },
      };

      const state = organizationalViewReducer(fakeState, action);

      expect(state.attritionOverTime.loading).toBeFalsy();
      expect(state.attritionOverTime.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadParent', () => {
    test('should set loading', () => {
      const employee = {} as unknown as Employee;
      const action = loadParent({ employee });
      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.loading).toBeTruthy();
    });
  });

  describe('loadParentSuccess', () => {
    test('should do nothing', () => {
      const employee = {} as unknown as Employee;
      const action = loadParentSuccess({ employee });

      const state = organizationalViewReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('loadParentFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadParentFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        orgChart: {
          ...initialState.orgChart,
          loading: true,
        },
      };

      const state = organizationalViewReducer(fakeState, action);

      expect(state.orgChart.loading).toBeFalsy();
      expect(state.orgChart.errorMessage).toEqual(errorMessage);
    });
  });

  describe('Reducer function', () => {
    test('should return organizationalViewReducer', () => {
      // prepare any action
      const action: Action = { type: 'Test' };
      expect(reducer(initialState, action)).toEqual(
        organizationalViewReducer(initialState, action)
      );
    });
  });
});
