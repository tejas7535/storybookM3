import { BomActions } from './bom.actions';
import { CalculationsActions } from './calculations.actions';
import { DrawingsActions } from './drawings.actions';
import { ProductDetailsActions } from './product-details.actions';

export * from './bom.actions';
export * from './calculations.actions';
export * from './drawings.actions';
export * from './product-details.actions';

export type DetailActions =
  | BomActions
  | CalculationsActions
  | DrawingsActions
  | ProductDetailsActions;
