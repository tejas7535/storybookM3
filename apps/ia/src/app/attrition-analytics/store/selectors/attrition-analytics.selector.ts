import { createSelector } from '@ngrx/store';

import { IdValue } from '../../../shared/models';
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

export const getAvailableRegionsIdValues = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => {
    const allRegions = state.employeeAnalytics.availableFeatures.data?.map(
      (featureParam) => featureParam.region
    );

    const idValues: IdValue[] = [...new Set(allRegions)].map(
      (region) => new IdValue(region, region)
    );

    return idValues;
  }
);

export const getSelectedRegion = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.filter.selectedRegion
);

export const getAllAvailableFeatures = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) =>
    state.employeeAnalytics.availableFeatures.data
);

export const getAvailableFeaturesForSelectedRegion = createSelector(
  getAllAvailableFeatures,
  getSelectedRegion,
  (featureParams: FeatureParams[], selectedRegion: string) =>
    featureParams?.filter((feature) => feature.region === selectedRegion)
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

export const getFeatureSelectorsForSelectedRegion = createSelector(
  getAvailableFeaturesForSelectedRegion,
  getSelectedFeatureParams,
  getSelectedRegion,
  (
    availableFeatures: FeatureParams[],
    selected: FeatureParams[],
    selectedRegion: string
  ) =>
    availableFeatures
      ? mapToFeatureSelectors(
          availableFeatures,
          selected.filter((feature) => feature.region === selectedRegion)
        )
      : undefined
);

export const getSelectedFeatures = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.employeeAnalytics.features.data
);

export const getFeatureOverallAttritionRate = createSelector(
  getSelectedFeatures,
  getSelectedRegion,
  (selectedFeatures: EmployeeAnalytics[], selectedRegion: string) =>
    selectedFeatures?.find((feature) => feature.region === selectedRegion)
      ?.overallAttritionRate // overall attrition rate is the same for all features
);

export const getYearFromCurrentFilters = createSelector(
  getAvailableFeaturesForSelectedRegion,
  (featureParams: FeatureParams[]) =>
    featureParams ? featureParams[0].year : undefined
);

export const getMonthFromCurrentFilters = createSelector(
  getAvailableFeaturesForSelectedRegion,
  (featureParams: FeatureParams[]) =>
    featureParams ? featureParams[0].month : undefined
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
