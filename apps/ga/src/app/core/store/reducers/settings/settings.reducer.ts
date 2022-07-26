import { Action, createReducer, on } from '@ngrx/store';

import {
  setAppDelivery,
  setCurrentStep,
} from '@ga/core/store/actions/settings/settings.actions';
import { AppDelivery } from '@ga/shared/models';

export interface SettingsState {
  environment: {
    appDelivery: `${AppDelivery}`;
  };
  stepper: {
    currentStep: number;
  };
  units: string;
}

export const initialState: SettingsState = {
  environment: {
    appDelivery: 'standalone',
  },
  stepper: {
    currentStep: 0,
  },
  units: undefined,
};

export const settingsReducer = createReducer(
  initialState,
  on(
    setAppDelivery,
    (state, { appDelivery }): SettingsState => ({
      ...state,
      environment: {
        ...state.environment,
        appDelivery,
      },
    })
  ),
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

export function reducer(state: SettingsState, action: Action) {
  return settingsReducer(state, action);
}
