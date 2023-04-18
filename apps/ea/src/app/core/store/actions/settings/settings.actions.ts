import { createAction, props } from '@ngrx/store';

export const setStandalone = createAction(
  '[Settings] Set Standalone',
  props<{ isStandalone: boolean }>()
);
