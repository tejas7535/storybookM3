import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
  FeatureImportanceGroup,
  Pageable,
  Sort,
  SortDirection,
} from '../models';

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
  loadFeatureImportance,
  loadFeatureImportanceFailure,
  loadFeatureImportanceSuccess,
  toggleFeatureImportanceSort,
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
  featureImportance: {
    data: FeatureImportanceGroup[];
    hasNext: boolean;
    pageable: Pageable;
    sort: Sort;
    loading: boolean;
    errorMessage: string;
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
  featureImportance: {
    data: undefined,
    pageable: {
      pageNumber: -1, // will automatically use pageNumber + 1
      pageSize: 3,
    },
    sort: {
      property: 'max_y_pos',
      direction: SortDirection.DESC,
    },
    hasNext: true, // initial call
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
  ),
  on(
    loadFeatureImportance,
    (state: AttritionAnalyticsState): AttritionAnalyticsState => ({
      ...state,
      featureImportance: {
        ...state.featureImportance,
        loading: true,
      },
    })
  ),
  on(
    loadFeatureImportanceSuccess,
    (state: AttritionAnalyticsState, { data }): AttritionAnalyticsState => ({
      ...state,
      featureImportance: {
        ...state.featureImportance,
        data:
          state.featureImportance.data !== undefined
            ? [...data.content].reverse().concat(state.featureImportance.data) // reverse to have most important feature on top
            : [...data.content].reverse(),
        hasNext: data.hasNext,
        pageable: data.pageable,
        loading: false,
      },
    })
  ),
  on(
    loadFeatureImportanceFailure,
    (
      state: AttritionAnalyticsState,
      { errorMessage }
    ): AttritionAnalyticsState => ({
      ...state,
      featureImportance: {
        ...state.featureImportance,
        errorMessage,
        loading: false,
      },
    })
  ),
  on(
    toggleFeatureImportanceSort,
    (state: AttritionAnalyticsState): AttritionAnalyticsState => ({
      ...state,
      featureImportance: {
        ...state.featureImportance,
        data: undefined,
        loading: true,
        pageable: {
          ...state.featureImportance.pageable,
          pageNumber: -1,
        },
        sort: {
          ...state.featureImportance.sort,
          direction:
            state.featureImportance.sort.direction === SortDirection.DESC
              ? SortDirection.ASC
              : SortDirection.DESC,
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
