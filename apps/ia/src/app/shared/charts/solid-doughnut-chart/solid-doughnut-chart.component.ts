import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EChartsOption, SeriesOption } from 'echarts';

import { DoughnutChartData } from '../models/doughnut-chart-data.model';
import { SolidDoughnutChartConfig } from '../models/solid-doughnut-chart-config.model';
import {
  createSolidDoughnutChartBaseOptions,
  createSolidDoughnutChartSeries,
} from './solid-doughnut-chart.config';

@Component({
  selector: 'ia-solid-doughnut-chart',
  templateUrl: './solid-doughnut-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolidDoughnutChartComponent {
  options: EChartsOption;
  mergeOptions: EChartsOption;
  _data: DoughnutChartData[];

  @Input() isLoading: boolean;

  @Input() containerCss: string;

  @Input() set titleInside(inside: boolean) {
    this.setTitlePosition(inside);
  }

  @Input() set initialConfig(config: SolidDoughnutChartConfig) {
    const baseOptions: EChartsOption =
      createSolidDoughnutChartBaseOptions(config);

    const series: SeriesOption[] = createSolidDoughnutChartSeries(config.title);
    this.options = {
      ...baseOptions,
      series,
    };

    this.setCurrentData();
    this.setMediaQueries();
  }

  @Input() set data(data: DoughnutChartData[]) {
    this._data = data;
    if (data) {
      this.setData(data);
    }
  }

  setData(data: DoughnutChartData[]): void {
    this.mergeOptions = {
      ...this.mergeOptions,
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
        top: titleInside ? '35%' : 'top',
        left: titleInside ? 'center' : 'auto',
      },
    };
  }

  setCurrentData(): void {
    if (this._data) {
      this.setData(this._data);
    }
  }

  setMediaQueries(): void {
    this.options = {
      ...this.options,
      media: [
        {
          query: {
            minWidth: 192,
            maxWidth: 240,
          },
          option: {
            title: {
              textStyle: {
                fontSize: '1rem',
              },
              subtextStyle: {
                fontSize: '0.75rem',
              },
            },
          },
        },
      ],
    };
  }
}
