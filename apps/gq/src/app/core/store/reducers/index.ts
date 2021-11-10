import { Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromCase from './create-case/create-case.reducer';
import * as fromExtendedComparableLinkedTransactions from './extended-comparable-linked-transactions/extended-comparable-linked-transactions.reducer';
import * as fromHealthCheck from './health-check/health-check.reducer';
import * as fromMaterialComparableCosts from './material-comparable-costs/material-comparable-costs.reducer';
import * as fromMaterialSalesOrg from './material-sales-org/material-sales-org.reducer';
import * as fromProcessCase from './process-case/process-case.reducer';
import * as fromSapPriceDetails from './sap-price-details/sap-price-details.reducer';
import * as fromTransactions from './transactions/transactions.reducer';
import * as fromViewCases from './view-cases/view-cases.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  case: fromCase.CreateCaseState;
  processCase: fromProcessCase.ProcessCaseState;
  viewCases: fromViewCases.ViewCasesState;
  transactions: fromTransactions.TransactionsState;
  extendedComparableLinkedTransactions: fromExtendedComparableLinkedTransactions.ExtendedComparableLinkedTransactionsState;
  materialComparableCosts: fromMaterialComparableCosts.MaterialComparableCostsState;
  materialSalesOrg: fromMaterialSalesOrg.MaterialSalesOrgsState;
  healthCheck: fromHealthCheck.HealthCheckState;
  sapPriceDetails: fromSapPriceDetails.SapPriceDetailsState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  case: fromCase.createCaseReducer,
  processCase: fromProcessCase.processCaseReducer,
  viewCases: fromViewCases.viewCasesReducer,
  transactions: fromTransactions.transactionsReducer,
  extendedComparableLinkedTransactions:
    fromExtendedComparableLinkedTransactions.extendedComparableLinkedTransactionsReducer,
  materialComparableCosts:
    fromMaterialComparableCosts.materialComparableCostsReducer,
  materialSalesOrg: fromMaterialSalesOrg.materialSalesOrgReducer,
  healthCheck: fromHealthCheck.healthCheckReducer,
  sapPriceDetails: fromSapPriceDetails.sapPriceDetailsReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getRouterState =
  createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>(
    'router'
  );

export const getProcessCaseState =
  createFeatureSelector<fromProcessCase.ProcessCaseState>('processCase');

export const getCaseState =
  createFeatureSelector<fromCase.CreateCaseState>('case');

export const getViewCasesState =
  createFeatureSelector<fromViewCases.ViewCasesState>('viewCases');
export const getTransactionsState =
  createFeatureSelector<fromTransactions.TransactionsState>('transactions');
export const getExtendedComparableLinkedTransactionsState =
  createFeatureSelector<fromExtendedComparableLinkedTransactions.ExtendedComparableLinkedTransactionsState>(
    'extendedComparableLinkedTransactions'
  );

export const getMaterialComparableCostsState =
  createFeatureSelector<fromMaterialComparableCosts.MaterialComparableCostsState>(
    'materialComparableCosts'
  );

export const getMaterialSalesOrgsState =
  createFeatureSelector<fromMaterialSalesOrg.MaterialSalesOrgsState>(
    'materialSalesOrg'
  );
export const getHealthCheckState =
  createFeatureSelector<fromHealthCheck.HealthCheckState>('healthCheck');

export const getSapPriceDetailsState =
  createFeatureSelector<fromSapPriceDetails.SapPriceDetailsState>(
    'sapPriceDetails'
  );
export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl>
{
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
