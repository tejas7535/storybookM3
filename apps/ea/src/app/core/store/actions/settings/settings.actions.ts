import { createAction, props } from '@ngrx/store';

export const setStandalone = createAction(
  '[Settings] Set Standalone',
  props<{ isStandalone: boolean }>()
);

export const setResultPreviewSticky = createAction(
  '[Settings] Set result preview sticky',
  props<{ isResultPreviewSticky: boolean }>()
);
