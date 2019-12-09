import * as fromBannerActions from './banner.actions';

describe('BannerActions', () => {
  describe('setBannerState', () => {
    it('should create an action', () => {
      const action = fromBannerActions.setBannerState({
        text: 'string',
        buttonText: 'string',
        truncateSize: 0,
        isFullTextShown: true,
        open: true
      });

      expect(action).toEqual({
        text: 'string',
        buttonText: 'string',
        truncateSize: 0,
        isFullTextShown: true,
        open: true,
        type: '[Banner] Set Banner State'
      });
    });
  });

  describe('openBanner', () => {
    it('should create an action', () => {
      const action = fromBannerActions.openBanner({
        component: '',
        text: 'string',
        buttonText: 'string',
        truncateSize: 0
      });

      expect(action).toEqual({
        component: '',
        text: 'string',
        buttonText: 'string',
        truncateSize: 0,
        type: '[Banner] Open Banner'
      });
    });
  });

  describe('toggleFullText', () => {
    it('should create an action', () => {
      const action = fromBannerActions.toggleFullText({
        isFullTextShown: true
      });

      expect(action).toEqual({
        isFullTextShown: true,
        type: '[Banner] Toggle Full Text'
      });
    });
  });

  describe('setBannerUrl', () => {
    it('should create an action', () => {
      const action = fromBannerActions.setBannerUrl({
        url: 'rrrr'
      });

      expect(action).toEqual({
        url: 'rrrr',
        type: '[Banner] Set Banner Url'
      });
    });
  });

  describe('finishOpenBanner', () => {
    it('should create an action', () => {
      const action = fromBannerActions.finishOpenBanner();

      expect(action).toEqual({
        type: '[Banner] Finish open Banner'
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
