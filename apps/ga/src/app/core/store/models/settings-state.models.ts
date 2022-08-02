import { AppDelivery } from '@ga/shared/models';

export interface SettingsState {
  environment: {
    appDelivery: `${AppDelivery}`;
  };
  stepper: {
    currentStep: number;
  };
}
