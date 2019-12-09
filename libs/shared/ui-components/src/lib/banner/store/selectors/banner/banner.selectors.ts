import { createSelector } from '@ngrx/store';

import { getBannerState } from '../../reducers';

export const getBannerText = createSelector(
  getBannerState,
  state => state.text
);

export const getBannerButtonText = createSelector(
  getBannerState,
  state => state.buttonText
);

export const getBannerTruncateSize = createSelector(
  getBannerState,
  state => state.truncateSize
);

export const getBannerIsFullTextShown = createSelector(
  getBannerState,
  state => state.isFullTextShown
);

export const getBannerOpen = createSelector(
  getBannerState,
  state => state.open
);

export const getBannerUrl = createSelector(
  getBannerState,
  state => state.url
);
