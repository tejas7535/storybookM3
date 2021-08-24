import { createSelector } from '@ngrx/store';

import { AttritionAnalyticsState, selectAttritionAnalyticsState } from '..';
import { EmployeeAnalyticsFeature } from '../../models/employee-analytics-feature.model';
import { mapEmployeeAnalyticsFeatureToBarChartConfig } from './attrition-analytics.selector.utils';

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
        ? mapEmployeeAnalyticsFeatureToBarChartConfig(feature, average, color)
        : undefined
  );
