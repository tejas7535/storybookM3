import { Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '@cdba/environments/environment';

import * as fromCompare from '../../../compare/store/reducers/compare.reducer';
import * as fromDetail from './detail/detail.reducer';
import * as fromRoles from './roles/roles.reducer';
import * as fromSearch from './search/search.reducer';
import * as fromUserInteraction from './user-interaction/user-interaction.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  search: fromSearch.SearchState;
  roles: fromRoles.RolesState;
  userInteraction: fromUserInteraction.UserInteractionState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  search: fromSearch.searchReducer,
  roles: fromRoles.rolesReducer,
  userInteraction: fromUserInteraction.userInteractionReducer,
};

export const metaReducers: MetaReducer<AppState>[] = environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getRouterState =
  createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>(
    'router'
  );

export const getSearchState =
  createFeatureSelector<fromSearch.SearchState>('search');

export const getDetailState =
  createFeatureSelector<fromDetail.DetailState>('detail');

export const getCompareState =
  createFeatureSelector<fromCompare.CompareState>('compare');

export const getRolesState =
  createFeatureSelector<fromRoles.RolesState>('roles');

export const getUserInteractionState =
  createFeatureSelector<fromUserInteraction.UserInteractionState>(
    'userInteraction'
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
