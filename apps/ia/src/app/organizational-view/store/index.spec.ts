import { Action } from '@ngrx/store';

import {
  EmployeesRequest,
  FilterDimension,
  MonthlyFluctuation,
} from '../../shared/models';
import { ChartType, DimensionFluctuationData } from '../models';
import { DimensionParentResponse, OrgChartEmployee } from '../org-chart/models';
import { CountryDataAttrition } from '../world-map/models/country-data-attrition.model';
import { initialState, organizationalViewReducer, reducer } from '.';
import {
  chartTypeSelected,
  loadChildAttritionOverTimeOrgChart,
  loadChildAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartEmployees,
  loadOrgChartEmployeesFailure,
  loadOrgChartEmployeesSuccess,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentAttritionOverTimeOrgChart,
  loadParentAttritionOverTimeOrgChartFailure,
  loadParentAttritionOverTimeOrgChartSuccess,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapFluctuationCountryMeta,
  loadWorldMapFluctuationRegionMeta,
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
      const data: DimensionFluctuationData[] = [
        {} as unknown as DimensionFluctuationData,
      ];

      const action = loadOrgChartSuccess({ data });

      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.loading).toBeFalsy();
      expect(state.orgChart.data).toEqual(data);
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

  describe('loadWorldMapFluctuationRegionMeta', () => {
    test('should toggle selected country/continent', () => {
      const region = 'Europe';
      const action = loadWorldMapFluctuationRegionMeta({ region });

      const state = organizationalViewReducer(initialState, action);

      expect(state.worldMap.selectedRegion).toEqual(region);
      expect(state.worldMap.selectedCountry).toBeUndefined();
    });
  });

  describe('loadWorldMapFluctuationCountryMeta', () => {
    test('should toggle selected country/region', () => {
      const country = 'Germany';
      const action = loadWorldMapFluctuationCountryMeta({ country });

      const state = organizationalViewReducer(initialState, action);

      expect(state.worldMap.selectedCountry).toEqual(country);
      expect(state.worldMap.selectedRegion).toBeUndefined();
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
      const data: CountryDataAttrition[] = [
        {} as unknown as CountryDataAttrition,
      ];

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

  describe('loadParentAttritionOverTimeOrgChart', () => {
    test('should set loading', () => {
      const dimensionName = 'SH/ZHZ';
      const action = loadParentAttritionOverTimeOrgChart({
        request: { value: 'ACS' } as EmployeesRequest,
        dimensionName,
      });
      const state = organizationalViewReducer(initialState, action);

      expect(state.attritionOverTime.parent.loading).toBeTruthy();
    });
  });

  describe('loadParentAttritionOverTimeOrgChartSuccess', () => {
    test('should unset loading and set country data', () => {
      const monthlyFluctuation = {} as unknown as MonthlyFluctuation;

      const action = loadParentAttritionOverTimeOrgChartSuccess({
        monthlyFluctuation,
      });

      const state = organizationalViewReducer(initialState, action);

      expect(state.attritionOverTime.parent.loading).toBeFalsy();
      expect(state.attritionOverTime.parent.data).toEqual(monthlyFluctuation);
    });
  });

  describe('loadChildAttritionOverTimeOrgChart', () => {
    test('should set loading', () => {
      const dimensionName = 'SH/ZHZ';
      const filterDimension = FilterDimension.COUNTRY;
      const dimensionKey = 'SH/ZHZ';

      const action = loadChildAttritionOverTimeOrgChart({
        filterDimension,
        dimensionKey,
        dimensionName,
      });
      const state = organizationalViewReducer(initialState, action);

      expect(state.attritionOverTime.child.loading).toBeTruthy();
    });
  });

  describe('loadChildAttritionOverTimeOrgChartSuccess', () => {
    test('should unset loading and set country data', () => {
      const monthlyFluctuation = {} as unknown as MonthlyFluctuation;

      const action = loadChildAttritionOverTimeOrgChartSuccess({
        monthlyFluctuation,
      });

      const state = organizationalViewReducer(initialState, action);

      expect(state.attritionOverTime.child.loading).toBeFalsy();
      expect(state.attritionOverTime.child.data).toEqual(monthlyFluctuation);
    });
  });

  describe('loadParentAttritionOverTimeOrgChartFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadParentAttritionOverTimeOrgChartFailure({
        errorMessage,
      });
      const fakeState = {
        ...initialState,
        attritionOverTime: {
          ...initialState.attritionOverTime,
          loading: true,
        },
      };

      const state = organizationalViewReducer(fakeState, action);

      expect(state.attritionOverTime.parent.loading).toBeFalsy();
      expect(state.attritionOverTime.parent.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadParent', () => {
    test('should set loading', () => {
      const data = {} as unknown as DimensionFluctuationData;
      const action = loadParent({ data });
      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.loading).toBeTruthy();
    });
  });

  describe('loadParentSuccess', () => {
    test('should do nothing', () => {
      const idValue = {} as unknown as DimensionParentResponse;
      const action = loadParentSuccess({ response: idValue });

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

  describe('loadOrgChartEmployees', () => {
    test('should set loading', () => {
      const data = { id: '123' } as unknown as DimensionFluctuationData;
      const action = loadOrgChartEmployees({ data });
      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.employees.loading).toBeTruthy();
    });
  });

  describe('loadOrgChartEmployeesSuccess', () => {
    test('should unset loading and set data', () => {
      const employees = [] as OrgChartEmployee[];
      const action = loadOrgChartEmployeesSuccess({ employees });

      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.employees.data).toEqual(employees);
      expect(state.orgChart.employees.loading).toBeFalsy();
    });
  });

  describe('loadOrgChartEmployeesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOrgChartEmployeesFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        orgChart: {
          ...initialState.orgChart,
          loading: true,
          employees: {
            ...initialState.orgChart.employees,
            loading: true,
          },
        },
      };

      const state = organizationalViewReducer(fakeState, action);

      expect(state.orgChart.employees.loading).toBeFalsy();
      expect(state.orgChart.employees.errorMessage).toEqual(errorMessage);
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
