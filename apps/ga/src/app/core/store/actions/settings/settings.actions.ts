import { createAction, props, union } from '@ngrx/store';

import { Stepper } from '../../../../shared/models';
import { Step } from './../../../../shared/models/settings/step.model';

export const updateStep = createAction(
  '[Settings] Update Steps',
  props<{ step: { index: number } & Partial<Step> }>()
);

export const setStepper = createAction(
  '[Settings] Set Steps',
  props<{ stepper: Stepper }>()
);

export const completeStep = createAction('[Settings] Complete Step');

export const previousStep = createAction('[Settings] Previous Step');

export const setCurrentStep = createAction(
  '[Settings] Set Current Step',
  props<{ step: number }>()
);

const all = union({
  updateStep,
  completeStep,
  previousStep,
  setCurrentStep,
  setStepper,
});

export type SettingsAction = typeof all;
