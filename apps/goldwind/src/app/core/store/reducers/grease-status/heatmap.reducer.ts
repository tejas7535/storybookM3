import { Action, createReducer, on } from '@ngrx/store';

import { GCMHeatmapEntry } from '../../../../shared/models';
import * as U from '../../../../shared/store/utils.reducer';
import { KPIState } from '../../../../shared/store/utils.selector';
import * as A from '../../actions/grease-status/gc-heatmap.actions';

export type GreaseHeatmapState = KPIState<GCMHeatmapEntry>;

export const initialState: GreaseHeatmapState = {
  loading: false,
  status: {
    loading: false,
  },
};

export const greaseHeatmapStatusReducer = createReducer(
  initialState,
  on(A.getGreaseHeatMap, U.getState),
  on(A.getGreaseHeatMapLatest, U.getStateLatest()),
  on(A.getGreaseHeatMapSuccess, U.getStateSuccess('gcmheatmap')),
  on(A.getGreaseHeatMapFailure, U.getStateFailure())
);
export function reducer(
  state: GreaseHeatmapState,
  action: Action
): GreaseHeatmapState {
  return greaseHeatmapStatusReducer(state, action);
}
