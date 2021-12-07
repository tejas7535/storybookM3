import { createReducer, on } from '@ngrx/store';

import { CenterLoadStatus } from '../../../../shared/models/center-load';
import {
  getState,
  getStateFailure,
  getStateSuccess,
} from '../../../../shared/store/utils.reducer';
import { KPIState } from '../../../../shared/store/utils.selector';
import {
  getCenterLoad,
  getCenterLoadFailure,
  getCenterLoadSuccess,
} from '../../actions/center-load/center-load.actions';

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
