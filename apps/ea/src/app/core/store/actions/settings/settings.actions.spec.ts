import { setStandalone } from './settings.actions';

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
});
