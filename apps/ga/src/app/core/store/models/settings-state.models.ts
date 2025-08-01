import { AppDelivery, PartnerVersion } from '@ga/shared/models';

export interface SettingsState {
  environment: {
    appDelivery: `${AppDelivery}`;
    partnerVersion?: `${PartnerVersion}`;
    internalUser?: boolean;
    mediasAuthenticated?: boolean;
    appLanguage: string;
  };
  stepper: {
    currentStep: number;
  };
}
