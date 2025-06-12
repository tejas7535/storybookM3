import { createSelector } from '@ngrx/store';

import { getRouterState } from '../../reducers';

export const getRouteState = createSelector(
  getRouterState,
  (routerState) => routerState?.state
);
export const getRouteParams = createSelector(
  getRouteState,
  (routerState) => routerState.params
);
export const getRouteQueryParams = createSelector(
  getRouteState,
  (routerState) => routerState.queryParams
);

export const getRouteUrl = createSelector(
  getRouteState,
  (routerState) => routerState?.url
);
