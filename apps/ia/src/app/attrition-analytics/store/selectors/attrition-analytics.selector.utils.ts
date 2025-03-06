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
): BarChartConfig | undefined {
  const names: string[] = [
    translate('attritionAnalytics.barChart.unforcedFluctuation'),
    translate('attritionAnalytics.barChart.avgHeadcount'),
    translate('attritionAnalytics.barChart.totalUnforcedLeavers'),
  ];
  const sortedFeature = sortFeature(feature);
  if (!sortedFeature) {
    return undefined;
  }
  const xAxisSize = timePeriod === TimePeriod.MONTH ? 5 : 20;

  const barChartSerie: BarChartSerie = new BarChartSerie(names, [], color);
  const categories: string[] = [];
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

  const subtitle = createSubtitle(sortedFeature);

  return sortedFeature
    ? new BarChartConfig(
        sortedFeature.feature,
        subtitle,
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

export function createSubtitle(feature: EmployeeAnalytics): string {
  const overallText = translate(
    'attritionAnalytics.barChart.subtitle.toalEmployees',
    {
      headcount: feature.totalEmployees.headcount,
      leavers: feature.totalEmployees.leavers,
    }
  );

  if (
    !feature.notApplicableEmployees.headcount &&
    !feature.notApplicableEmployees.leavers
  ) {
    return overallText;
  }

  let notApplicableText = translate(
    'attritionAnalytics.barChart.subtitle.ofWhichNotApplicable'
  );

  if (feature.notApplicableEmployees.headcount > 0) {
    notApplicableText += ` ${translate('attritionAnalytics.barChart.subtitle.avgHeadcount')} ${feature.notApplicableEmployees.headcount}`;
  }
  if (
    feature.notApplicableEmployees.headcount > 0 &&
    feature.notApplicableEmployees.leavers > 0
  ) {
    notApplicableText += ` |`;
  }
  if (feature.notApplicableEmployees.leavers > 0) {
    notApplicableText += ` ${translate('attritionAnalytics.barChart.subtitle.unfLeavers')} ${feature.notApplicableEmployees.leavers}`;
  }

  return `${overallText}\n${notApplicableText}`;
}

export function sortFeature(
  feature: EmployeeAnalytics
): EmployeeAnalytics | undefined {
  if (!feature) {
    return undefined;
  }

  const names: string[] = [];
  const values: string[] = [];
  const headcount: number[] = [];
  const fluctuation: number[] = [];
  const order: number[] = [];

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
    totalEmployees: feature.totalEmployees,
    notApplicableEmployees: feature.notApplicableEmployees,
  };
}
