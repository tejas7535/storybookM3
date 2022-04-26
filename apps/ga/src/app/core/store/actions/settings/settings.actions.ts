import { createAction, props, union } from '@ngrx/store';

export const setCurrentStep = createAction(
  '[Settings] Set Current Step',
  props<{ step: number }>()
);

const all = union({
  setCurrentStep,
});

export type SettingsAction = typeof all;
