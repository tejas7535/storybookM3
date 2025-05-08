import { createSelector } from '@ngrx/store';

import { getRouterState } from '../../reducers';

export const getRouteState = createSelector(
  getRouterState,
  (routerState) => routerState.state
);
export const getRouteParams = createSelector(
  getRouteState,
  (routerState) => routerState.params
);
