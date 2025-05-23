import { AppDelivery } from '@mm/shared/models';
import { createReducer, on } from '@ngrx/store';

import { GlobalActions } from '../../actions/global/global.actions';
import { GlobalState } from '../../models/global-state.model';

export const initialState: GlobalState = {
  isStandalone: true,
  appDelivery: AppDelivery.Standalone,
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
    GlobalActions.setIsStandalone,
    (state, { isStandalone }): GlobalState => ({
      ...state,
      isStandalone,
    })
  ),

  on(
    GlobalActions.setAppDelivery,
    (state, { appDelivery }): GlobalState => ({
      ...state,
      appDelivery,
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
