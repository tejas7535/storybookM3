import { Action, createReducer, on } from '@ngrx/store';

import * as U from '../../../../shared/store/utils.reducer';
import {
  getEdmHistogram,
  getEdmHistogramFailure,
  getEdmHistogramSuccess,
  setEdmChannel,
} from '../../actions/edm-monitor/edm-histogram.actions';

export interface EdmHistogram {
  [x: string]: any;
  edm1: EdmAntennaValue[];
  edm2: EdmAntennaValue[];
}
export interface EdmAntennaValue {
  timestamp: string;
  [x: string]: any;
  clazz0: number;
  clazz1: number;
  clazz2: number;
  clazz3: number;
  clazz4: number;
}

export interface EdmHistogramState {
  result: {
    [x: string]: EdmAntennaValue[];
    edm1: EdmAntennaValue[];
    edm2: EdmAntennaValue[];
  };
  channel: string;
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
  channel: 'edm1',
  result: {
    edm1: [],
    edm2: [],
  },
};

export const edmHistogramReducer = createReducer(
  initialState,
  on(getEdmHistogram, U.getState),
  on(
    getEdmHistogramSuccess,
    (state: EdmHistogramState, props: any): EdmHistogramState => ({
      ...state,
      result: {
        edm1: props['histogram'].edm1,
        edm2: props['histogram'].edm2,
      },
      loading: false,
    })
  ),
  on(
    setEdmChannel,
    (state: EdmHistogramState, props: any): EdmHistogramState => ({
      ...state,
      channel: props.channel,
    })
  ),
  on(getEdmHistogramFailure, U.getStateFailure())
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: EdmHistogramState,
  action: Action
): EdmHistogramState {
  return edmHistogramReducer(state, action);
}
