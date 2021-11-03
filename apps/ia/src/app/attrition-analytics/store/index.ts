import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { EmployeeAnalytics } from '../models/employee-analytics.model';
import { FeatureParams } from '../models/feature-params.model';
import {
  changeOrderOfFeatures,
  changeSelectedFeatures,
  loadAvailableFeatures,
  loadAvailableFeaturesFailure,
  loadAvailableFeaturesSuccess,
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
} from './actions/attrition-analytics.action';

export const attrtionAnalyticsFeatureKey = 'attritionAnalytics';

export interface AttritionAnalyticsState {
  employeeAnalytics: {
    features: {
      data: EmployeeAnalytics[];
      loading: boolean;
      errorMessage: string;
    };
    availableFeatures: {
      data: FeatureParams[];
      loading: boolean;
      errorMessage: string;
    };
  };
  selectedByUser: {
    features: FeatureParams[];
  };
}

export const initialState: AttritionAnalyticsState = {
  employeeAnalytics: {
    features: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
    availableFeatures: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
  },
  selectedByUser: {
    features: undefined,
  },
};

export const attritionAnalyticsReducer = createReducer(
  initialState,
  on(
    loadEmployeeAnalytics,
    (state: AttritionAnalyticsState): AttritionAnalyticsState => ({
      ...state,
      employeeAnalytics: {
        features: {
          ...state.employeeAnalytics.features,
          loading: true,
        },
        availableFeatures: {
          ...state.employeeAnalytics.availableFeatures,
        },
      },
    })
  ),
  on(
    loadEmployeeAnalyticsSuccess,
    (state: AttritionAnalyticsState, { data }): AttritionAnalyticsState => ({
      ...state,
      employeeAnalytics: {
        features: {
          ...state.employeeAnalytics.features,
          data,
          loading: false,
        },
        availableFeatures: {
          ...state.employeeAnalytics.availableFeatures,
        },
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
        features: {
          ...state.employeeAnalytics.features,
          data: undefined,
          loading: false,
          errorMessage,
        },
        availableFeatures: {
          ...state.employeeAnalytics.availableFeatures,
        },
      },
    })
  ),
  on(
    changeSelectedFeatures,
    (
      state: AttritionAnalyticsState,
      { features: employeeAnalyticsFeatures }
    ): AttritionAnalyticsState => ({
      ...state,
      selectedByUser: {
        ...state.selectedByUser,
        features: employeeAnalyticsFeatures,
      },
    })
  ),
  on(
    changeOrderOfFeatures,
    (
      state: AttritionAnalyticsState,
      { features: employeeAnalyticsFeatures }
    ): AttritionAnalyticsState => ({
      ...state,
      selectedByUser: {
        ...state.selectedByUser,
        features: employeeAnalyticsFeatures,
      },
    })
  ),
  on(
    loadAvailableFeatures,
    (state: AttritionAnalyticsState): AttritionAnalyticsState => ({
      ...state,
      employeeAnalytics: {
        ...state.employeeAnalytics,
        availableFeatures: {
          ...state.employeeAnalytics.availableFeatures,
          loading: true,
        },
      },
    })
  ),
  on(
    loadAvailableFeaturesSuccess,
    (state: AttritionAnalyticsState, { data }): AttritionAnalyticsState => ({
      ...state,
      employeeAnalytics: {
        ...state.employeeAnalytics,
        availableFeatures: {
          ...state.employeeAnalytics.availableFeatures,
          data,
          loading: false,
        },
      },
    })
  ),
  on(
    loadAvailableFeaturesFailure,
    (
      state: AttritionAnalyticsState,
      { errorMessage }
    ): AttritionAnalyticsState => ({
      ...state,
      employeeAnalytics: {
        ...state.employeeAnalytics,
        availableFeatures: {
          ...state.employeeAnalytics.availableFeatures,
          errorMessage,
          loading: false,
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
