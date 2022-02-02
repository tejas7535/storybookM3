import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { BannerIconType } from '../../banner-text/banner-text.component';
import * as BannerActions from '../actions/banner.actions';

export interface BannerState {
  text: string;
  buttonText: string;
  icon: BannerIconType;
  truncateSize: number;
  showFullText: boolean;
  open: boolean;
}

export const initialState: BannerState = {
  text: undefined,
  buttonText: undefined,
  icon: undefined,
  truncateSize: undefined,
  showFullText: false,
  open: false,
};

export const bannerReducer = createReducer(
  initialState,
  on(
    BannerActions.openBanner,
    (state, { text, buttonText, icon, truncateSize }): BannerState => ({
      ...state,
      text,
      buttonText,
      icon,
      truncateSize,
      showFullText: truncateSize > 0 ? false : true,
      open: true,
    })
  ),
  on(BannerActions.closeBanner, (): BannerState => initialState),
  on(
    BannerActions.toggleFullText,
    (state): BannerState => ({
      ...state,
      showFullText: !state.showFullText,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: BannerState, action: Action): BannerState {
  return bannerReducer(state, action);
}

export const getBannerState = createFeatureSelector<BannerState>('banner');
