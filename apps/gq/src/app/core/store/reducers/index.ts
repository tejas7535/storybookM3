export * as models from './models';

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
import * as fromMaterialComparableCosts from './material-comparable-costs/material-comparable-costs.reducer';
import * as fromMaterialCostDetails from './material-cost-details/material-cost-details.reducer';
import * as fromMaterialSalesOrg from './material-sales-org/material-sales-org.reducer';
import * as fromMaterialStock from './material-stock/material-stock.reducer';
import * as fromPlantMaterialDetails from './plant-material-details/plant-material-details.reducer';
import * as fromSapPriceDetails from './sap-price-details/sap-price-details.reducer';
import * as fromTransactions from './transactions/transactions.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  case: fromCase.CreateCaseState;
  transactions: fromTransactions.TransactionsState;
  extendedComparableLinkedTransactions: fromExtendedComparableLinkedTransactions.ExtendedComparableLinkedTransactionsState;
  materialComparableCosts: fromMaterialComparableCosts.MaterialComparableCostsState;
  materialSalesOrg: fromMaterialSalesOrg.MaterialSalesOrgsState;
  sapPriceDetails: fromSapPriceDetails.SapPriceDetailsState;
  materialStock: fromMaterialStock.MaterialStockState;
  plantMaterialDetails: fromPlantMaterialDetails.PlantMaterialDetailsState;
  materialCostDetails: fromMaterialCostDetails.MaterialCostDetailsState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  case: fromCase.createCaseReducer,
  transactions: fromTransactions.transactionsReducer,
  extendedComparableLinkedTransactions:
    fromExtendedComparableLinkedTransactions.extendedComparableLinkedTransactionsReducer,
  materialComparableCosts:
    fromMaterialComparableCosts.materialComparableCostsReducer,
  materialSalesOrg: fromMaterialSalesOrg.materialSalesOrgReducer,
  sapPriceDetails: fromSapPriceDetails.sapPriceDetailsReducer,
  materialStock: fromMaterialStock.materialStockReducer,
  plantMaterialDetails: fromPlantMaterialDetails.plantMaterialDetailsReducer,
  materialCostDetails: fromMaterialCostDetails.materialCostDetailsReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

/** Root Store */
export const getRouterState =
  createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>(
    'router'
  );

export const getCaseState =
  createFeatureSelector<fromCase.CreateCaseState>('case');
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

export const getSapPriceDetailsState =
  createFeatureSelector<fromSapPriceDetails.SapPriceDetailsState>(
    'sapPriceDetails'
  );

export const getMaterialStockState =
  createFeatureSelector<fromMaterialStock.MaterialStockState>('materialStock');

export const getPlantMaterialDetailsState =
  createFeatureSelector<fromPlantMaterialDetails.PlantMaterialDetailsState>(
    'plantMaterialDetails'
  );

export const getMaterialCostDetailsState =
  createFeatureSelector<fromMaterialCostDetails.MaterialCostDetailsState>(
    'materialCostDetails'
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
