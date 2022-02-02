import { BannerIconType } from '../../banner-text/banner-text.component';
import * as fromBannerActions from '../actions/banner.actions';
import { initialState, reducer } from './banner.reducer';

describe('In BannerReducer', () => {
  const openBanner = (
    text: string,
    buttonText: string,
    icon: BannerIconType,
    truncateSize: number
  ) =>
    fromBannerActions.openBanner({
      text,
      buttonText,
      icon,
      truncateSize,
    });
  const closeBanner = fromBannerActions.closeBanner();
  const toggleFullText = fromBannerActions.toggleFullText();

  it('should return initial state', () => {
    const action: any = {};
    const state = reducer(undefined, action);

    expect(state).toBe(initialState);
  });

  describe('OpenBannerAction', () => {
    it('should set given banner information and isFullTextShown false if truncateSize > 0', () => {
      const state = reducer(
        { ...initialState },
        openBanner('test', 'test', 'error', 10)
      );

      expect(state.text).toEqual('test');
      expect(state.buttonText).toEqual('test');
      expect(state.truncateSize).toEqual(10);
      expect(state.showFullText).toEqual(false);
      expect(state.open).toEqual(true);
    });

    it('should set given banner information and showFullText true if truncateSize = 0', () => {
      const state = reducer(
        { ...initialState },
        openBanner('test', 'test', 'error', 0)
      );

      expect(state.text).toEqual('test');
      expect(state.buttonText).toEqual('test');
      expect(state.truncateSize).toEqual(0);
      expect(state.showFullText).toEqual(true);
      expect(state.open).toEqual(true);
    });
  });

  describe('CloseBannerAction', () => {
    it('should reset state', () => {
      const state = reducer(
        {
          ...initialState,
          open: true,
        },
        closeBanner
      );

      expect(state.open).toEqual(false);
    });
  });

  describe('ToggleFullTextAction', () => {
    it('should toggle value of showFullText', () => {
      let state = reducer(
        {
          ...initialState,
        },
        toggleFullText
      );

      expect(state.showFullText).toEqual(true);

      state = reducer(
        {
          ...state,
        },
        toggleFullText
      );

      expect(state.showFullText).toEqual(false);
    });
  });
});
