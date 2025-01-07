import { AppState } from '@ea/core/store';

import { CALCULATION_PARAMETERS_STATE_MOCK } from './calculation-parameters-state.mock';
import { CATALOG_CALCULATION_RESULT_STATE_MOCK } from './catalog-calculation-result-state.mock';
import { CO2_UPSTREAM_CALCULATION_RESULT_STATE_MOCK } from './co2-upstream-calculation-result-state.mock';
import { DOWNSTREAM_STATE_MOCK } from './downstream-calculation-state.mock';
import { PRODUCT_SELECTION_STATE_MOCK } from './product-selection-state.mock';
import { SETTINGS_STATE_MOCK } from './settings-state.mock';

export const APP_STATE_MOCK: AppState = {
  calculationParameters: CALCULATION_PARAMETERS_STATE_MOCK,
  productSelection: PRODUCT_SELECTION_STATE_MOCK,
  settings: SETTINGS_STATE_MOCK,
  catalogCalculationResult: CATALOG_CALCULATION_RESULT_STATE_MOCK,
  co2UpstreamCalculationResult: CO2_UPSTREAM_CALCULATION_RESULT_STATE_MOCK,
  downstreamCalculationState: DOWNSTREAM_STATE_MOCK,
};
