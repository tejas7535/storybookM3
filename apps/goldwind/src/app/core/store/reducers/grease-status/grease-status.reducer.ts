import { Action, createReducer, on } from '@ngrx/store';

import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusLatest,
  getGreaseStatusLatestFailure,
  getGreaseStatusLatestSuccess,
  getGreaseStatusSuccess,
} from '../../actions/grease-status/grease-status.actions';
import { GcmStatus } from './models';

export interface GreaseStatusState {
  loading: boolean;
  result: GcmStatus[];
  status: {
    loading: boolean;
    result: GcmStatus;
  };
}

export const initialState: GreaseStatusState = {
  loading: false,
  result: undefined,
  status: {
    loading: false,
    result: undefined,
  },
};

export const greaseStatusReducer = createReducer(
  initialState,
  on(
    getGreaseStatus,
    (state: GreaseStatusState): GreaseStatusState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    getGreaseStatusSuccess,
    (state: GreaseStatusState, { gcmStatus }): GreaseStatusState => ({
      ...state,
      result: gcmStatus,
      loading: false,
    })
  ),
  on(
    getGreaseStatusFailure,
    (state: GreaseStatusState): GreaseStatusState => ({
      ...state,
      loading: false,
    })
  ),
  on(
    getGreaseStatusLatest,
    (state: GreaseStatusState): GreaseStatusState => ({
      ...state,
      status: {
        ...state.status,
        loading: true,
      },
    })
  ),
  on(
    getGreaseStatusLatestSuccess,
    (state: GreaseStatusState, { greaseStatusLatest }): GreaseStatusState => ({
      ...state,
      status: {
        result: greaseStatusLatest,
        loading: false,
      },
    })
  ),
  on(
    getGreaseStatusLatestFailure,
    (state: GreaseStatusState): GreaseStatusState => ({
      ...state,
      status: {
        ...state.status,
        loading: false,
      },
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: GreaseStatusState,
  action: Action
): GreaseStatusState {
  return greaseStatusReducer(state, action);
}
