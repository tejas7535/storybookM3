import { Action } from '@ngrx/store';

import { AttritionOverTime, EmployeesRequest } from '../../shared/models';
import { ChartType } from '../models/chart-type.enum';
import { DimensionFluctuationData } from '../models/dimension-fluctuation-data.model';
import {
  DimensionParentResponse,
  OrgUnitFluctuationRate,
} from '../org-chart/models';
import { CountryData } from '../world-map/models/country-data.model';
import { initialState, organizationalViewReducer, reducer } from '.';
import {
  chartTypeSelected,
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartFailure,
  loadAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartFluctuationMeta,
  loadOrgChartFluctuationRate,
  loadOrgChartFluctuationRateFailure,
  loadOrgChartFluctuationRateSuccess,
  loadOrgChartSuccess,
  loadParent,
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

  describe('loadOrgUnitFluctuationRate', () => {
    test('should set loading', () => {
      const action = loadOrgChartFluctuationRate({
        request: {} as unknown as EmployeesRequest,
      });
      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.fluctuationRates.loading).toBeTruthy();
    });
  });

  describe('loadOrgUnitFluctuationRateSuccess', () => {
    test('should unset loading and add rate', () => {
      const rate = {} as OrgUnitFluctuationRate;

      const action = loadOrgChartFluctuationRateSuccess({ rate });

      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.fluctuationRates.loading).toBeFalsy();
      expect(state.orgChart.fluctuationRates.data).toContain(rate);
    });
  });

  describe('loadOrgUnitFluctuationRateFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOrgChartFluctuationRateFailure({ errorMessage });

      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.fluctuationRates.loading).toBeFalsy();
      expect(state.orgChart.fluctuationRates.errorMessage).toEqual(
        errorMessage
      );
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

  describe('loadOrgChartFluctuationMeta', () => {
    test('should unset loading and set employee id', () => {
      const data = { id: '123' } as unknown as DimensionFluctuationData;
      const action = loadOrgChartFluctuationMeta({
        data,
      });
      const state = organizationalViewReducer(initialState, action);

      expect(state.orgChart.fluctuationRates.loading).toBeFalsy();
      expect(state.orgChart.fluctuationRates.selectedEmployeeId).toEqual(
        data.id
      );
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
        request: { value: 'ACS' } as EmployeesRequest,
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
