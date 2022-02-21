import { MaterialStockState } from '../../../app/core/store/reducers/material-stock/material-stock.reducer';
import { MATERIAL_STOCK_MOCK } from '../models/material-stock.mock';
export const MATERIAL_STOCK_STATE_MOCK: MaterialStockState = {
  materialStock: MATERIAL_STOCK_MOCK,
  materialStockLoading: false,
  errorMessage: undefined,
};
