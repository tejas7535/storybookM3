import { Action } from '@ngrx/store';

import { MATERIAL_STOCK_STATE_MOCK } from '../../../../../testing/mocks';
import { MATERIAL_STOCK_MOCK } from '../../../../../testing/mocks/models/material-stock.mock';
import {
  loadMaterialStock,
  loadMaterialStockFailure,
  loadMaterialStockSuccess,
  resetMaterialStock,
} from '../../actions/material-stock/material-stock.actions';
import {
  initialState,
  materialStockReducer,
  reducer,
} from './material-stock.reducer';

describe('Material Stock Reducer', () => {
  describe('loadMaterialStock', () => {
    test('should trigger loadMaterialStock', () => {
      const fakeState = MATERIAL_STOCK_STATE_MOCK;

      const materialNumber15 = '123456789012345';
      const productionPlantId = '0251';

      const action = loadMaterialStock({ materialNumber15, productionPlantId });

      const state = materialStockReducer(fakeState, action);

      expect(state.materialStockLoading).toBeTruthy();
    });
  });
  describe('loadMaterialStockSuccess', () => {
    test('should load MaterialStock in store', () => {
      const fakeState = {
        ...MATERIAL_STOCK_STATE_MOCK,
        materialStock: undefined as any,
        materialStockLoading: true,
      };

      const materialStock = MATERIAL_STOCK_MOCK;

      const action = loadMaterialStockSuccess({ materialStock });

      const state = materialStockReducer(fakeState, action);

      expect(state.materialStockLoading).toBeFalsy();
      expect(state.materialStock).toEqual(materialStock);
    });
  });
  describe('loadMaterialStockFailure', () => {
    test('should load error message in store', () => {
      const errorMessage = 'errorMessage';

      const fakeState = {
        ...MATERIAL_STOCK_STATE_MOCK,
        materialStock: undefined as any,
        materialStockLoading: true,
      };

      const action = loadMaterialStockFailure({ errorMessage });

      const state = materialStockReducer(fakeState, action);

      expect(state.materialStockLoading).toBeFalsy();
      expect(state.errorMessage).toEqual(errorMessage);
    });
    describe('resetMaterialStock', () => {
      test('should set state to initalstate', () => {
        const action = resetMaterialStock();

        const state = materialStockReducer(
          { ...MATERIAL_STOCK_STATE_MOCK },
          action
        );

        expect(state).toEqual(initialState);
      });
    });
  });
  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = loadMaterialStock({
        materialNumber15: '1',
        productionPlantId: '2',
      });
      expect(reducer(MATERIAL_STOCK_STATE_MOCK, action)).toEqual(
        materialStockReducer(MATERIAL_STOCK_STATE_MOCK, action)
      );
    });
  });
});
