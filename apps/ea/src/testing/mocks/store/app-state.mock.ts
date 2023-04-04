import { AppState } from '@ea/core/store';

import { CALCULATION_PARAMETERS_STATE_MOCK } from './calculation-parameters-state.mock';
import { CALCULATION_RESULT_STATE_MOCK } from './calculation-result-state.mock';

export const APP_STATE_MOCK: Partial<AppState> = {
  calculationParameters: CALCULATION_PARAMETERS_STATE_MOCK,
  calculationResult: CALCULATION_RESULT_STATE_MOCK,
};
