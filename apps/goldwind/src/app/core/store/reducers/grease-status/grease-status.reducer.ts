import { Action, createReducer, on } from '@ngrx/store';

import * as U from '../../../../shared/store/utils.reducer';
import { KPIState } from '../../../../shared/store/utils.selector';
import * as A from '../../actions/grease-status/grease-status.actions';
import { GcmStatus } from './models';

export type GreaseStatusState = KPIState<GcmStatus>;

export const initialState: GreaseStatusState = {
  loading: false,
  status: {
    loading: false,
  },
};

export const greaseStatusReducer = createReducer(
  initialState,
  on(A.getGreaseStatus, U.getState),
  on(A.getGreaseStatusSuccess, U.getStateSuccess('gcmStatus')),
  on(A.getGreaseStatusFailure, U.getStateFailure()),
  on(A.getGreaseStatusLatest, U.getStateLatest()),
  on(
    A.getGreaseStatusLatestSuccess,
    U.getStateLatestSuccess('greaseStatusLatest')
  ),
  on(A.getGreaseStatusLatestFailure, U.getStateLatestFailure())
);

export function reducer(
  state: GreaseStatusState,
  action: Action
): GreaseStatusState {
  return greaseStatusReducer(state, action);
}
