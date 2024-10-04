import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { EmployeeCluster } from '../models';
import {
  loadAvailableClusters,
  loadAvailableClustersFailure,
  loadAvailableClustersSuccess,
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
    })
  ),
  on(
    loadAvailableClustersSuccess,
    (state: AttritionAnalyticsState, { data }): AttritionAnalyticsState => ({
      ...state,
      clusters: {
        ...state.clusters,
        data: {
          data,
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
