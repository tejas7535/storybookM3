import { AppDelivery } from '@mm/shared/models';
import { createSelector } from '@ngrx/store';

import { getGlobalState } from '../../reducers';

export const getIsInitialized = createSelector(
  getGlobalState,
  (state) => state.initialized
);

export const getIsStandalone = createSelector(
  getGlobalState,
  (state) => state.isStandalone
);

export const getAppDelivery = createSelector(
  getGlobalState,
  (state) => state.appDelivery as AppDelivery
);

export const getAppDeliveryEmbedded = createSelector(
  getAppDelivery,
  (appDelivery) => appDelivery === AppDelivery.Embedded
);

export const getIsInternalUser = createSelector(
  getGlobalState,
  (state) => state.isInternalUser
);
