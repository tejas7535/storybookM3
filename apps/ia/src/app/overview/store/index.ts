import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { AttritionOverTime } from '../../shared/models';
import { OverviewFluctuationRates } from '../../shared/models/overview-fluctuation-rates';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesOverviewSuccess,
} from './actions/overview.action';

export const overviewFeatureKey = 'overview';

export interface OverviewState {
  attritionOverTime: {
    data: AttritionOverTime;
    loading: boolean;
    errorMessage: string;
  };
  fluctuationRates: {
    data: OverviewFluctuationRates;
    loading: boolean;
    errorMessage: string;
  };
}

export const initialState: OverviewState = {
  attritionOverTime: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  fluctuationRates: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
};

export const overviewReducer = createReducer(
  initialState,
  on(loadAttritionOverTimeOverview, (state: OverviewState) => ({
    ...state,
    attritionOverTime: {
      ...state.attritionOverTime,
      loading: true,
    },
  })),
  on(
    loadAttritionOverTimeOverviewSuccess,
    (state: OverviewState, { data }) => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadAttritionOverTimeOverviewFailure,
    (state: OverviewState, { errorMessage }) => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  ),
  on(loadFluctuationRatesOverview, (state: OverviewState) => ({
    ...state,
    fluctuationRates: {
      ...state.fluctuationRates,
      loading: true,
    },
  })),
  on(loadFluctuationRatesOverviewSuccess, (state: OverviewState, { data }) => ({
    ...state,
    fluctuationRates: {
      ...state.fluctuationRates,
      data,
      loading: false,
    },
  })),
  on(
    loadFluctuationRatesOverviewFailure,
    (state: OverviewState, { errorMessage }) => ({
      ...state,
      fluctuationRates: {
        ...state.fluctuationRates,
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: OverviewState, action: Action): OverviewState {
  return overviewReducer(state, action);
}

export const selectOverviewState =
  createFeatureSelector<OverviewState>(overviewFeatureKey);
