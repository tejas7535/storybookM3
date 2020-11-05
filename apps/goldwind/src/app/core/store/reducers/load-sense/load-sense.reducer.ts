import { Action, createReducer, on } from '@ngrx/store';

import { getLoad, getLoadFailure, getLoadSuccess } from '../../actions';
import { LoadSense } from './models';

export interface LoadSenseState {
  loading: boolean;
  result: LoadSense[];
  interval: {
    startDate: number;
    endDate: number;
  };
}

export const initialState: LoadSenseState = {
  loading: false,
  result: undefined,
  interval: {
    startDate: Math.floor(
      +new Date().setFullYear(new Date().getFullYear() - 1) / 1000
    ),
    endDate: Math.floor(+new Date() / 1000),
  },
};

export const loadSenseReducer = createReducer(
  initialState,
  on(getLoad, (state: LoadSenseState) => ({
    ...state,
    loading: true,
  })),
  on(getLoadSuccess, (state: LoadSenseState, { loadSense }) => ({
    ...state,
    loading: false,
    result: loadSense,
  })),
  on(getLoadFailure, (state: LoadSenseState) => ({
    ...state,
    loading: false,
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: LoadSenseState, action: Action): LoadSenseState {
  return loadSenseReducer(state, action);
}
