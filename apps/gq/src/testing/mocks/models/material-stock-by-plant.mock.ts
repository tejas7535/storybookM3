import { MaterialStockByPlant } from '../../../app/shared/models/quotation-detail';
import { PLANT_MOCK } from './plant.mock';

export const MATERIAL_STOCK_BY_PLANT_MOCK: MaterialStockByPlant = {
  plant: PLANT_MOCK,
  productionPlant: PLANT_MOCK,
  stock: 50,
  freeStock: 40,
  backlog: 100,
  nextFree: 10,
  dateNextFree: '2021-02-03T14:19:44.5734925',
  arrivalDate: '2021-02-03T14:19:44.5734925',
};
