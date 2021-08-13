import { Action, createReducer } from '@ngrx/store';

import { Step } from './../../../../shared/models';

export interface SettingsState {
  stepper: {
    steps: Step[];
    currentStep: Step;
    previousStep: Step;
    nextStep: Step;
  };
  language: string;
  units: string;
  decimalSeparator: string;
}

export const initialState: SettingsState = {
  stepper: {
    steps: [],
    currentStep: undefined,
    previousStep: undefined,
    nextStep: undefined,
  },
  language: undefined,
  units: undefined,
  decimalSeparator: undefined,
};

export const settingsReducer = createReducer(initialState);

export function reducer(state: SettingsState, action: Action): SettingsState {
  return settingsReducer(state, action);
}
