import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import * as BannerActions from '../actions/banner.actions';

export interface BannerState {
  text: string;
  buttonText: string;
  icon: string;
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
    (state, { text, buttonText, icon, truncateSize }) => ({
      ...state,
      text,
      buttonText,
      icon,
      truncateSize,
      showFullText: truncateSize > 0 ? false : true,
      open: true,
    })
  ),
  on(BannerActions.closeBanner, () => initialState),
  on(BannerActions.toggleFullText, (state) => ({
    ...state,
    showFullText: !state.showFullText,
  }))
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: BannerState, action: Action): BannerState {
  return bannerReducer(state, action);
}

export const getBannerState = createFeatureSelector<BannerState>('banner');
