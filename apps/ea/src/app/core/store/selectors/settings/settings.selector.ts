import { createSelector } from '@ngrx/store';

import { getSettingsState } from '../../reducers';

export const getBearingDesignation = createSelector(
  getSettingsState,
  (state): string => state.calculationSettings.bearingDesignation
);
