import { Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import { CalculationParametersState } from '../models/calculation-parameters-state.model';
import { CalculationResultState } from '../models/calculation-result-state.model';
import { calculationParametersReducer } from './calculation-parameters/calculation-parameters.reducer';
import { calculationResultReducer } from './calculation-result/calculation-result.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  calculationResult: CalculationResultState;
  calculationParameters: CalculationParametersState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  calculationResult: calculationResultReducer,
  calculationParameters: calculationParametersReducer,
};

// eslint-disable-next-line unicorn/no-negated-condition
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getCalculationResultState =
  createFeatureSelector<CalculationResultState>('calculationResult');

export const getCalculationParametersState =
  createFeatureSelector<CalculationParametersState>('calculationParameters');

export const getRouterState =
  createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>(
    'router'
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
