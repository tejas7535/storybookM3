import { Action, createReducer, on } from '@ngrx/store';
import { LoadDistribution } from '../../selectors/load-distribution/load-distribution.interface';
import * as U from '../../../../shared/store/utils.reducer';
import * as A from '../../actions/load-distribution/load-distribution.actions';
import { LoadSense } from '../load-sense/models';

export interface LoadDistributionState {
  result: {
    row1: LoadDistribution;
    row2: LoadDistribution;
    lsp: LoadSense;
  };
  loading: boolean;
  interval: {
    startDate: number;
    endDate: number;
  };
}

export const initialState: LoadDistributionState = {
  loading: false,
  interval: {
    startDate: Math.floor(
      +new Date().setFullYear(new Date().getFullYear() - 1) / 1000
    ),
    endDate: Math.floor(Date.now() / 1000),
  },
  result: {
    row1: undefined,
    row2: undefined,
    lsp: undefined,
  },
};

export const loadDistributionReducer = createReducer(
  initialState,

  on(A.getLoadDistributionLatest, U.getState),
  on(
    A.getLoadDistributionLatestSuccess,
    (state, props): LoadDistributionState => ({
      ...state,
      loading: false,
      result: {
        row1: props.row1,
        row2: props.row2,
        lsp: props.lsp,
      },
    })
  ),
  on(A.getLoadDistributionLatestFailure, U.getStateFailure())
);

export function reducer(
  state: LoadDistributionState,
  action: Action
): LoadDistributionState {
  return loadDistributionReducer(state, action);
}
