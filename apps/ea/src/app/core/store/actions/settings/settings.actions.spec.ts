import { setResultPreviewSticky, setStandalone } from './settings.actions';

describe('Settings Actions', () => {
  describe('set bearing designation', () => {
    it('setBearingDesignation', () => {
      const action = setStandalone({ isStandalone: true });

      expect(action).toEqual({
        type: '[Settings] Set Standalone',
        isStandalone: true,
      });
    });
  });

  describe('set result preview sticky', () => {
    it('setResultPreviewSticky', () => {
      const action = setResultPreviewSticky({ isResultPreviewSticky: true });

      expect(action).toEqual({
        type: '[Settings] Set result preview sticky',
        isResultPreviewSticky: true,
      });
    });
  });
});
