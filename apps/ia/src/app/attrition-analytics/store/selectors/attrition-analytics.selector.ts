import { createSelector } from '@ngrx/store';

import { AttritionAnalyticsState, selectAttritionAnalyticsState } from '..';
import { Color } from '../../../shared/models/color.enum';
import { EmployeeAnalyticsFeature } from '../../models/employee-analytics-feature.model';
import {
  mapEmployeeAnalyticsFeatureToBarChartConfig,
  mapToFeatureSelectors,
} from './attrition-analytics.selector.utils';

export const getEmployeeAnalyticsFeature = (name: string) =>
  createSelector(
    selectAttritionAnalyticsState,
    (state: AttritionAnalyticsState) =>
      state.employeeAnalytics.data?.features.find(
        (feature) => feature.name === name
      )
  );

export const getEmployeeAnalyticsAverage = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) =>
    state.employeeAnalytics.data?.avgAttritionRate
);

export const getEmployeeAnalyticsBarChartConfig = (
  name: string,
  color: string
) =>
  createSelector(
    getEmployeeAnalyticsFeature(name),
    getEmployeeAnalyticsAverage,
    (feature: EmployeeAnalyticsFeature, average: number) =>
      feature && average
        ? mapEmployeeAnalyticsFeatureToBarChartConfig([feature], average, color)
        : undefined
  );

export const getAllFeatureNames = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) =>
    state.employeeAnalytics.data?.features.map((feature) => feature.name)
);

export const getSelectedFeatureNames = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => state.selectedByUser.features
);

export const getFeatureSelectors = createSelector(
  getAllFeatureNames,
  getSelectedFeatureNames,
  (all: string[], selected: string[]) =>
    all ? mapToFeatureSelectors(all, selected) : undefined
);

export const getSelectedFeatures = createSelector(
  selectAttritionAnalyticsState,
  (state: AttritionAnalyticsState) => {
    const selectedFeatures: EmployeeAnalyticsFeature[] = [];
    const selectedFeatureNames = state.selectedByUser.features;
    const allFeatures = state.employeeAnalytics.data;

    selectedFeatureNames?.forEach((selectedFeatureName) => {
      const selectedFeature = allFeatures?.features.find(
        (feature) => feature.name === selectedFeatureName
      );
      selectedFeatures.push(selectedFeature);
    });

    return selectedFeatureNames && allFeatures ? selectedFeatures : undefined;
  }
);

export const getBarChartConfigsForSelectedFeatures = createSelector(
  getSelectedFeatures,
  getEmployeeAnalyticsAverage,
  (selectedFeatures: EmployeeAnalyticsFeature[], average: number) => {
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
            average,
            colors[index]
          );

          return config;
        })
      : undefined;
  }
);
