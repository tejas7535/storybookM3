import { Action, createReducer, on } from '@ngrx/store';

import {
  getBearing,
  getBearingFailure,
  getBearingSuccess,
} from '../../actions/bearing/bearing.actions';
import { BearingMetadata } from './models';

export interface BearingState {
  loading: boolean;
  result: BearingMetadata;
}

export const initialState: BearingState = {
  loading: false,
  result: undefined,
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
  }))
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: BearingState, action: Action): BearingState {
  return bearingReducer(state, action);
}
