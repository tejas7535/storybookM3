import { SettingsState } from '@ea/core/store/models';
import { Action, createReducer } from '@ngrx/store';

export const initialState: SettingsState = {
  appSettings: {},
  calculationSettings: {
    bearingDesignation: '6226',
  },
};

export const settingsReducer = createReducer(initialState);

export function reducer(state: SettingsState, action: Action): SettingsState {
  return settingsReducer(state, action);
}
