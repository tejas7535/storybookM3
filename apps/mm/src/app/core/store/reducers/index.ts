import { Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import { CalculationOptionsState } from '../models/calculation-options-state.model';
import { CalculationResultState } from '../models/calculation-result-state.model';
import { CalculationSelectionState } from '../models/calculation-selection-state.model';
import { calculationOptionsReducer } from './calculation-options/calculation-options.reducer';
import { calculationResultReducer } from './calculation-result/calculation-result.reducer';
import { calculationSelectionReducer } from './calculation-selection/calculation-selection.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  calculationSelection: CalculationSelectionState;
  calculationResult: CalculationResultState;
  calculationOptions: CalculationOptionsState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  calculationSelection: calculationSelectionReducer,
  calculationResult: calculationResultReducer,
  calculationOptions: calculationOptionsReducer,
};

// eslint-disable-next-line unicorn/no-negated-condition
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getCalculationSelectionState =
  createFeatureSelector<CalculationSelectionState>('calculationSelection');

export const getCalculationOptionsSelectionState =
  createFeatureSelector<CalculationOptionsState>('calculationOptions');

export const getCalculationResultState =
  createFeatureSelector<CalculationResultState>('calculationResult');

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
