import { createSelector } from '@ngrx/store';

import { getSelectedTimePeriod } from '../../../core/store/selectors';
import { TimePeriod } from '../../../shared/models';
import { NavItem } from '../../../shared/nav-buttons/models';
import {
  AttritionAnalyticsState,
  selectAttritionAnalyticsState,
} from '../index';
import * as utils from './attrition-analytics.selector.utils';

export const getAvailableClusters = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => {
    const analytics = state.employeeAnalytics;
    const selectedCluster = state.clusters.selected;

    return state.clusters.data.data?.map((cluster) => {
      const availableFeatures = analytics.data?.length;
      const allFeatures = cluster.allFeaturesCount;
      const loading = analytics.loading;

      let badge;

      if (cluster.name === selectedCluster && !loading) {
        badge = `${availableFeatures}/${allFeatures}`;
      }

      return new NavItem(
        cluster.name,
        undefined,
        badge,
        undefined,
        state.employeeAnalytics.data !== undefined &&
        state.employeeAnalytics.data.length < cluster.allFeaturesCount
          ? 'attritionAnalytics.cluster.moreFeaturesAvailableTooltip'
          : undefined
      );
    });
  }
);

export const getClustersLoading = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.clusters.data.loading
);

export const getSelectedCluster = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.clusters.selected
);

export const getEmployeeAnalyticsData = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.employeeAnalytics.data
);

export const getEmployeeAnalyticsLoading = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.employeeAnalytics.loading
);

export const getEmployeeAnalytics = createSelector(
  selectAttritionAnalyticsState,
  getSelectedTimePeriod,
  (state: AttritionAnalyticsState, timePeriod: TimePeriod) =>
    state.employeeAnalytics.data
      ? state.employeeAnalytics.data.map((d) =>
          utils.mapEmployeeAnalyticsFeatureToBarChartConfig(
            d,
            state.clusters.data.data.find(
              (c) => c.name === state.clusters.selected
            )?.color,
            timePeriod
          )
        )
      : undefined
);
