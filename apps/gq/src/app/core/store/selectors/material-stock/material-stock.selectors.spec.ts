import { MATERIAL_STOCK_MOCK } from '../../../../../testing/mocks/models/material-stock.mock';
import * as materialStockSelectors from './material-stock.selectors';
describe('Material Stock Selectors', () => {
  const fakeState = {
    materialStock: {
      materialStock: MATERIAL_STOCK_MOCK,
      materialStockLoading: false,
      errorMessage: 'errorMessage',
    },
  };

  describe('getMaterialStock', () => {
    test('should return material stock', () => {
      expect(
        materialStockSelectors.getMaterialStock.projector(
          fakeState.materialStock
        )
      ).toEqual(fakeState.materialStock.materialStock);
    });
  });
  describe('getMaterialStockLoading', () => {
    test('should return material stock loading', () => {
      expect(
        materialStockSelectors.getMaterialStockLoading.projector(
          fakeState.materialStock
        )
      ).toEqual(fakeState.materialStock.materialStockLoading);
    });
  });
});
