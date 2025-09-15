import { createReducer, on } from '@ngrx/store';

import { GlobalActions } from '../../actions/global/global.actions';
import { GlobalState } from '../../models/global-state.model';

export const initialState: GlobalState = {
  initialized: false,
  isInternalUser: false,
};

export const globalReducer = createReducer(
  initialState,

  on(
    GlobalActions.setIsInitialized,
    (state): GlobalState => ({
      ...state,
      initialized: true,
    })
  ),

  on(
    GlobalActions.setIsInternalUser,
    (state, { isInternalUser }): GlobalState => ({
      ...state,
      isInternalUser,
    })
  )
);
