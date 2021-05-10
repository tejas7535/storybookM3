import { Action, createReducer, on } from '@ngrx/store';

import {
  getShaft,
  getShaftFailure,
  getShaftSuccess,
} from '../../actions/shaft/shaft.actions';
import { ShaftStatus } from './models';

export interface ShaftState {
  loading: boolean;
  result: ShaftStatus;
}

export const initialState: ShaftState = {
  loading: false,
  result: undefined,
};

export const shaftReducer = createReducer(
  initialState,
  on(getShaft, (state: ShaftState) => ({
    ...state,
    loading: true,
  })),
  on(getShaftSuccess, (state: ShaftState, { shaft }) => ({
    ...state,
    result: shaft,
    loading: false,
  })),
  on(getShaftFailure, (state: ShaftState) => ({
    ...state,
    loading: false,
  }))
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: ShaftState, action: Action): ShaftState {
  return shaftReducer(state, action);
}
