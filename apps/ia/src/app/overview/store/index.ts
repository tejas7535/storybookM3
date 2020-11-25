import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { Employee } from '../../shared/models';
import { ChartType } from '../models/chart-type.enum';
import {
  chartTypeSelected,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
} from './actions/overview.action';

export const overviewFeatureKey = 'overview';

export interface OverviewState {
  orgChart: Employee[];
  worldMap: Employee[];
  loading: boolean;
  errorMessage: string;
  selectedChart: ChartType;
}

export const initialState: OverviewState = {
  orgChart: [],
  worldMap: [],
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
    loading: false,
    orgChart: employees,
  })),
  on(loadOrgChartFailure, (state: OverviewState, { errorMessage }) => ({
    ...state,
    errorMessage,
    orgChart: [],
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
