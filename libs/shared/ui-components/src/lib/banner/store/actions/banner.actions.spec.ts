import * as fromBannerActions from './banner.actions';

describe('BannerActions', () => {
  describe('openBanner', () => {
    it('should create an action', () => {
      const action = fromBannerActions.openBanner({
        text: 'string',
        buttonText: 'string',
        icon: 'error',
        truncateSize: 0
      });

      expect(action).toEqual({
        text: 'string',
        buttonText: 'string',
        icon: 'error',
        truncateSize: 0,
        type: '[Banner] Open Banner'
      });
    });
  });

  describe('toggleFullText', () => {
    it('should create an action', () => {
      const action = fromBannerActions.toggleFullText();

      expect(action).toEqual({
        type: '[Banner] Toggle Full Text'
      });
    });
  });

  describe('closeBanner', () => {
    it('should create an action', () => {
      const action = fromBannerActions.closeBanner();

      expect(action).toEqual({
        type: '[Banner] Close Banner'
      });
    });
  });
});
