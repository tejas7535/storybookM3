import { createSelector } from '@ngrx/store';

import { steps } from '@ga/shared/constants';
import { AppDelivery } from '@ga/shared/models';

import { getSettingsState } from '../../reducers';
import {
  getModelCreationSuccess,
  getSelectedBearing,
} from '../bearing-selection/bearing-selection.selector';
import { getParameterValidity } from '../calculation-parameters/calculation-parameters.selector';

export const getEnvironment = createSelector(
  getSettingsState,
  (state) => state.environment
);

export const getAppDelivery = createSelector(
  getEnvironment,
  (environment) => environment.appDelivery
);

export const getPartnerVersion = createSelector(
  getEnvironment,
  (environment) => environment.partnerVersion
);

export const getAppIsEmbedded = createSelector(
  getEnvironment,
  (environment) => environment.appDelivery === AppDelivery.Embedded
);

export const getInternalUser = createSelector(
  getEnvironment,
  (environment) => environment.internalUser
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
          return {
            ...step,
            editable: !appIsEmbedded,
            enabled: !appIsEmbedded,
            complete: appIsEmbedded || !!bearing,
          };
        case 'parameters':
          return {
            ...step,
            enabled: !!bearing,
            complete: !!bearing && success && valid,
            editable: true,
          };
        case 'report':
          return {
            ...step,
            enabled: !!bearing && valid && success,
            editable: true,
            complete: false,
          };
        default:
          return step;
      }
    })
);

export const getCurrentStep = createSelector(
  getStepperState,
  (stepper) => stepper.currentStep
);
