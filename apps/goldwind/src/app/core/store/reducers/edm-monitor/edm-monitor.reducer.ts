import { Action, createReducer, on } from '@ngrx/store';
import { sub } from 'date-fns';

import {
  getEdm,
  getEdmFailure,
  getEdmSuccess,
  setEdmInterval,
} from '../../actions/edm-monitor/edm-monitor.actions';
import { EdmStatus } from './models';

export interface EdmMonitorState {
  loading: boolean;
  measurements: EdmStatus[];
  interval: {
    startDate: number;
    endDate: number;
  };
}

export const initialState: EdmMonitorState = {
  loading: false,
  measurements: undefined,
  interval: {
    startDate: Math.floor(+sub(new Date(), { days: 2 }) / 1000),
    endDate: Math.floor(Date.now() / 1000),
  },
};

export const edmMonitorReducer = createReducer(
  initialState,
  on(
    getEdm,
    (state: EdmMonitorState): EdmMonitorState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    getEdmSuccess,
    (state: EdmMonitorState, { measurements }): EdmMonitorState => ({
      ...state,
      measurements,
      loading: false,
    })
  ),
  on(
    getEdmFailure,
    (state: EdmMonitorState): EdmMonitorState => ({
      ...state,
      loading: false,
    })
  ),
  on(
    setEdmInterval,
    (state: EdmMonitorState, { interval }): EdmMonitorState => ({
      ...state,
      interval,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: EdmMonitorState,
  action: Action
): EdmMonitorState {
  return edmMonitorReducer(state, action);
}
