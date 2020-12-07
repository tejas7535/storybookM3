import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { IdValue } from '../../shared/models';
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
} from './actions/overview.action';

export const overviewFeatureKey = 'overview';

export interface OverviewState {
  orgChart: OrgChartEmployee[];
  worldMap: {
    data: CountryData[];
    continents: IdValue[];
  };
  loading: boolean;
  errorMessage: string;
  selectedChart: ChartType;
}

export const initialState: OverviewState = {
  orgChart: [],
  worldMap: {
    data: [],
    // Hardcoded for PoC
    continents: [
      {
        id: 'europe',
        value: 'Europe',
      },
      {
        id: 'asia',
        value: 'Asia Pacific',
      },
      {
        id: 'americas',
        value: 'Americas',
      },
    ],
  },
  loading: false,
  errorMessage: undefined,
  selectedChart: ChartType.ORG_CHART,
};

export const overviewReducer = createReducer(
  initialState,
  on(chartTypeSelected, (state: OverviewState, { chartType }) => ({
    ...state,
    selectedChart: chartType,
  })),
  on(loadOrgChart, (state: OverviewState) => ({
    ...state,
    loading: true,
  })),
  on(loadOrgChartSuccess, (state: OverviewState, { employees }) => ({
    ...state,
    orgChart: employees,
    loading: false,
  })),
  on(loadOrgChartFailure, (state: OverviewState, { errorMessage }) => ({
    ...state,
    errorMessage,
    orgChart: [],
    loading: false,
  })),
  on(loadWorldMap, (state: OverviewState) => ({
    ...state,
    loading: true,
  })),
  on(loadWorldMapSuccess, (state: OverviewState, { data }) => ({
    ...state,
    worldMap: {
      ...state.worldMap,
      data,
    },
    loading: false,
  })),
  on(loadWorldMapFailure, (state: OverviewState, { errorMessage }) => ({
    ...state,
    errorMessage,
    worldMap: {
      ...state.worldMap,
      data: [],
    },
    loading: false,
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: OverviewState, action: Action): OverviewState {
  return overviewReducer(state, action);
}

export const selectOverviewState = createFeatureSelector<OverviewState>(
  overviewFeatureKey
);
