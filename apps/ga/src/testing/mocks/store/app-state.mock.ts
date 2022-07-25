import { AppState } from '@ga/core/store';

import { BEARING_SELECTION_STATE_MOCK } from './bearing-selection-state.mock';
import { CALCULATION_PARAMETERS_STATE_MOCK } from './calculation-parameters-state.mock';
import { SETTINGS_STATE_MOCK } from './settings-state.mock';

export const APP_STATE_MOCK: Partial<AppState> = {
  settings: SETTINGS_STATE_MOCK,
  bearingSelection: BEARING_SELECTION_STATE_MOCK,
  calculationParameters: CALCULATION_PARAMETERS_STATE_MOCK,
};
