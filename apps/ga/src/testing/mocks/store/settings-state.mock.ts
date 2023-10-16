import { SettingsState } from '@ga/core/store/models';
import { AppDelivery, PartnerVersion } from '@ga/shared/models';

export const APP_DELIVERY_MOCK: `${AppDelivery}` = 'standalone';
export const PARTNER_VERSION_MOCK: `${PartnerVersion}` = 'schmeckthal-gruppe';

export const SETTINGS_STATE_MOCK: SettingsState = {
  environment: {
    appDelivery: APP_DELIVERY_MOCK,
    partnerVersion: PARTNER_VERSION_MOCK,
  },
  stepper: {
    currentStep: 0,
  },
};
