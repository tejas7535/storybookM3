import {
  Component,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { EChartsOption, SeriesOption, TooltipComponentOption } from 'echarts';
import { XAXisOption, YAXisOption } from 'echarts/types/dist/shared';
import { TopLevelFormatterParams } from 'echarts/types/src/component/tooltip/TooltipModel';

import { dimmedGrey } from '../../../shared/styles/colors';
import { KpiSeriesOption, MonthlyChartEntry } from '../model';

@Component({
  template: '',
  standalone: false,
})
export abstract class BaseForecastChartComponent {
  public data = input.required<MonthlyChartEntry[]>();
  public toggledKpis = input.required<Record<string, boolean>>();

  protected chartOptions: WritableSignal<EChartsOption | null> = signal(null);
  protected boundaryGap = false;

  protected readonly translocoLocaleService = inject(TranslocoLocaleService);

  public constructor() {
    effect(() =>
      this.chartOptions.set(
        this.generateChartOptions(this.data(), this.toggledKpis())
      )
    );
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
      formatter: (
        formatterInput: TopLevelFormatterParams,
        _: string
      ): string | HTMLElement | HTMLElement[] => {
        const parameters = Array.isArray(formatterInput)
          ? formatterInput
          : [formatterInput];

        let result = `${parameters[0].name}<br/>`;

        parameters.forEach((param) => {
          const marker =
            param.marker ||
            `<span class="inline-block mr-1 rounded-full w-2.5 h-2.5 bg-[${param.color}]"></span>`;

          // @ts-expect-error we enrich the data with the actualValue property
          const value = param?.data?.actualValue ?? param.data;

          const formattedValue = this.translocoLocaleService.localizeNumber(
            value as string | number,
            'decimal'
          );

          result += `${marker} ${param.seriesName} <span class="float-right ml-5 font-bold">${formattedValue}</span><br/>`;
        });

        return result;
      },
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
