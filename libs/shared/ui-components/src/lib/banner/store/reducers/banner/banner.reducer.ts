import { Action, createReducer, on } from '@ngrx/store';

import * as BannerActions from '../../actions/banner/banner.actions';

export interface BannerState {
  text: string;
  buttonText: string;
  truncateSize: number;
  isFullTextShown: boolean;
  open: boolean;
  url: string;
}

export const initialState: BannerState = {
  text: '',
  buttonText: 'OK',
  truncateSize: 120,
  isFullTextShown: false,
  open: undefined,
  url: undefined
};

export const bannerReducer = createReducer(
  initialState,
  on(
    BannerActions.setBannerState,
    (state, { text, buttonText, truncateSize, isFullTextShown, open }) => ({
      ...state,
      text,
      buttonText,
      truncateSize,
      isFullTextShown,
      open
    })
  ),
  on(BannerActions.openBanner, (state, { text, buttonText, truncateSize }) => ({
    ...state,
    text,
    buttonText,
    truncateSize,
    isFullTextShown: truncateSize > 0 ? false : true
  })),
  on(BannerActions.finishOpenBanner, state => ({
    ...state,
    open: true
  })),
  on(BannerActions.closeBanner, state => ({
    ...state,
    open: false
  })),
  on(BannerActions.toggleFullText, (state, { isFullTextShown }) => ({
    ...state,
    isFullTextShown
  })),
  on(BannerActions.setBannerUrl, (state, { url }) => ({
    ...state,
    url
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: BannerState, action: Action): BannerState {
  return bannerReducer(state, action);
}
