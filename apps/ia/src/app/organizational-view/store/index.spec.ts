import { Action } from '@ngrx/store';

import { initialState, organizationalViewReducer, reducer } from '.';
import { EmployeesRequest } from '../../shared/models';
import { ChartType } from '../models/chart-type.enum';
import { OrgChartEmployee } from '../org-chart/models/org-chart-employee.model';
import { CountryData } from '../world-map/models/country-data.model';
import {
  chartTypeSelected,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
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
        request: ({} as unknown) as EmployeesRequest,
      });
      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.loading).toBeTruthy();
    });
  });

  describe('loadOrgChartSuccess', () => {
    test('should unset loading and set employees', () => {
      const employees: OrgChartEmployee[] = [
        ({} as unknown) as OrgChartEmployee,
      ];

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
        request: ({} as unknown) as EmployeesRequest,
      });
      const state = organizationalViewReducer(initialState, action);

      expect(state.worldMap.loading).toBeTruthy();
    });
  });

  describe('loadWorldMapSuccess', () => {
    test('should unset loading and set country data', () => {
      const data: CountryData[] = [({} as unknown) as CountryData];

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
