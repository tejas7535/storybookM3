import { createSelector } from '@ngrx/store';

import { getBannerState } from '../reducers/banner.reducer';

export const getBannerText = createSelector(
  getBannerState,
  state => state.text
);

export const getBannerButtonText = createSelector(
  getBannerState,
  state => state.buttonText
);

export const getBannerIcon = createSelector(
  getBannerState,
  state => state.icon
);

export const getBannerTruncateSize = createSelector(
  getBannerState,
  state => state.truncateSize
);

export const getBannerIsFullTextShown = createSelector(
  getBannerState,
  state => state.showFullText
);

export const getBannerOpen = createSelector(
  getBannerState,
  state => state.open
);
