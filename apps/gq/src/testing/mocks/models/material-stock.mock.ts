import { MaterialStock } from '../../../app/core/store/reducers/material-stock/models/material-stock.model';
import { MATERIAL_DETAILS_MOCK } from './material-details.mock';
import { PLANT_MOCK } from './plant.mock';

export const MATERIAL_STOCK_MOCK: MaterialStock = {
  material: MATERIAL_DETAILS_MOCK,
  plant: PLANT_MOCK,
  slowMover: true,
  excessStock: true,
};
