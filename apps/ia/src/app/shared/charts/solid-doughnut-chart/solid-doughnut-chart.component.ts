import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EChartsOption, SeriesOption } from 'echarts';

import { ExternalLegend } from '../external-legend';
import { LegendSelectAction } from '../models';
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
export class SolidDoughnutChartComponent extends ExternalLegend {
  options: EChartsOption;
  mergeOptions: EChartsOption;
  _data: DoughnutChartData[];

  @Input() isLoading: boolean;

  @Input() set initialConfig(config: SolidDoughnutChartConfig) {
    const baseOptions: EChartsOption =
      createSolidDoughnutChartBaseOptions(config);

    const series: SeriesOption[] = createSolidDoughnutChartSeries(
      config.side,
      config.subTitle
    );
    this.options = {
      ...baseOptions,
      series,
    };

    this.setCurrentData();
  }

  @Input() set data(data: DoughnutChartData[]) {
    this._data = data;
    if (data) {
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
      series: {
        data,
      },
    };
  }

  setCurrentData(): void {
    if (this._data) {
      this.setData(this._data);
    }
  }
}
