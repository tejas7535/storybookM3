import { SETTINGS_STATE_MOCK } from '@ea/testing/mocks';

import { getBearingDesignation } from './settings.selector';

describe('Settings Selector', () => {
  const mockState = {
    settings: {
      ...SETTINGS_STATE_MOCK,
    },
  };

  describe('getBearingDesignation', () => {
    it('should return the bearing designation', () => {
      expect(getBearingDesignation(mockState)).toEqual(
        SETTINGS_STATE_MOCK.calculationSettings.bearingDesignation
      );
    });
  });
});
