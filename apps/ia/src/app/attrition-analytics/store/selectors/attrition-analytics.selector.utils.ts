import { getPercentageValue } from '../../../overview/store/selectors/overview-selector-utils';
import { BarChartConfig } from '../../../shared/charts/models/bar-chart-config.model';
import { BarChartSerie } from '../../../shared/charts/models/bar-chart-serie.model';
import { EmployeeAnalyticsFeature } from '../../models/employee-analytics-feature.model';

export function mapEmployeeAnalyticsFeatureToBarChartConfig(
  feature: EmployeeAnalyticsFeature,
  average: number,
  color: string
): BarChartConfig {
  const values: number[][] = [];

  for (let index = 0; index < feature.values.length; index += 1) {
    const attrition =
      feature.employeeCount[index] !== 0
        ? feature.attritionCount[index] / feature.employeeCount[index]
        : 0;
    values.push([getPercentageValue(attrition), feature.employeeCount[index]]);
  }

  const barChartSerie: BarChartSerie = new BarChartSerie(
    ['Attr. Rate', 'num. Employees'],
    values,
    color
  );

  return feature
    ? new BarChartConfig(
        feature.name,
        [barChartSerie],
        feature.values,
        average,
        'Below average',
        'Above average'
      )
    : undefined;
}
