import { createSelector } from '@ngrx/store';

import { getSettingsState } from '../../reducers';

export const isStandalone = createSelector(
  getSettingsState,
  (state): boolean => state.isStandalone
);

export const isResultPreviewSticky = createSelector(
  getSettingsState,
  (state): boolean => (state.isStandalone ? state.isResultPreviewSticky : false)
);
