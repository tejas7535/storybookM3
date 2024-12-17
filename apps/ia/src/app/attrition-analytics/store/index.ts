import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { CHART_COLOR_PALETTE } from '../../shared/models';
import { EmployeeAnalytics, EmployeeCluster } from '../models';
import {
  clearEmployeeAnalytics,
  loadAvailableClusters,
  loadAvailableClustersFailure,
  loadAvailableClustersSuccess,
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
  selectCluster,
} from './actions/attrition-analytics.action';

export const attrtionAnalyticsFeatureKey = 'attritionAnalytics';

export interface AttritionAnalyticsState {
  clusters: {
    data: {
      data: EmployeeCluster[];
      loading: boolean;
      errorMessage: string;
    };
    selected: string;
  };
  employeeAnalytics: {
    data: EmployeeAnalytics[];
    loading: boolean;
    errorMessage: string;
  };
}

export const initialState: AttritionAnalyticsState = {
  clusters: {
    data: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
    selected: undefined,
  },
  employeeAnalytics: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
};

export const attritionAnalyticsReducer = createReducer(
  initialState,
  on(
    loadAvailableClusters,
    (state: AttritionAnalyticsState): AttritionAnalyticsState => ({
      ...state,
      clusters: {
        ...state.clusters,
        data: {
          ...state.clusters.data,
          loading: true,
        },
      },
      employeeAnalytics: {
        ...state.employeeAnalytics,
        data: undefined,
      },
    })
  ),
  on(
    loadAvailableClustersSuccess,
    (state: AttritionAnalyticsState, { data }): AttritionAnalyticsState => ({
      ...state,
      clusters: {
        ...state.clusters,
        data: {
          data: data.map((d, index) => ({
            ...d,
            color: Object.values(CHART_COLOR_PALETTE)[index],
          })),
          loading: false,
          errorMessage: undefined,
        },
      },
    })
  ),
  on(
    loadAvailableClustersFailure,
    (
      state: AttritionAnalyticsState,
      { errorMessage }
    ): AttritionAnalyticsState => ({
      ...state,
      clusters: {
        ...state.clusters,
        data: {
          ...state.clusters.data,
          loading: false,
          errorMessage,
        },
      },
    })
  ),
  on(
    loadEmployeeAnalytics,
    (state: AttritionAnalyticsState): AttritionAnalyticsState => ({
      ...state,
      employeeAnalytics: {
        ...state.employeeAnalytics,
        loading: true,
      },
    })
  ),
  on(
    loadEmployeeAnalyticsSuccess,
    (state: AttritionAnalyticsState, { data }): AttritionAnalyticsState => ({
      ...state,
      employeeAnalytics: {
        ...state.employeeAnalytics,
        data,
        loading: false,
        errorMessage: undefined,
      },
    })
  ),
  on(
    loadEmployeeAnalyticsFailure,
    (
      state: AttritionAnalyticsState,
      { errorMessage }
    ): AttritionAnalyticsState => ({
      ...state,
      employeeAnalytics: {
        ...state.employeeAnalytics,
        loading: false,
        errorMessage,
      },
    })
  ),
  on(
    selectCluster,
    (state: AttritionAnalyticsState, { cluster }): AttritionAnalyticsState => ({
      ...state,
      clusters: {
        ...state.clusters,
        selected: cluster,
      },
    })
  ),
  on(
    clearEmployeeAnalytics,
    (state: AttritionAnalyticsState): AttritionAnalyticsState => ({
      ...state,
      employeeAnalytics: {
        ...state.employeeAnalytics,
        data: undefined,
      },
    })
  )
);

export function reducer(
  state: AttritionAnalyticsState,
  action: Action
): AttritionAnalyticsState {
  return attritionAnalyticsReducer(state, action);
}

export const selectAttritionAnalyticsState =
  createFeatureSelector<AttritionAnalyticsState>(attrtionAnalyticsFeatureKey);
