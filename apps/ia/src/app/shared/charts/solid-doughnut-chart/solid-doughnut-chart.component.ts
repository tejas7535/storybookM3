import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EChartsOption, SeriesOption } from 'echarts';

import { ExternalLegend } from '../external-legend';
import { LegendSelectAction } from '../models';
import { ChartLegendItem } from '../models/chart-legend-item.model';
import { DoughnutChartData } from '../models/doughnut-chart-data.model';
import { SolidDoughnutChartConfig } from '../models/solid-doughnut-chart-config.model';
import {
  createMediaQueries,
  createSolidDoughnutChartBaseOptions,
  createSolidDoughnutChartSeries,
} from './solid-doughnut-chart.config';

@Component({
  selector: 'ia-solid-doughnut-chart',
  templateUrl: './solid-doughnut-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolidDoughnutChartComponent extends ExternalLegend {
  options: EChartsOption;
  mergeOptions: EChartsOption;
  _data: DoughnutChartData[];
  legend: ChartLegendItem[];

  @Input() isLoading: boolean;

  @Input() set titleInside(inside: boolean) {
    this.setTitlePosition(inside);
  }

  @Input() set initialConfig(config: SolidDoughnutChartConfig) {
    const baseOptions: EChartsOption =
      createSolidDoughnutChartBaseOptions(config);

    const series: SeriesOption[] = createSolidDoughnutChartSeries(config.title);
    const media = createMediaQueries();
    this.options = {
      ...baseOptions,
      series,
      media,
    };

    this.setCurrentData();
  }

  @Input() set data(data: DoughnutChartData[]) {
    this._data = data;
    if (data) {
      this.resetSelection();
      this.setData(data);
    }
  }

  @Input() set legendSelectAction(action: LegendSelectAction) {
    if (action) {
      this.echartsInstance?.setOption({
        legend: {
          selected: action,
        },
      });
    }
  }

  setData(data: DoughnutChartData[]): void {
    this.mergeOptions = {
      ...this.mergeOptions,
      title: {
        ...this.mergeOptions?.title,
        textStyle: {
          fontFamily: 'Noto Sans',
          color: 'rgba(0, 0, 0, 0.60)',
          fontSize: '1rem',
          fontStyle: 'normal',
          fontWeight: 400,
        },
      },
      series: [{ data }],
      legend: {
        top: 'bottom',
        textStyle: {
          fontSize: '0.75rem',
        },
      },
    };
  }

  setTitlePosition(titleInside: boolean): void {
    this.mergeOptions = {
      ...this.mergeOptions,
      title: {
        ...this.mergeOptions.title,
        top: titleInside ? 'middle' : 'top',
        left: titleInside ? 'center' : 'auto',
      },
    };
  }

  setCurrentData(): void {
    if (this._data) {
      this.setData(this._data);
    }
  }
}
