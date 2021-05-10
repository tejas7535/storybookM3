import { Action, createReducer, on } from '@ngrx/store';

import {
  getEdm,
  getEdmFailure,
  getEdmSuccess,
  setEdmInterval,
} from '../../actions/edm-monitor/edm-monitor.actions';
import { Edm } from './models';

export interface EdmMonitorState {
  loading: boolean;
  measurements: Edm[];
  interval: {
    startDate: number;
    endDate: number;
  };
}

export const initialState: EdmMonitorState = {
  loading: false,
  measurements: undefined,
  interval: {
    startDate: Math.floor(
      +new Date().setFullYear(new Date().getFullYear() - 1) / 1000
    ),
    endDate: Math.floor(+new Date() / 1000),
  },
};

export const edmMonitorReducer = createReducer(
  initialState,
  on(getEdm, (state: EdmMonitorState) => ({
    ...state,
    loading: true,
  })),
  on(getEdmSuccess, (state: EdmMonitorState, { measurements }) => ({
    ...state,
    measurements,
    loading: false,
  })),
  on(getEdmFailure, (state: EdmMonitorState) => ({
    ...state,
    loading: false,
  })),
  on(setEdmInterval, (state: EdmMonitorState, { interval }) => ({
    ...state,
    interval,
  }))
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: EdmMonitorState,
  action: Action
): EdmMonitorState {
  return edmMonitorReducer(state, action);
}
