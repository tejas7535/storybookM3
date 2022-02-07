import { translate } from '@ngneat/transloco';

import { getPercentageValue } from '../../../overview/store/selectors/overview-selector-utils';
import { BarChartConfig } from '../../../shared/charts/models/bar-chart-config.model';
import { BarChartSerie } from '../../../shared/charts/models/bar-chart-serie.model';
import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import { FeatureParams } from '../../models/feature-params.model';
import { FeatureSelector } from '../../models/feature-selector.model';

export function mapEmployeeAnalyticsFeatureToBarChartConfig(
  features: EmployeeAnalytics[],
  overallAttritionRate: number,
  color: string
): BarChartConfig {
  let values: number[][] = [];
  const names: string[] = [
    translate('attritionAnalytics.barChart.attritionRate'),
    translate('attritionAnalytics.barChart.totalEmployees'),
  ];
  const barChartSerie: BarChartSerie = new BarChartSerie(names, [], color);
  for (const feature of features) {
    for (let index = 0; index < feature.values.length; index += 1) {
      const attrition =
        feature.employeeCount[index] !== 0
          ? feature.attritionCount[index] / feature.employeeCount[index]
          : 0;
      values.push([
        getPercentageValue(attrition),
        feature.employeeCount[index],
      ]);
    }

    barChartSerie.values.push(...values);
    values = [];
  }

  let categories: string[] = [];
  features.forEach((feat) => {
    categories = [...categories, ...feat.values];
  });

  return features
    ? new BarChartConfig(
        features[0].feature,
        [barChartSerie],
        categories,
        getPercentageValue(overallAttritionRate),
        translate('attritionAnalytics.barChart.overallAttritionRate'),
        translate('attritionAnalytics.barChart.belowOverall'),
        translate('attritionAnalytics.barChart.aboveOverall')
      )
    : undefined;
}

export function mapToFeatureSelectors(
  all: FeatureParams[],
  selected: FeatureParams[]
): FeatureSelector[] {
  const unselectedFeatures = all
    .filter(
      (feature) =>
        !selected ||
        !selected.some(
          (selectedFeature) =>
            JSON.stringify(feature) === JSON.stringify(selectedFeature)
        )
    )
    .map((feature) => new FeatureSelector(feature, false));

  const selectedFeatures = selected
    ? selected?.map((feature) => new FeatureSelector(feature, true))
    : [];

  return [...unselectedFeatures, ...selectedFeatures];
}

export const doFeatureParamsMatchFeature = (
  featureParams: FeatureParams,
  feature: EmployeeAnalytics
) =>
  featureParams.feature === feature.feature &&
  featureParams.region === feature.region &&
  featureParams.year === feature.year &&
  featureParams.month === feature.month;
