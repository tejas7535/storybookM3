import { createSelector } from '@ngrx/store';

import { Color } from '../../../shared/models/color.enum';
import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import { FeatureParams } from '../../models/feature-params.model';
import { AttritionAnalyticsState, selectAttritionAnalyticsState } from '..';
import {
  mapEmployeeAnalyticsFeatureToBarChartConfig,
  mapToFeatureSelectors,
} from './attrition-analytics.selector.utils';

export const getEmployeeAnalyticsLoading = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.employeeAnalytics.features.loading
);

export const getAvailableFeatures = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) =>
    state.employeeAnalytics.availableFeatures.data
);

export const getAvailableFeaturesLoading = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) =>
    state.employeeAnalytics.availableFeatures.loading
);

export const getSelectedFeatureParams = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.selectedByUser.features
);

export const getFeatureSelectors = createSelector(
  getAvailableFeatures,
  getSelectedFeatureParams,
  (availableFeatures: FeatureParams[], selected: FeatureParams[]) =>
    availableFeatures
      ? mapToFeatureSelectors(availableFeatures, selected)
      : undefined
);

export const getSelectedFeatures = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.employeeAnalytics.features.data
);

export const getBarChartConfigsForSelectedFeatures = createSelector(
  getSelectedFeatures,
  (selectedFeatures: EmployeeAnalytics[]) => {
    const colors = [
      Color.LIME,
      Color.PICTON_BLUE,
      Color.LIGHT_BLUE,
      Color.GOLDEN_ROD,
    ];

    return selectedFeatures
      ? selectedFeatures.map((feature, index) => {
          const config = mapEmployeeAnalyticsFeatureToBarChartConfig(
            [feature],
            feature.overallAttritionRate,
            colors[index]
          );

          return config;
        })
      : undefined;
  }
);

export const getFeatureImportanceLoading = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.featureImportance.loading
);

export const getFeatureImportanceGroups = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.featureImportance.data
);

export const getFeatureImportancePageable = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.featureImportance.pageable
);

export const getFeatureImportanceHasNext = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.featureImportance.hasNext
);

export const getFeatureImportanceSort = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.featureImportance.sort
);

export const getFeatureImportanceSortDirection = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.featureImportance.sort.direction
);
