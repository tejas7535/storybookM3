import { Action, createReducer, on } from '@ngrx/store';

import {
  setAppDelivery,
  setCurrentStep,
  setInternalUser,
  setMediasAuthenticated,
  setPartnerVersion,
} from '@ga/core/store/actions/settings/settings.actions';
import { SettingsState } from '@ga/core/store/models';

export const initialState: SettingsState = {
  environment: {
    appDelivery: 'standalone',
  },
  stepper: {
    currentStep: 0,
  },
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
  ),
  on(
    setPartnerVersion,
    (state, { partnerVersion }): SettingsState => ({
      ...state,
      environment: {
        ...state.environment,
        partnerVersion,
      },
    })
  ),
  on(
    setInternalUser,
    (state, { internalUser }): SettingsState => ({
      ...state,
      environment: {
        ...state.environment,
        internalUser,
      },
    })
  ),
  on(
    setMediasAuthenticated,
    (state, { isAuthenticated }): SettingsState => ({
      ...state,
      environment: {
        ...state.environment,
        mediasAuthenticated: isAuthenticated,
      },
    })
  )
);

export function reducer(state: SettingsState, action: Action) {
  return settingsReducer(state, action);
}
