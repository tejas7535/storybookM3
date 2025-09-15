import { GlobalState } from '../../models/global-state.model';
import * as GlobalSelectors from './global.selector';

describe('Global Selector', () => {
  const initialState: GlobalState = {
    initialized: false,
    isInternalUser: false,
  };

  describe('getIsInitialized', () => {
    it('should return the initialized state', () => {
      const result = GlobalSelectors.getIsInitialized.projector(initialState);
      expect(result).toBe(false);
    });
  });

  describe('getIsInternalUser', () => {
    it('should return the isInternalUser state', () => {
      const result = GlobalSelectors.getIsInternalUser.projector(initialState);
      expect(result).toBe(false);
    });
  });
});
