import { Action, createReducer, on } from '@ngrx/store';

import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusSuccess,
  setGreaseDisplay,
} from '../../actions/grease-status/grease-status.actions';
import { GreaseDisplay, GreaseStatus } from './models';

export interface GreaseStatusState {
  loading: boolean;
  result: GreaseStatus;
  display: GreaseDisplay;
}

export const initialState: GreaseStatusState = {
  loading: false,
  result: undefined,
  display: {
    deteriorationPercent: true,
    temperatureCelsius: true,
    waterContentPercent: true,
    rotationalSpeed: true,
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
  on(setGreaseDisplay, (state: GreaseStatusState, { greaseDisplay }) => ({
    ...state,
    display: greaseDisplay,
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: GreaseStatusState,
  action: Action
): GreaseStatusState {
  return greaseStatusReducer(state, action);
}
