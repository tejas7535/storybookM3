import { Params, RouterStateSnapshot } from '@angular/router';
import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer
} from '@ngrx/store';
import { BannerReducer, BannerState } from '@schaeffler/shared/ui-components';

import { environment } from '../../../../environments/environment';
import * as fromSidebarReducer from './sidebar/sidebar.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  sidebar: fromSidebarReducer.SidebarState;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  banner: BannerState;
}

export const reducers: ActionReducerMap<AppState> = {
  sidebar: fromSidebarReducer.reducer,
  router: fromRouter.routerReducer,
  banner: BannerReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('router');
export const getSidebarState = createFeatureSelector<
  fromSidebarReducer.SidebarState
>('sidebar');
export const getBannerState = createFeatureSelector<BannerState>('banner');

export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl> {
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
      root: { queryParams }
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}
