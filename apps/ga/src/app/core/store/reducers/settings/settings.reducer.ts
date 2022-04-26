import { Action, createReducer, on } from '@ngrx/store';

import { setCurrentStep } from '../../actions/settings/settings.actions';

export interface SettingsState {
  stepper: {
    currentStep: number;
  };
  language: string;
  units: string;
  decimalSeparator: string;
}

export const initialState: SettingsState = {
  stepper: {
    currentStep: 0,
  },
  language: undefined,
  units: undefined,
  decimalSeparator: undefined,
};

export const settingsReducer = createReducer(
  initialState,
  on(
    setCurrentStep,
    (state, { step }): SettingsState => ({
      ...state,
      stepper: {
        ...state.stepper,
        currentStep: step,
      },
    })
  )
);

export function reducer(state: SettingsState, action: Action): SettingsState {
  return settingsReducer(state, action);
}
