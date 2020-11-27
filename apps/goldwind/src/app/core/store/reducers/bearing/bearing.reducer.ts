import { Action, createReducer, on } from '@ngrx/store';

import {
  getBearing,
  getBearingFailure,
  getBearingSuccess,
  getShaft,
  getShaftFailure,
  getShaftSuccess,
} from '../../actions/bearing/bearing.actions';
import { BearingMetadata, ShaftStatus } from './models';

export interface BearingState {
  loading: boolean;
  result: BearingMetadata;
  shaft: {
    loading: boolean;
    result: ShaftStatus;
  };
}

export const initialState: BearingState = {
  loading: false,
  result: undefined,
  shaft: {
    loading: false,
    result: undefined,
  },
};

export const bearingReducer = createReducer(
  initialState,
  on(getBearing, (state: BearingState) => ({
    ...state,
    loading: true,
  })),
  on(getBearingSuccess, (state: BearingState, { bearing }) => ({
    ...state,
    result: bearing,
    loading: false,
  })),
  on(getBearingFailure, (state: BearingState) => ({
    ...state,
    loading: false,
  })),
  on(getShaft, (state: BearingState) => ({
    ...state,
    shaft: {
      ...state.shaft,
      loading: true,
    },
  })),
  on(getShaftSuccess, (state: BearingState, { shaft }) => ({
    ...state,
    shaft: {
      result: shaft,
      loading: false,
    },
  })),
  on(getShaftFailure, (state: BearingState) => ({
    ...state,
    shaft: {
      ...state.shaft,
      loading: false,
    },
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: BearingState, action: Action): BearingState {
  return bearingReducer(state, action);
}
