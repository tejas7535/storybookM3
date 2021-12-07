import { Injectable } from '@angular/core';

import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { DataPoint } from './data-point.model';

@Injectable()
export class BomChartConfigService {
  constructor(private readonly localeService: TranslocoLocaleService) {}

  public getXAxisConfig = (hasNegativeCostValues: boolean) => [
    {
      type: 'value',
      axisLine: { show: false },
      axisTick: {
        show: false,
      },
      axisLabel: {
        formatter: '{value} €',
        color: '#646464',
      },
    },
    {
      type: 'value',
      axisLabel: {
        formatter: '{value} %',
        color: '#646464',
      },
      axisLine: { show: false },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      min: hasNegativeCostValues ? -20 : 0,
      itemStyle: {
        color: 'red',
      },
    },
  ];

  public getChartSeries = (
    barChartData: DataPoint[],
    lineChartData: number[]
  ): any => [
    {
      type: 'bar',
      data: barChartData,
      barMaxWidth: 20,
      itemStyle: {
        borderRadius: 10,
      },
      tooltip: {
        formatter: this.barchartTooltipFormatter,
      },
    },
    {
      type: 'line',
      xAxisIndex: 1,
      data: lineChartData,
      tooltip: {
        formatter: this.linechartTooltipFormatter,
      },
    },
  ];

  private readonly barchartTooltipFormatter = (params: {
    name: string;
    value: number;
    [key: string]: any;
  }): string =>
    `${params.name}: ${this.localeService.localizeNumber(
      params.value,
      'decimal'
    )}€`;

  private readonly linechartTooltipFormatter = (params: {
    value: number;
    [key: string]: any;
  }): string =>
    `${this.localeService.localizeNumber(params.value, 'decimal')}%`;
}
