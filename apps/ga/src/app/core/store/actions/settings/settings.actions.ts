import { createAction, props } from '@ngrx/store';

import { AppDelivery, PartnerVersion } from '@ga/shared/models';

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

export const setPartnerVersion = createAction(
  '[Settings] Set Partner Version',
  props<{ partnerVersion: `${PartnerVersion}` }>()
);

export const getInternalUser = createAction('[Settings] Get Internal User');

export const setInternalUser = createAction(
  '[Settings] Set Internal User',
  props<{ internalUser: boolean }>()
);
