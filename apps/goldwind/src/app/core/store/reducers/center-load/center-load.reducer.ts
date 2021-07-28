import { createReducer, on } from '@ngrx/store';

import {
  getCenterLoad,
  getCenterLoadFailure,
  getCenterLoadSuccess,
} from '../../actions/center-load/center-load.actions';
import {
  getState,
  getStateFailure,
  getStateSuccess,
} from '../../../../shared/store/utils.reducer';
import { CenterLoadStatus } from '../../../../shared/models/center-load';
import { KPIState } from '../../../../shared/store/utils.selector';

export type CenterLoadState = KPIState<CenterLoadStatus>;

export const initialState: CenterLoadState = {
  loading: false,
  status: {
    loading: false,
  },
};

export const centerLoadReducer = createReducer(
  initialState,
  on(getCenterLoad, getState),
  on(getCenterLoadSuccess, getStateSuccess('centerLoad')),
  on(getCenterLoadFailure, getStateFailure())
);
