import { createAction, props, union } from '@ngrx/store';

export const setCurrentStep = createAction(
  '[Settings] Set Current Step',
  props<{ step: number }>()
);

export const setLanguage = createAction(
  '[Settings] Set Language',
  props<{ language: string }>()
);

const all = union({
  setCurrentStep,
  setLanguage,
});

export type SettingsAction = typeof all;
