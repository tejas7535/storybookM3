import { Action, createReducer, on } from '@ngrx/store';

import {
  getBearingLoadFailure,
  getBearingLoadLatest,
  getBearingLoadSuccess,
} from '../../actions';
import { LoadSense } from './models';

export interface BearingLoadLatestState {
  loading: boolean;
  result: LoadSense;
}

export const initialState: BearingLoadLatestState = {
  loading: false,
  result: undefined,
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
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: BearingLoadLatestState,
  action: Action
): BearingLoadLatestState {
  return loadSenseReducer(state, action);
}
