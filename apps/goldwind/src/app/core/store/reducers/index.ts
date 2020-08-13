import { Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromBearing from './bearing/bearing.reducer';
import * as fromConditionMonitoring from './condition-monitoring/condition-monitoring.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  bearing: fromBearing.BearingState;
  conditionMonitoring: fromConditionMonitoring.ConditionMonitoringState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  bearing: fromBearing.bearingReducer,
  conditionMonitoring: fromConditionMonitoring.conditionMonitoringReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('router');

export const getBearingState = createFeatureSelector<fromBearing.BearingState>(
  'bearing'
);

export const getConditionMonitoringState = createFeatureSelector<
  fromConditionMonitoring.ConditionMonitoringState
>('conditionMonitoring');

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
      root: { queryParams },
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}
