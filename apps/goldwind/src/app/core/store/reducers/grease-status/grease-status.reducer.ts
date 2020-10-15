import { Action, createReducer, on } from '@ngrx/store';

import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusLatest,
  getGreaseStatusLatestFailure,
  getGreaseStatusLatestSuccess,
  getGreaseStatusSuccess,
  setGreaseDisplay,
  setGreaseInterval,
} from '../../actions/grease-status/grease-status.actions';
import { GreaseDisplay, GreaseStatus } from './models';

export interface GreaseStatusState {
  loading: boolean;
  result: GreaseStatus[];
  status: {
    loading: boolean;
    result: GreaseStatus;
  };
  display: GreaseDisplay;
  interval: {
    startDate: number;
    endDate: number;
  };
}

export const initialState: GreaseStatusState = {
  loading: false,
  result: undefined,
  status: {
    loading: false,
    result: undefined,
  },
  display: {
    deteriorationPercent: true,
    temperatureCelsius: true,
    waterContentPercent: true,
    rotationalSpeed: false,
  },
  interval: {
    startDate: Math.floor(
      +new Date().setFullYear(new Date().getFullYear() - 1) / 1000
    ),
    endDate: Math.floor(+new Date() / 1000),
  },
};

export const greaseStatusReducer = createReducer(
  initialState,
  on(getGreaseStatus, (state: GreaseStatusState) => ({
    ...state,
    loading: true,
  })),
  on(getGreaseStatusSuccess, (state: GreaseStatusState, { greaseStatus }) => ({
    ...state,
    result: greaseStatus,
    loading: false,
  })),
  on(getGreaseStatusFailure, (state: GreaseStatusState) => ({
    ...state,
    loading: false,
  })),
  on(getGreaseStatusLatest, (state: GreaseStatusState) => ({
    ...state,
    status: {
      ...state.status,
      loading: true,
    },
  })),
  on(
    getGreaseStatusLatestSuccess,
    (state: GreaseStatusState, { greaseStatusLatest }) => ({
      ...state,
      status: {
        result: greaseStatusLatest,
        loading: false,
      },
    })
  ),
  on(getGreaseStatusLatestFailure, (state: GreaseStatusState) => ({
    ...state,
    status: {
      ...state.status,
      loading: false,
    },
  })),
  on(setGreaseDisplay, (state: GreaseStatusState, { greaseDisplay }) => ({
    ...state,
    display: greaseDisplay,
  })),
  on(setGreaseInterval, (state: GreaseStatusState, { interval }) => ({
    ...state,
    interval,
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: GreaseStatusState,
  action: Action
): GreaseStatusState {
  return greaseStatusReducer(state, action);
}
