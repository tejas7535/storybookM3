import { AppState } from '@ga/core/store';

import { BEARING_STATE_MOCK } from './bearing-state.mock';
import { PARAMETERS_STATE_MOCK } from './parameters-state.mock';
import { SETTINGS_STATE_MOCK } from './settings-state.mock';

export const APP_STATE_MOCK: Partial<AppState> = {
  settings: SETTINGS_STATE_MOCK,
  bearing: BEARING_STATE_MOCK,
  parameter: PARAMETERS_STATE_MOCK,
};
