import { translate } from '@jsverse/transloco';

import { getPercentageValue } from '../../../reasons-and-counter-measures/store/selectors/reasons-and-counter-measures.selector.utils';
import { ReferenceValue } from '../../../shared/charts/models';
import { BarChartConfig } from '../../../shared/charts/models/bar-chart-config.model';
import { BarChartSerie } from '../../../shared/charts/models/bar-chart-serie.model';
import { TimePeriod } from '../../../shared/models';
import { EmployeeAnalytics } from '../../models/employee-analytics.model';

export function mapEmployeeAnalyticsFeatureToBarChartConfig(
  feature: EmployeeAnalytics,
  color: string,
  timePeriod?: TimePeriod
): BarChartConfig {
  const names: string[] = [
    translate('attritionAnalytics.barChart.unforcedFluctuation'),
    translate('attritionAnalytics.barChart.headcount'),
    translate('attritionAnalytics.barChart.totalUnforcedLeavers'),
  ];
  const sortedFeature = sortFeature(feature);
  const xAxisSize = timePeriod === TimePeriod.MONTH ? 5 : 20;

  const barChartSerie: BarChartSerie = new BarChartSerie(names, [], color);
  const categories = [];
  for (let i = 0; i < sortedFeature.names.length; i += 1) {
    barChartSerie.values.push([
      getPercentageValue(
        sortedFeature.fluctuation[i],
        sortedFeature.headcount[i]
      ),
      sortedFeature.headcount[i],
      sortedFeature.fluctuation[i],
    ]);
    categories.push(sortedFeature.names[i] ?? sortedFeature.values[i]);
  }

  return sortedFeature
    ? new BarChartConfig(
        sortedFeature.feature,
        [barChartSerie],
        categories,
        new ReferenceValue(
          sortedFeature.overallFluctuationRate,
          translate('attritionAnalytics.barChart.overallUnforcedFluctuation'),
          translate('attritionAnalytics.barChart.belowAverage'),
          translate('attritionAnalytics.barChart.aboveAverage')
        ),
        xAxisSize
      )
    : undefined;
}

export function sortFeature(feature: EmployeeAnalytics): EmployeeAnalytics {
  if (!feature) {
    return undefined;
  }

  const names = [];
  const values = [];
  const headcount = [];
  const fluctuation = [];
  const order = [];

  const sorted = feature.order
    .map((value, index) => ({ value, index }))
    .sort((a, b) => a.value - b.value);

  for (const { index } of sorted) {
    names.push(feature.names[index]);
    values.push(feature.values[index]);
    headcount.push(feature.headcount[index]);
    fluctuation.push(feature.fluctuation[index]);
    order.push(feature.order[index]);
  }

  return {
    feature: feature.feature,
    names,
    values,
    headcount,
    fluctuation,
    order,
    overallFluctuationRate: feature.overallFluctuationRate,
  };
}
