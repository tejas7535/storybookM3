import { createSelector } from '@ngrx/store';

import { Step } from './../../../../shared/models/settings/step.model';
import { getSettingsState } from './../../reducers';
import { SettingsState } from './../../reducers/settings/settings.reducer';

export const getStepperState = createSelector(
  getSettingsState,
  (
    state: SettingsState
  ): {
    steps: Step[];
    currentStep: number;
    previousStep: number;
    nextStep: number;
  } => state.stepper
);

export const getSteps = createSelector(
  getStepperState,
  (stepper: {
    steps: Step[];
    currentStep: number;
    previousStep: number;
    nextStep: number;
  }): Step[] => stepper.steps
);

export const hasNext = createSelector(
  getStepperState,
  (stepper: {
    steps: Step[];
    currentStep: number;
    previousStep: number;
    nextStep: number;
  }): boolean => (stepper.nextStep ? true : false)
);

export const getCurrentStep = createSelector(
  getStepperState,
  (stepper: {
    steps: Step[];
    currentStep: number;
    previousStep: number;
    nextStep: number;
  }): number => stepper.currentStep
);
