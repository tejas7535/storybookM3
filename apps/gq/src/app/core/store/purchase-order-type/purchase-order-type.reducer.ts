import { PurchaseOrderType } from '@gq/shared/models';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { getSelectedPurchaseOrderTypeFromCreateCase } from '../selectors';
import { PurchaseOrderTypeActions } from './purchase-order-type.actions';

const PO_KEY = 'purchaseOrderType';

export interface PurchaseOrderTypeState {
  purchaseOrderTypes: PurchaseOrderType[];
  purchaseOrderTypeLoading: boolean;
  errorMessage: string;
}

export const initialState: PurchaseOrderTypeState = {
  purchaseOrderTypes: [],
  purchaseOrderTypeLoading: false,
  errorMessage: undefined,
};

export const purchaseOrderTypeFeature = createFeature({
  name: PO_KEY,
  reducer: createReducer(
    initialState,
    on(
      PurchaseOrderTypeActions.getAllPurchaseOrderTypes,
      (state: PurchaseOrderTypeState): PurchaseOrderTypeState => ({
        ...state,
        purchaseOrderTypeLoading: true,
      })
    ),
    on(
      PurchaseOrderTypeActions.getAllPurchaseOrderTypesSuccess,
      (
        state: PurchaseOrderTypeState,
        { purchaseOrderTypes }
      ): PurchaseOrderTypeState => ({
        ...state,
        purchaseOrderTypes,
        purchaseOrderTypeLoading: false,
        errorMessage: initialState.errorMessage,
      })
    ),
    on(
      PurchaseOrderTypeActions.getAllPurchaseOrderTypesFailure,
      (
        state: PurchaseOrderTypeState,
        { errorMessage }
      ): PurchaseOrderTypeState => ({
        ...state,
        purchaseOrderTypes: [],
        purchaseOrderTypeLoading: false,
        errorMessage,
      })
    )
  ),
  extraSelectors: () => {
    // the selected PO-type is stored in the create-case state to have all info at one place
    // that are needed for creating a new Case
    const getSelectedPurchaseOrderType = createSelector(
      getSelectedPurchaseOrderTypeFromCreateCase,
      (purchaseOrderType: PurchaseOrderType) => purchaseOrderType
    );

    return { getSelectedPurchaseOrderType };
  },
});
