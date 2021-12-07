import { Action, createReducer, on } from '@ngrx/store';

import {
  getStaticSafetyLatest,
  getStaticSafetyLatestFailure,
  getStaticSafetyLatestSuccess,
} from '../../actions/static-safety/static-safety.actions';
import { StaticSafetyStatus } from './models/static-safety.model';

export interface StaticSafetyState {
  loading: boolean;
  result: StaticSafetyStatus[];
  status: {
    loading: boolean;
    result: StaticSafetyStatus;
  };
}

export const initialState: StaticSafetyState = {
  loading: false,
  result: undefined,
  status: {
    loading: false,
    result: undefined,
  },
};

export const staticSafetyReducer = createReducer(
  initialState,
  on(
    getStaticSafetyLatest,
    (state: StaticSafetyState): StaticSafetyState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    getStaticSafetyLatestSuccess,
    (state: StaticSafetyState, { result }): StaticSafetyState => ({
      ...state,
      loading: false,
      status: {
        result,
        loading: false,
      },
    })
  ),
  on(
    getStaticSafetyLatestFailure,
    (state: StaticSafetyState): StaticSafetyState => ({
      ...state,
      loading: false,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: StaticSafetyState,
  action: Action
): StaticSafetyState {
  return staticSafetyReducer(state, action);
}
