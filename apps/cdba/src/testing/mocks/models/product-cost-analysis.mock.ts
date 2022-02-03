import { ProductCostAnalysis } from '@cdba/shared/models';

import { REFERENCE_TYPE_MOCK } from './reference-type.mock';

export const PRODUCT_COST_ANALYSIS_MOCK = new ProductCostAnalysis(
  REFERENCE_TYPE_MOCK.materialDesignation,
  REFERENCE_TYPE_MOCK.averagePrices[0],
  REFERENCE_TYPE_MOCK.sqvSapLatestMonth,
  REFERENCE_TYPE_MOCK.gpcLatestYear
);
