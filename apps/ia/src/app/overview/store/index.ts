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
  loadParent,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from './actions/overview.action';

export const overviewFeatureKey = 'overview';

export interface OverviewState {
  orgChart: {
    data: OrgChartEmployee[];
    loading: boolean;
    errorMessage: string;
  };
  worldMap: {
    data: CountryData[];
    continents: IdValue[];
    loading: boolean;
    errorMessage: string;
  };
  selectedChart: ChartType;
}

export const initialState: OverviewState = {
  orgChart: {
    data: [],
    loading: false,
    errorMessage: undefined,
  },
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
    loading: false,
    errorMessage: undefined,
  },
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
    orgChart: {
      ...state.orgChart,
      loading: true,
    },
  })),
  on(loadOrgChartSuccess, (state: OverviewState, { employees }) => ({
    ...state,
    orgChart: {
      ...state.orgChart,
      data: employees,
      loading: false,
    },
  })),
  on(loadOrgChartFailure, (state: OverviewState, { errorMessage }) => ({
    ...state,
    errorMessage,
    orgChart: {
      ...state.orgChart,
      errorMessage,
      data: [],
      loading: false,
    },
  })),
  on(loadWorldMap, (state: OverviewState) => ({
    ...state,
    worldMap: {
      ...state.worldMap,
      loading: true,
    },
  })),
  on(loadWorldMapSuccess, (state: OverviewState, { data }) => ({
    ...state,
    worldMap: {
      ...state.worldMap,
      data,
      loading: false,
    },
  })),
  on(loadWorldMapFailure, (state: OverviewState, { errorMessage }) => ({
    ...state,
    worldMap: {
      ...state.worldMap,
      errorMessage,
      data: [],
      loading: false,
    },
  })),
  on(loadParent, (state: OverviewState) => ({
    ...state,
    orgChart: {
      ...state.orgChart,
      loading: true,
    },
  })),
  // result is not saved in store -> loading should not stop as the process of loading the new org chart is still ongoing
  on(loadParentSuccess, (state: OverviewState) => ({
    ...state,
  })),
  on(loadParentFailure, (state: OverviewState, { errorMessage }) => ({
    ...state,
    orgChart: {
      ...state.orgChart,
      errorMessage,
      data: [],
      loading: false,
    },
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: OverviewState, action: Action): OverviewState {
  return overviewReducer(state, action);
}

export const selectOverviewState = createFeatureSelector<OverviewState>(
  overviewFeatureKey
);
