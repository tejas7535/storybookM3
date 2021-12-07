import { Action, createReducer, on } from '@ngrx/store';

import * as U from '../../../../shared/store/utils.reducer';
import {
  getEdmHistogram,
  getEdmHistogramFailure,
  getEdmHistogramSuccess,
} from '../../actions/edm-monitor/edm-histogram.actions';

export interface EdmHistogram {
  [x: string]: any;
  deviceId: string;
  timestamp: string;
  clazz0: number;
  clazz1: number;
  clazz2: number;
  clazz3: number;
  clazz4: number;
  channel: string;
}

export interface EdmHistogramState {
  result: EdmHistogram[];
  loading: boolean;
  interval: {
    startDate: number;
    endDate: number;
  };
}

export const initialState: EdmHistogramState = {
  loading: false,
  interval: {
    startDate: Math.floor(
      +new Date().setFullYear(new Date().getFullYear() - 1) / 1000
    ),
    endDate: Math.floor(Date.now() / 1000),
  },
  result: [],
};

export const edmHistogramReducer = createReducer(
  initialState,
  on(getEdmHistogram, U.getState),
  on(getEdmHistogramSuccess, U.getStateSuccess('histogram')),
  on(getEdmHistogramFailure, U.getStateFailure())
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: EdmHistogramState,
  action: Action
): EdmHistogramState {
  return edmHistogramReducer(state, action);
}
