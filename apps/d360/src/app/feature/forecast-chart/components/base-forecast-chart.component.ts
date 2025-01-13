import { Component, effect, inject, input } from '@angular/core';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { EChartsOption, SeriesOption, TooltipComponentOption } from 'echarts';
import { XAXisOption, YAXisOption } from 'echarts/types/dist/shared';
import { OptionDataValue } from 'echarts/types/src/util/types';

import { dimmedGrey } from '../../../shared/styles/colors';
import { KpiSeriesOption, MonthlyChartEntry } from '../model';

@Component({
  template: '',
})
export abstract class BaseForecastChartComponent {
  public data = input.required<MonthlyChartEntry[]>();
  public toggledKpis = input.required<Record<string, boolean>>();

  protected chartOptions: EChartsOption | null = null;
  protected boundaryGap = false;

  protected readonly translocoLocaleService = inject(TranslocoLocaleService);

  constructor() {
    effect(() => {
      const data = this.data();
      const toggledKpis = this.toggledKpis();
      this.chartOptions = this.generateChartOptions(data, toggledKpis);
    });
  }

  protected abstract createSeries(
    processedData: MonthlyChartEntry[]
  ): SeriesOption[];

  protected abstract formatXAxisData(
    data: MonthlyChartEntry[]
  ): string[] | number[];

  private generateChartOptions(
    data: MonthlyChartEntry[],
    toggledKpis: Record<string, boolean>
  ): EChartsOption {
    if (!data || !toggledKpis) {
      return null;
    }

    const initialSeries = this.createSeries(data);
    const seriesWithVisibleKpis = initialSeries.filter(
      (seriesEntry: KpiSeriesOption) => !toggledKpis[seriesEntry.kpi]
    );

    return {
      grid: {
        left: '120px',
        right: '30px',
        top: '10px',
        bottom: '30px',
      },
      animationDuration: 1500,
      axisPointer: { lineStyle: { type: 'solid' } },
      tooltip: this.createTooltip(),
      xAxis: this.createXAxis(data),
      yAxis: this.createYAxis(),
      series: seriesWithVisibleKpis,
    };
  }

  protected createTooltip(): TooltipComponentOption {
    return {
      trigger: 'axis',
      alwaysShowContent: false,
      valueFormatter: (value: OptionDataValue | OptionDataValue[]) =>
        Array.isArray(value)
          ? value
              .map((v) =>
                this.translocoLocaleService.localizeNumber(
                  v as string | number,
                  'decimal'
                )
              )
              .join(',')
          : this.translocoLocaleService.localizeNumber(
              value as string | number,
              'decimal'
            ),
      axisPointer: {
        axis: 'auto',
        type: 'line',
        label: {
          backgroundColor: '#fff',
        },
      },
    };
  }

  protected createXAxis(data: any): XAXisOption {
    return {
      type: 'category',
      boundaryGap: this.boundaryGap,
      data: this.formatXAxisData(data),
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: dimmedGrey,
          opacity: 0.2,
        },
      },
    };
  }

  protected createYAxis(): YAXisOption {
    return {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: dimmedGrey,
        },
      },
      axisLabel: {
        formatter: (value) =>
          this.translocoLocaleService.localizeNumber(value, 'decimal'),
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: dimmedGrey,
          opacity: 0.2,
        },
      },
    };
  }
}
