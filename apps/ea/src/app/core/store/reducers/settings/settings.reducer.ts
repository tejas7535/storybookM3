import { SettingsState } from '@ea/core/store/models';
import { Action, createReducer, on } from '@ngrx/store';

import {
  setResultPreviewSticky,
  setStandalone,
} from '../../actions/settings/settings.actions';

export const initialState: SettingsState = {
  isStandalone: false,
  isResultPreviewSticky: true,
};

export const settingsReducer = createReducer(
  initialState,
  on(
    setStandalone,
    (state, { isStandalone }): SettingsState => ({
      ...state,
      isStandalone,
    })
  ),
  on(
    setResultPreviewSticky,
    (state, { isResultPreviewSticky }): SettingsState => ({
      ...state,
      isResultPreviewSticky,
    })
  )
);

export function reducer(state: SettingsState, action: Action): SettingsState {
  return settingsReducer(state, action);
}
