import { createSelector } from '@ngrx/store';

import { steps } from '../../../../shared/constants';
import { EnabledStep } from '../../../../shared/models';
import {
  getModelCreationSuccess,
  getSelectedBearing,
} from '../bearing/bearing.selector';
import { getParameterValidity } from '../parameter/parameter.selector';
import { getSettingsState } from './../../reducers';
import { SettingsState } from './../../reducers/settings/settings.reducer';

export const getStepperState = createSelector(
  getSettingsState,
  (state: SettingsState): { currentStep: number } => state.stepper
);

export const getEnabledSteps = createSelector(
  getSelectedBearing,
  getModelCreationSuccess,
  getParameterValidity,
  (bearing: string, success: boolean, valid: boolean): EnabledStep[] =>
    (steps as EnabledStep[]).map((step) => {
      switch (step.name) {
        case 'bearingSelection':
          return { ...step, enabled: true };
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
  (stepper: { currentStep: number }): number => stepper.currentStep
);
