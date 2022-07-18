import { createSelector } from '@ngrx/store';

import { steps } from '@ga/shared/constants';

import { getSettingsState } from '../../reducers';
import { SettingsState } from '../../reducers/settings/settings.reducer';
import {
  getModelCreationSuccess,
  getSelectedBearing,
} from '../bearing/bearing.selector';
import { getParameterValidity } from '../parameter/parameter.selector';

export const getStepperState = createSelector(
  getSettingsState,
  (state: SettingsState): { currentStep: number } => state.stepper
);

export const getSteps = createSelector(
  getSelectedBearing,
  getModelCreationSuccess,
  getParameterValidity,
  (bearing, success, valid) =>
    steps.map((step) => {
      switch (step.name) {
        case 'bearingSelection':
          return { ...step, enabled: window.self === window.top };
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
