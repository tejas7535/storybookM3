import { RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '@ga/../environments/environment';
import {
  BearingSelectionState,
  CalculationParametersState,
  CalculationResultState,
  RouterStateUrl,
  SettingsState,
} from '@ga/core/store/models';

import { bearingSelectionReducer } from './bearing-selection/bearing-selection.reducer';
import { calculationParametersReducer } from './calculation-parameters/calculation-parameters.reducer';
import { settingsReducer } from './settings/settings.reducer';

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  settings: SettingsState;
  bearingSelection: BearingSelectionState;
  calculationParameters: CalculationParametersState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  settings: settingsReducer,
  bearingSelection: bearingSelectionReducer,
  calculationParameters: calculationParametersReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getRouterState =
  createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>(
    'router'
  );

export const getBearingSelectionState =
  createFeatureSelector<BearingSelectionState>('bearingSelection');

export const getCalculationParametersState =
  createFeatureSelector<CalculationParametersState>('calculationParameters');

export const getCalculationResultState =
  createFeatureSelector<CalculationResultState>('calculationResult');

export const getSettingsState =
  createFeatureSelector<SettingsState>('settings');

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
