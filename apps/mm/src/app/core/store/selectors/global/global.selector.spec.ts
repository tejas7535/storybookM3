import { AppDelivery } from '@mm/shared/models';

import { GlobalState } from '../../models/global-state.model';
import * as GlobalSelectors from './global.selector';

describe('Global Selector', () => {
  const initialState: GlobalState = {
    appDelivery: AppDelivery.Embedded,
    initialized: false,
    isInternalUser: false,
    isStandalone: false,
  };

  describe('getIsInitialized', () => {
    it('should return the initialized state', () => {
      const result = GlobalSelectors.getIsInitialized.projector(initialState);
      expect(result).toBe(false);
    });
  });

  describe('getIsStandalone', () => {
    it('should return the isStandalone state', () => {
      const result = GlobalSelectors.getIsStandalone.projector(initialState);
      expect(result).toBe(false);
    });
  });

  describe('getAppDelivery', () => {
    it('should return the appDelivery state', () => {
      const result = GlobalSelectors.getAppDelivery.projector(initialState);
      expect(result).toBe(AppDelivery.Embedded);
    });
  });

  describe('getAppDeliveryEmbedded', () => {
    it('should return the appDeliveryEmbedded state', () => {
      const result = GlobalSelectors.getAppDeliveryEmbedded.projector(
        initialState.appDelivery as AppDelivery
      );
      expect(result).toBe(true);
    });
  });

  describe('getIsInternalUser', () => {
    it('should return the isInternalUser state', () => {
      const result = GlobalSelectors.getIsInternalUser.projector(initialState);
      expect(result).toBe(false);
    });
  });
});
