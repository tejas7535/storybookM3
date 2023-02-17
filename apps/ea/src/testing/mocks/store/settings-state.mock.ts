import { SettingsState } from '@ea/core/store/models';

import { BEARING_DESIGNATION_MOCK } from '../models';

export const SETTINGS_STATE_MOCK: SettingsState = {
  appSettings: {},
  calculationSettings: {
    bearingDesignation: BEARING_DESIGNATION_MOCK,
  },
};
