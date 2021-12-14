import { Plant } from './plant.model';

export interface MaterialStockByPlant {
  plant: Plant;
  productionPlant: Plant;
  stock: number;
  freeStock: number;
  backlog: number;
  nextFree: number;
  dateNextFree: string;
  arrivalDate: string;
}
