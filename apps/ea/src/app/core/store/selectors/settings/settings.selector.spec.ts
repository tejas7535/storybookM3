import { SETTINGS_STATE_MOCK } from '@ea/testing/mocks/store/settings-state.mock';

import { isResultPreviewSticky, isStandalone } from './settings.selector';

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

  describe('isResultPreviewSticky', () => {
    it('should return value of isResultPreviewSticky when the app is standalone', () => {
      expect(isResultPreviewSticky(mockState)).toEqual(
        SETTINGS_STATE_MOCK.isResultPreviewSticky
      );
    });

    it('should always return false if the app is not run in standalone', () => {
      const notStandaloneMockState = {
        settings: {
          ...SETTINGS_STATE_MOCK,
          isStandalone: false,
        },
      };
      expect(isResultPreviewSticky(notStandaloneMockState)).toEqual(false);
    });
  });
});
