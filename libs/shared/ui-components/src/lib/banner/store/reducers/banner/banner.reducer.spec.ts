import * as fromBannerActions from '../../actions/banner/banner.actions';
import { bannerReducer, initialState } from './banner.reducer';

describe('In BannerReducer', () => {
  it('should return default state', () => {
    const action: any = {};
    const state = bannerReducer(undefined, action);

    expect(state).toBe(initialState);

    expect(state.text).toEqual('');
    expect(state.buttonText).toEqual('OK');
    expect(state.truncateSize).toEqual(120);
    expect(state.isFullTextShown).toEqual(false);
    expect(state.open).toEqual(undefined);
    expect(state.url).toEqual(undefined);
  });

  describe('SetBannerStateAction', () => {
    it('should set given state', () => {
      const action = fromBannerActions.setBannerState({
        text: 'test',
        buttonText: 'test',
        truncateSize: 10,
        isFullTextShown: false,
        open: true
      });
      const state = bannerReducer({ ...initialState }, action);

      expect(state.text).toEqual('test');
      expect(state.buttonText).toEqual('test');
      expect(state.truncateSize).toEqual(10);
      expect(state.isFullTextShown).toEqual(false);
      expect(state.open).toEqual(true);
      expect(state.url).toEqual(undefined);
    });
  });

  describe('OpenBannerAction', () => {
    it('should set given banner information and isFullTextShown false if truncateSize > 0', () => {
      const action = fromBannerActions.openBanner({
        component: '',
        text: 'test',
        buttonText: 'test',
        truncateSize: 10
      });
      const state = bannerReducer({ ...initialState }, action);

      expect(state.text).toEqual('test');
      expect(state.buttonText).toEqual('test');
      expect(state.truncateSize).toEqual(10);
      expect(state.isFullTextShown).toEqual(false);
      expect(state.open).toEqual(undefined);
      expect(state.url).toEqual(undefined);
    });

    it('should set given banner information and isFullTextShown true if truncateSize = 0', () => {
      const action = fromBannerActions.openBanner({
        component: '',
        text: 'test',
        buttonText: 'test',
        truncateSize: 0
      });
      const state = bannerReducer({ ...initialState }, action);

      expect(state.text).toEqual('test');
      expect(state.buttonText).toEqual('test');
      expect(state.truncateSize).toEqual(0);
      expect(state.isFullTextShown).toEqual(true);
      expect(state.open).toEqual(undefined);
      expect(state.url).toEqual(undefined);
    });
  });

  describe('FinishOpenBannerAction', () => {
    it('should set open to true', () => {
      const action = fromBannerActions.finishOpenBanner();
      const state = bannerReducer({ ...initialState }, action);

      expect(state.text).toEqual('');
      expect(state.buttonText).toEqual('OK');
      expect(state.truncateSize).toEqual(120);
      expect(state.isFullTextShown).toEqual(false);
      expect(state.open).toEqual(true);
      expect(state.url).toEqual(undefined);
    });
  });

  describe('CloseBannerAction', () => {
    it('should set open to false', () => {
      const action = fromBannerActions.closeBanner();
      const state = bannerReducer(
        {
          ...initialState,
          open: true
        },
        action
      );

      expect(state.text).toEqual('');
      expect(state.buttonText).toEqual('OK');
      expect(state.truncateSize).toEqual(120);
      expect(state.isFullTextShown).toEqual(false);
      expect(state.open).toEqual(false);
      expect(state.url).toEqual(undefined);
    });
  });

  describe('ToggleFullTextAction', () => {
    it('should set isFullTextShown to the given value', () => {
      let action = fromBannerActions.toggleFullText({ isFullTextShown: true });
      let state = bannerReducer(
        {
          ...initialState
        },
        action
      );

      expect(state.text).toEqual('');
      expect(state.buttonText).toEqual('OK');
      expect(state.truncateSize).toEqual(120);
      expect(state.isFullTextShown).toEqual(true);
      expect(state.open).toEqual(undefined);
      expect(state.url).toEqual(undefined);

      action = fromBannerActions.toggleFullText({ isFullTextShown: false });
      state = bannerReducer(
        {
          ...state
        },
        action
      );

      expect(state.text).toEqual('');
      expect(state.buttonText).toEqual('OK');
      expect(state.truncateSize).toEqual(120);
      expect(state.isFullTextShown).toEqual(false);
      expect(state.open).toEqual(undefined);
      expect(state.url).toEqual(undefined);
    });
  });

  describe('SetBannerUrlAction', () => {
    it('should set url to the given value', () => {
      let action = fromBannerActions.setBannerUrl({ url: 'url1' });
      let state = bannerReducer(
        {
          ...initialState
        },
        action
      );

      expect(state.text).toEqual('');
      expect(state.buttonText).toEqual('OK');
      expect(state.truncateSize).toEqual(120);
      expect(state.isFullTextShown).toEqual(false);
      expect(state.open).toEqual(undefined);
      expect(state.url).toEqual('url1');

      action = fromBannerActions.setBannerUrl({ url: 'url2' });
      state = bannerReducer(
        {
          ...state
        },
        action
      );

      expect(state.text).toEqual('');
      expect(state.buttonText).toEqual('OK');
      expect(state.truncateSize).toEqual(120);
      expect(state.isFullTextShown).toEqual(false);
      expect(state.open).toEqual(undefined);
      expect(state.url).toEqual('url2');
    });
  });
});
