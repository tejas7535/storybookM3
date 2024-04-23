import { InjectionToken } from '@angular/core';
import { Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromFilter from './filter/filter.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  [fromFilter.filterKey]: fromFilter.FilterState;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<AppState>>(
  'Root reducers token',
  {
    factory: () => ({
      router: fromRouter.routerReducer,
      [fromFilter.filterKey]: fromFilter.filterReducer,
    }),
  }
);

export const metaReducers: MetaReducer<AppState>[] = environment.production
  ? []
  : [];

export const selectRouterState =
  createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>(
    'router'
  );

export const selectFilterState = createFeatureSelector<fromFilter.FilterState>(
  fromFilter.filterKey
);

export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl>
{
  /**
   * Serialize the router state
   */
  public serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}
