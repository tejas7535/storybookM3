import { Action, createReducer, on } from '@ngrx/store';

import {
  getBearingLoad,
  getBearingLoadFailure,
  getBearingLoadLatest,
  getBearingLoadLatestFailure,
  getBearingLoadLatestSuccess,
  getBearingLoadSuccess,
  getLoadAverage,
  getLoadAverageFailure,
  getLoadAverageSuccess,
} from '../../actions';
import { LoadSense } from './models';

export interface BearingLoadState {
  loading: boolean;
  result: LoadSense[];
  status: LoadState;
  averageResult: LoadState;
}

export interface LoadState {
  loading: boolean;
  result?: LoadSense;
}

export const initialState: BearingLoadState = {
  loading: false,
  result: undefined,
  status: { loading: false, result: undefined },
  averageResult: { loading: false, result: undefined },
};

export const loadSenseReducer = createReducer(
  initialState,
  on(getBearingLoad, (state: BearingLoadState) => ({
    ...state,
    loading: true,
  })),
  on(getBearingLoadSuccess, (state: BearingLoadState, { bearingLoad }) => ({
    ...state,
    loading: false,
    result: bearingLoad,
  })),
  on(getBearingLoadFailure, (state: BearingLoadState) => ({
    ...state,
    loading: false,
  })),
  on(getBearingLoadLatest, (state: BearingLoadState) => ({
    ...state,
    status: {
      ...state.status,
      loading: true,
    },
  })),
  on(
    getBearingLoadLatestSuccess,
    (state: BearingLoadState, { bearingLoadLatest }) => ({
      ...state,
      status: { loading: false, result: bearingLoadLatest },
    })
  ),
  on(getBearingLoadLatestFailure, (state: BearingLoadState) => ({
    ...state,
    status: {
      ...state.status,
      loading: false,
    },
  })),
  on(getLoadAverage, (state: BearingLoadState) => ({
    ...state,
    averageResult: {
      ...state.averageResult,
      loading: true,
    },
  })),
  on(getLoadAverageSuccess, (state: BearingLoadState, { loadAverage }) => ({
    ...state,
    averageResult: { loading: false, result: loadAverage },
  })),
  on(getLoadAverageFailure, (state: BearingLoadState) => ({
    ...state,
    averageResult: {
      ...state.averageResult,
      loading: false,
    },
  }))
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: BearingLoadState,
  action: Action
): BearingLoadState {
  return loadSenseReducer(state, action);
}
