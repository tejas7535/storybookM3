import { BomActions } from './bom.actions';
import { CalculationsActions } from './calculations.actions';
import { ProductDetailsActions } from './product-details.actions';

export * from './bom.actions';
export * from './calculations.actions';
export * from './product-details.actions';

export type CompareActions =
  | BomActions
  | CalculationsActions
  | ProductDetailsActions;
