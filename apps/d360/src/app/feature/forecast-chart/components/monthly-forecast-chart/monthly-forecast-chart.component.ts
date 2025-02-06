import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { format } from 'date-fns';
import { NgxEchartsModule } from 'ngx-echarts';

import {
  getMonthYearDateFormatByCode,
  LocaleType,
} from '../../../../shared/constants/available-locales';
import { schaefflerColor } from '../../../../shared/styles/colors';
import { chartSeriesConfig, MonthlyChartEntry } from '../../model';
import { BaseForecastChartComponent } from '../base-forecast-chart.component';

@Component({
  selector: 'd360-monthly-forecast-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: '../base-forecast-chart.component.html',
  styleUrl: '../base-forecast-chart.component.scss',
})
export class MonthlyForecastChartComponent extends BaseForecastChartComponent {
  protected formatXAxisData(data: MonthlyChartEntry[]): string[] | number[] {
    return data.map((d: { yearMonth: string }) =>
      this.translocoLocaleService.localizeDate(
        d.yearMonth,
        this.translocoLocaleService.getLocale(),
        { month: '2-digit', year: 'numeric' }
      )
    );
  }

  protected createSeries(data: MonthlyChartEntry[]): any[] {
    return [
      this.createLineSeries('deliveries', data),
      this.createLineSeries('orders', data),
      this.createLineSeries('onTopOrder', data),
      this.createLineSeries('onTopCapacityForecast', data),
      this.createLineSeries('salesAmbition', data),
      this.createLineSeries('opportunities', data),
      {
        name: translate('home.chart.legend.rollingSalesForecast'),
        kpi: 'rollingSalesForecast',
        color: chartSeriesConfig.rollingSalesForecast.color,
        type: 'line',
        lineStyle: {
          normal: {
            color: chartSeriesConfig.rollingSalesForecast.color,
            width: 1,
            type: [5, 5],
          },
        },
        data: data.map((e) => e.rollingSalesForecast),
        zlevel: 2,
      },
      {
        // Reference line for the current month with no kpi - always visible
        type: 'line',
        itemStyle: { normal: { color: schaefflerColor, showLabel: false } },
        zlevel: 1,
        markLine: {
          label: { show: false, showLabel: false },
          lineStyle: { dashOffset: '0', width: 1, type: 'solid' },
          symbol: 'none',
          data: [
            {
              symbol: 'none',
              xAxis: format(
                new Date(),
                getMonthYearDateFormatByCode(
                  this.translocoLocaleService.getLocale() as LocaleType
                ).display.dateInput
              ),
            },
          ],
        },
      },
    ];
  }

  private createLineSeries(
    kpi: keyof typeof chartSeriesConfig,
    entries: MonthlyChartEntry[]
  ): any {
    return {
      name: translate(`home.chart.legend.${kpi}`),
      kpi,
      type: 'line',
      stack: 'Total',
      color: chartSeriesConfig[kpi].color,
      symbol: 'none',
      areaStyle: { opacity: 1 },
      data: entries.map((e) => e[kpi]),
      zlevel: -1,
      z: (10 - chartSeriesConfig[kpi].order) * 10,
    };
  }
}
