import { Action, createReducer, on } from '@ngrx/store';

import { AppDelivery } from '@ga/shared/models';

import {
  setAppDelivery,
  setCurrentStep,
} from '../../actions/settings/settings.actions';

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
  on(setAppDelivery, (state, { appDelivery }) => ({
    ...state,
    environment: {
      ...state.environment,
      appDelivery,
    },
  })),
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
