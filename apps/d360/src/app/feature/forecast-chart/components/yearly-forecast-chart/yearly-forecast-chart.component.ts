import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { getYear } from 'date-fns';
import { SeriesOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import {
  chartSeriesConfig,
  ChartValues,
  CleanedUpNegativeData,
  KpiValues,
  MonthlyChartEntry,
  YearlyChartEntry,
} from '../../model';
import { BaseForecastChartComponent } from '../base-forecast-chart.component';

type ExtendedSeriesOption = SeriesOption & {
  kpi?: KpiValues;
};

@Component({
  selector: 'd360-yearly-forecast-chart',
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: '../base-forecast-chart.component.html',
  styleUrl: '../base-forecast-chart.component.scss',
})
export class YearlyForecastChartComponent extends BaseForecastChartComponent {
  protected boundaryGap = true;

  protected formatXAxisData(data: MonthlyChartEntry[]) {
    return [...new Set(data.map((entry) => getYear(entry.yearMonth)))];
  }

  protected createSeries(data: MonthlyChartEntry[]): ExtendedSeriesOption[] {
    const yearlyAggregation = this.aggregateByYear(data);

    return [
      this.createBarSeries(KpiValues.Deliveries, yearlyAggregation),
      ...(this.includeSalesData()
        ? [this.createBarSeries(KpiValues.BwDelta, yearlyAggregation)]
        : []),
      this.createBarSeries(KpiValues.Orders, yearlyAggregation),
      this.createBarSeries(KpiValues.OnTopOrder, yearlyAggregation),
      this.createBarSeries(KpiValues.OnTopCapacityForecast, yearlyAggregation),
      this.createBarSeries(KpiValues.SalesAmbition, yearlyAggregation),
      this.createBarSeries(KpiValues.Opportunities, yearlyAggregation),
      {
        name: translate('home.chart.legend.salesPlan'),
        kpi: KpiValues.SalesPlan,
        type: 'bar',
        data: yearlyAggregation.map((entry) => entry.salesPlan),
        barGap: '-100%',
        itemStyle: {
          color: 'transparent',
          borderColor: chartSeriesConfig.salesPlan.color,
          borderWidth: 1,
          borderType: 'dashed',
        },
        tooltip: {
          // not showing this dataset in the tooltip as its color is transparent.
          // We use the dummy dataset below to render the sales plan
          // entry in the tooltip properly
          show: false,
        },
        z: 100,
      },
      this.createDummySalesPlanSeries(yearlyAggregation),
    ];
  }

  private aggregateByYear(entries: MonthlyChartEntry[]): YearlyChartEntry[] {
    const getCleanedUpNegativeValues = (
      value: number
    ): CleanedUpNegativeData => ({
      value: value < 0 ? 0 : value || 0,
      actualValue: value || 0,
    });

    // To favor readability & concise code, we use map/reduce to aggregate the data by year.
    // eslint-disable-next-line unicorn/no-array-reduce
    const aggregationByYear = entries.reduce((acc, entry) => {
      const year = new Date(entry.yearMonth).getFullYear();
      if (!acc.has(year)) {
        acc.set(year, {
          year,
          orders: 0,
          deliveries: 0,
          opportunities: 0,
          salesAmbition: 0,
          onTopCapacityForecast: 0,
          onTopOrder: 0,
          salesPlan: 0,
          bwDelta: 0,
        });
      }

      const agg = acc.get(year);
      agg.orders += entry.orders;
      agg.deliveries += entry.deliveries;
      agg.opportunities += entry.opportunities;
      agg.salesAmbition += entry.salesAmbition;
      agg.onTopCapacityForecast += entry.onTopCapacityForecast;
      agg.onTopOrder += entry.onTopOrder;
      agg.salesPlan += entry.salesPlan || 0;
      agg.bwDelta += entry.bwDelta || 0;

      return acc;
    }, new Map<number, YearlyChartEntry>());

    return [...aggregationByYear.values()].map((entry) => ({
      ...entry,
      salesAmbition: getCleanedUpNegativeValues(entry.salesAmbition),
      bwDelta: getCleanedUpNegativeValues(entry.bwDelta),
    })) as unknown as YearlyChartEntry[];
  }

  private createBarSeries(
    kpi: ChartValues,
    data: YearlyChartEntry[]
  ): ExtendedSeriesOption {
    return {
      name: translate(`home.chart.legend.${kpi}`),
      kpi,
      type: 'bar',
      stack: 'Total',
      color: chartSeriesConfig[kpi].color,
      data: data.map((entry) => entry[kpi]),
    };
  }

  /**
   * Creates a dummy series to render the sales Plan entry in the tooltip.
   * The actual data set is not visible in the chart due to opacity set to '0'.
   *
   * However, it properly appears in the tooltip with the correct color.
   *
   * @param yearlyAggregation
   * @private
   */
  private createDummySalesPlanSeries(
    yearlyAggregation: YearlyChartEntry[]
  ): SeriesOption {
    return {
      name: translate('home.chart.legend.salesPlan'),
      type: 'bar',
      color: chartSeriesConfig.salesPlan.color,
      data: yearlyAggregation.map((entry) => entry.salesPlan),
      itemStyle: { opacity: 0 },
    };
  }
}
