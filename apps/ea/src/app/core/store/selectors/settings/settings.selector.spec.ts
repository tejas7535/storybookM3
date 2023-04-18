import { SETTINGS_STATE_MOCK } from '@ea/testing/mocks/store/settings-state.mock';

import { isStandalone } from './settings.selector';

describe('Settings Selector', () => {
  const mockState = {
    settings: {
      ...SETTINGS_STATE_MOCK,
    },
  };

  describe('isStandalone', () => {
    it('should return value of standalone state', () => {
      expect(isStandalone(mockState)).toEqual(SETTINGS_STATE_MOCK.isStandalone);
    });
  });
});
