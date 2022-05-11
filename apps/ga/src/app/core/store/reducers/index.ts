import { Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromBearing from './bearing/bearing.reducer';
import * as fromParameter from './parameter/parameter.reducer';
import * as fromResult from './result/result.reducer';
import * as fromSettings from './settings/settings.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  settings: fromSettings.SettingsState;
  bearing: fromBearing.BearingState;
  parameter: fromParameter.ParameterState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  settings: fromSettings.settingsReducer,
  bearing: fromBearing.bearingReducer,
  parameter: fromParameter.parameterReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getRouterState =
  createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>(
    'router'
  );

export const getBearingState =
  createFeatureSelector<fromBearing.BearingState>('bearing');

export const getParameterState =
  createFeatureSelector<fromParameter.ParameterState>('parameter');

export const getResultState =
  createFeatureSelector<fromResult.ResultState>('result');

export const getSettingsState =
  createFeatureSelector<fromSettings.SettingsState>('settings');

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
