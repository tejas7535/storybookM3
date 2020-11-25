import { Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromCase from './create-case/create-case.reducer';
import * as fromDetailCase from './detail-case/detail-case.reducer';
import * as fromProcessCase from './process-case/process-case.reducers';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  processCase: fromProcessCase.ProcessCaseState;
  case: fromCase.CaseState;
  detailCase: fromDetailCase.DetailState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  processCase: fromProcessCase.processCaseReducer,
  case: fromCase.createCaseReducer,
  detailCase: fromDetailCase.detailCaseReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('router');

export const getProcessCaseState = createFeatureSelector<fromProcessCase.ProcessCaseState>(
  'processCase'
);

export const getCaseState = createFeatureSelector<fromCase.CaseState>('case');

export const getDetailState = createFeatureSelector<fromDetailCase.DetailState>(
  'detailCase'
);

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
