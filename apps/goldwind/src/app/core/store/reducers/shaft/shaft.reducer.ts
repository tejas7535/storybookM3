import { Action, createReducer, on } from '@ngrx/store';

import * as U from '../../../../shared/store/utils.reducer';
import { KPIState } from '../../../../shared/store/utils.selector';
import * as A from '../../actions/shaft/shaft.actions';
import { ShaftStatus } from './models';

export type ShaftState = KPIState<ShaftStatus>;

export const initialState: ShaftState = {
  loading: false,
  status: {
    loading: false,
  },
};

export const shaftReducer = createReducer(
  initialState,
  on(A.getShaft, U.getState),
  on(A.getShaftSuccess, U.getStateSuccess('shaft')),
  on(A.getShaftFailure, U.getStateFailure()),
  on(A.getShaftLatest, U.getStateLatest()),
  on(A.getShaftLatestSuccess, U.getStateLatestSuccess('shaft')),
  on(A.getShaftLatestFailure, U.getStateLatestFailure())
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: ShaftState, action: Action): ShaftState {
  return shaftReducer(state, action);
}
