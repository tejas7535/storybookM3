import { Action, createReducer, on } from '@ngrx/store';

import { setCurrentStep } from '../../actions/settings/settings.actions';

export interface SettingsState {
  stepper: {
    currentStep: number;
  };
  units: string;
}

export const initialState: SettingsState = {
  stepper: {
    currentStep: 0,
  },
  units: undefined,
};

export const settingsReducer = createReducer(
  initialState,
  on(setCurrentStep, (state, { step }) => ({
    ...state,
    stepper: {
      ...state.stepper,
      currentStep: step,
    },
  }))
);

export function reducer(state: SettingsState, action: Action) {
  return settingsReducer(state, action);
}
