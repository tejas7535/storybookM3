import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EChartsOption, SeriesOption } from 'echarts';

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

  @Input() isLoading: boolean;

  @Input() set initialConfig(config: { title: string; subTitle: string }) {
    const baseOptions: EChartsOption =
      createSolidDoughnutChartBaseOptions(config);

    const series: SeriesOption[] = createSolidDoughnutChartSeries(config.title);

    this.options = {
      ...baseOptions,
      series,
    };
  }

  @Input() set data(data: { value: number; name: string }[]) {
    if (data) {
      this.mergeOptions = {
        ...this.mergeOptions,
        series: [{ data }],
        legend: {
          data: data
            .sort((a, b) => a.value - b.value)
            .map((value) => value.name)
            .reverse(),
          bottom: 50,
          height: 74,
          orient: 'vertical',
        },
      };
    }
  }
}
