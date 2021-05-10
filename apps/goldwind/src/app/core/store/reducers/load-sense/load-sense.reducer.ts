import { Action, createReducer, on } from '@ngrx/store';

import {
  getBearingLoadFailure,
  getBearingLoadLatest,
  getBearingLoadSuccess,
  getLoadAverage,
  getLoadAverageFailure,
  getLoadAverageSuccess,
} from '../../actions';
import { LoadSense, LoadSenseAvg } from './models';

export interface BearingLoadLatestState {
  loading: boolean;
  result: LoadSense;
  averageResult: LoadAverageState;
}

export interface LoadAverageState {
  loading: boolean;
  result?: LoadSenseAvg;
}

export const initialState: BearingLoadLatestState = {
  loading: false,
  result: undefined,
  averageResult: { loading: false, result: undefined },
};

export const loadSenseReducer = createReducer(
  initialState,
  on(getBearingLoadLatest, (state: BearingLoadLatestState) => ({
    ...state,
    loading: true,
  })),
  on(
    getBearingLoadSuccess,
    (state: BearingLoadLatestState, { bearingLoadLatest }) => ({
      ...state,
      loading: false,
      result: bearingLoadLatest,
    })
  ),
  on(getBearingLoadFailure, (state: BearingLoadLatestState) => ({
    ...state,
    loading: false,
  })),
  on(getLoadAverage, (state: BearingLoadLatestState) => ({
    ...state,
    averageResult: {
      ...state.averageResult,
      loading: true,
    },
  })),
  on(
    getLoadAverageSuccess,
    (state: BearingLoadLatestState, { loadAverage }) => ({
      ...state,
      averageResult: { loading: false, result: loadAverage },
    })
  ),
  on(getLoadAverageFailure, (state: BearingLoadLatestState) => ({
    ...state,
    averageResult: {
      ...state.averageResult,
      loading: false,
    },
  }))
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: BearingLoadLatestState,
  action: Action
): BearingLoadLatestState {
  return loadSenseReducer(state, action);
}
