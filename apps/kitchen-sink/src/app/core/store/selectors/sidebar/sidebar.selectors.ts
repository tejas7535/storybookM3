import { createSelector } from '@ngrx/store';

import { getSidebarState } from '../../reducers';

export const getSidebarMode = createSelector(
  getSidebarState,
  state => state.mode
);
