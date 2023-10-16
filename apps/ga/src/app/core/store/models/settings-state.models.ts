import { AppDelivery, PartnerVersion } from '@ga/shared/models';

export interface SettingsState {
  environment: {
    appDelivery: `${AppDelivery}`;
    partnerVersion?: `${PartnerVersion}`;
  };
  stepper: {
    currentStep: number;
  };
}
