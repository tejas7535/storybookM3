import { createSelector } from '@ngrx/store';

import { getSidebarState } from '../reducers/sidebar.reducer';

export const getSidebarMode = createSelector(
  getSidebarState,
  (state) => state.mode
);
