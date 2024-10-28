import { createSelector } from '@ngrx/store';

import { NavItem } from '../../../shared/nav-buttons/models';
import {
  AttritionAnalyticsState,
  selectAttritionAnalyticsState,
} from '../index';

export const getAvailableClusters = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) =>
    state.clusters.data.data?.map(
      (cluster) =>
        new NavItem(
          cluster.name,
          undefined,
          `${cluster.availableFeatures}/${cluster.allFeatures}`,
          undefined,
          'attritionAnalytics.cluster.moreFeaturesAvailableTooltip'
        )
    )
);
