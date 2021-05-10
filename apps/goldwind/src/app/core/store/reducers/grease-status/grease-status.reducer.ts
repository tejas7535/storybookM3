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
import { GcmProcessed, GcmStatus, GreaseDisplay } from './models';

export interface GreaseStatusState {
  loading: boolean;
  result: GcmStatus;
  status: {
    loading: boolean;
    result: GcmProcessed;
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
    deterioration_1: true,
    waterContent_1: true,
    temperatureOptics_1: true,
    deterioration_2: true,
    waterContent_2: true,
    temperatureOptics_2: true,
    rsmShaftSpeed: false,
  },
  interval: {
    startDate: Math.floor(+new Date().setDate(new Date().getDate() - 1) / 1000),
    endDate: Math.floor(+new Date() / 1000),
  },
};

export const greaseStatusReducer = createReducer(
  initialState,
  on(getGreaseStatus, (state: GreaseStatusState) => ({
    ...state,
    loading: true,
  })),
  on(getGreaseStatusSuccess, (state: GreaseStatusState, { gcmStatus }) => ({
    ...state,
    result: gcmStatus,
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

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: GreaseStatusState,
  action: Action
): GreaseStatusState {
  return greaseStatusReducer(state, action);
}
