import { AppDelivery } from '@mm/shared/models';

export interface GlobalState {
  isStandalone: boolean;
  appDelivery: `${AppDelivery}`;
  initialized: boolean;
  isInternalUser: boolean;
}
