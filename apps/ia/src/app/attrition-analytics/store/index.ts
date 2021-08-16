import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { EmployeeAnalytics } from '../models/employee-analytics.model';
import {
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
} from './actions/attrition-analytics.action';

export const attrtionAnalyticsFeatureKey = 'attritionAnalytics';

export interface AttritionAnalyticsState {
  employeeAnalytics: {
    data: EmployeeAnalytics[];
    loading: boolean;
    errorMessage: string;
  };
}

export const initialState: AttritionAnalyticsState = {
  employeeAnalytics: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
};

export const attritionAnalyticsReducer = createReducer(
  initialState,
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
        data: undefined,
        loading: false,
        errorMessage,
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
