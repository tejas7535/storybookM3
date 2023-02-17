import { AppState } from '@ea/core/store';

import { CALCULATION_PARAMETERS_STATE_MOCK } from './calculation-parameters-state.mock';
import { CALCULATION_RESULT_STATE_MOCK } from './calculation-result-state.mock';
import { PRODUCT_SELECTION_STATE_MOCK } from './product-selection-state.mock';
import { SETTINGS_STATE_MOCK } from './settings-state.mock';

export const APP_STATE_MOCK: Partial<AppState> = {
  settings: SETTINGS_STATE_MOCK,
  productSelection: PRODUCT_SELECTION_STATE_MOCK,
  calculationParameters: CALCULATION_PARAMETERS_STATE_MOCK,
  calculationResult: CALCULATION_RESULT_STATE_MOCK,
};
