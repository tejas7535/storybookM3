import { MATERIAL_STOCK_MOCK } from '../../../../../testing/mocks/models/material-stock.mock';
import {
  loadMaterialStock,
  loadMaterialStockFailure,
  loadMaterialStockSuccess,
  resetMaterialStock,
} from './material-stock.actions';
describe('Material Stock Actions', () => {
  test('loadMaterialStock', () => {
    const materialNumber15 = '000025437000011';
    const productionPlantId = '0200';
    const action = loadMaterialStock({ materialNumber15, productionPlantId });

    expect(action).toEqual({
      materialNumber15,
      productionPlantId,
      type: '[Material Stock] Get Material Stock by Production Plant and Material Number',
    });
  });
  test('loadMaterialStockSuccess', () => {
    const materialStock = MATERIAL_STOCK_MOCK;

    const action = loadMaterialStockSuccess({
      materialStock,
    });

    expect(action).toEqual({
      materialStock,
      type: '[Material Stock] Get Material Stock by Production Plant and Material Number Success',
    });
  });
  test('loadMaterialStockFailure', () => {
    const errorMessage = 'errorMessage';
    const action = loadMaterialStockFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Material Stock] Get Material Stock by Production Plant and Material Number Failure',
    });
  });
  test('resetMaterialStock', () => {
    const action = resetMaterialStock();

    expect(action).toEqual({
      type: '[Material Stock] Reset Material Stock Store',
    });
  });
});
