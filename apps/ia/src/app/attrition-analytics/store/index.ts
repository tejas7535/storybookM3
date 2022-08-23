import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { Pageable, Sort, SortDirection } from '../../shared/models';
import {
  EmployeeAnalytics,
  FeatureImportanceGroup,
  FeatureParams,
} from '../models';
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
  selectRegion,
} from './actions/attrition-analytics.action';

export const attrtionAnalyticsFeatureKey = 'attritionAnalytics';

export interface AttritionAnalyticsState {
  filter: {
    regions: string[];
    selectedRegion: string;
  };
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
  filter: {
    regions: undefined,
    selectedRegion: undefined,
  },
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
      pageSize: 10,
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
    selectRegion,
    (
      state: AttritionAnalyticsState,
      { selectedRegion }
    ): AttritionAnalyticsState => ({
      ...state,
      filter: {
        ...state.filter,
        selectedRegion,
      },
      featureImportance: {
        ...initialState.featureImportance,
        loading: true,
      },
    })
  ),
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
        ...state.employeeAnalytics,
        features: {
          ...state.employeeAnalytics.features,
          data,
          loading: false,
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
            ? [...[...data.content].reverse(), ...state.featureImportance.data] // reverse to have most important feature on top
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
