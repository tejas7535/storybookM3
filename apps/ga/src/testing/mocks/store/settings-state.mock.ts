import { SettingsState } from '@ga/core/store/reducers/settings/settings.reducer';
import { AppDelivery } from '@ga/shared/models';

export const APP_DELIVERY_MOCK: `${AppDelivery}` = 'standalone';

export const SETTINGS_STATE_MOCK: SettingsState = {
  environment: {
    appDelivery: APP_DELIVERY_MOCK,
  },
  stepper: {
    currentStep: 0,
  },
  units: undefined,
};
