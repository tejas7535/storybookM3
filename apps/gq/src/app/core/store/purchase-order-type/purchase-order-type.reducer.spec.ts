import { PurchaseOrderTypeActions } from './purchase-order-type.actions';
import {
  initialState,
  purchaseOrderTypeFeature,
} from './purchase-order-type.reducer';

describe('purchaseOrderTypeReducer', () => {
  describe('getAllPurchaseOrderTypes', () => {
    test('should set purchaseOrderTypeLoading to true', () => {
      const action = PurchaseOrderTypeActions.getAllPurchaseOrderTypes();
      const state = purchaseOrderTypeFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        purchaseOrderTypeLoading: true,
      });
    });
    test('should set purchaseOrderTypeLoading to false and set purchaseOrderTypes', () => {
      const purchaseOrderTypes = [{ name: 'test', id: 'test' }];
      const action = PurchaseOrderTypeActions.getAllPurchaseOrderTypesSuccess({
        purchaseOrderTypes,
      });
      const state = purchaseOrderTypeFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        purchaseOrderTypes,
        purchaseOrderTypeLoading: false,
        errorMessage: undefined,
      });
    });
    test('should set purchaseOrderTypeLoading to false and set errorMessage', () => {
      const errorMessage = 'this is an error message';
      const action = PurchaseOrderTypeActions.getAllPurchaseOrderTypesFailure({
        errorMessage,
      });
      const state = purchaseOrderTypeFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        purchaseOrderTypes: [],
        purchaseOrderTypeLoading: false,
        errorMessage,
      });
    });
  });

  describe('extraSelectors', () => {
    test('should return selectedPurchaseOrderType', () => {
      expect(
        purchaseOrderTypeFeature.getSelectedPurchaseOrderType.projector({
          name: 'test',
          id: 'test',
        })
      ).toEqual({ name: 'test', id: 'test' });
    });
  });
});
