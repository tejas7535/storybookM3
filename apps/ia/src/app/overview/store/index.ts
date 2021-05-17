import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { AttritionOverTime } from '../../shared/models';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
} from './actions/overview.action';

export const overviewFeatureKey = 'overview';

export interface OverviewState {
  attritionOverTime: {
    data: AttritionOverTime;
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
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: OverviewState, action: Action): OverviewState {
  return overviewReducer(state, action);
}

export const selectOverviewState =
  createFeatureSelector<OverviewState>(overviewFeatureKey);
