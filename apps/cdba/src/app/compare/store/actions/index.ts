import { BomActions } from './bom/bom.actions';
import { CalculationsActions } from './calculations/calculations.actions';
import { ComparisonSummaryActions } from './comparison-summary/comparison-summary.actions';
import { ProductDetailsActions } from './product-details/product-details.actions';
import { CompareRootActions } from './root/compare-root.actions';

export * from './bom/bom.actions';
export * from './calculations/calculations.actions';
export * from './comparison-summary/comparison-summary.actions';
export * from './product-details/product-details.actions';

export type CompareActions =
  | BomActions
  | CalculationsActions
  | ProductDetailsActions
  | ComparisonSummaryActions
  | CompareRootActions;
