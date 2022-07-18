import { createAction, props } from '@ngrx/store';

import { AppDelivery } from '@ga/shared/models';

export const initSettingsEffects = createAction(
  '[Settings] Init Settings Effects'
);

export const setAppDelivery = createAction(
  '[Settings] Set App Delivery',
  props<{ appDelivery: `${AppDelivery}` }>()
);

export const setCurrentStep = createAction(
  '[Settings] Set Current Step',
  props<{ step: number }>()
);
