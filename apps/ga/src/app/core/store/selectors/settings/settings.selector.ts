import { createSelector } from '@ngrx/store';

import { steps } from '@ga/shared/constants';
import { AppDelivery } from '@ga/shared/models';

import { getSettingsState } from '../../reducers';
import {
  getModelCreationSuccess,
  getSelectedBearing,
} from '../bearing/bearing.selector';
import { getParameterValidity } from '../parameter/parameter.selector';

export const getEnvironment = createSelector(
  getSettingsState,
  (state) => state.environment
);

export const getAppDelivery = createSelector(
  getEnvironment,
  (environment) => environment.appDelivery
);

export const getAppIsEmbedded = createSelector(
  getEnvironment,
  (environment) => environment.appDelivery === AppDelivery.Embedded
);

export const getStepperState = createSelector(
  getSettingsState,
  (state) => state.stepper
);

export const getSteps = createSelector(
  getSelectedBearing,
  getModelCreationSuccess,
  getParameterValidity,
  getAppIsEmbedded,
  (bearing, success, valid, appIsEmbedded) =>
    steps.map((step) => {
      switch (step.name) {
        case 'bearingSelection':
          return { ...step, enabled: !appIsEmbedded };
        case 'parameters':
          return { ...step, enabled: !!bearing && success };
        case 'report':
          return { ...step, enabled: !!bearing && valid && success };
        default:
          return step;
      }
    })
);

export const getCurrentStep = createSelector(
  getStepperState,
  (stepper) => stepper.currentStep
);
