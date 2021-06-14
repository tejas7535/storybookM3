import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EChartsOption } from 'echarts';

import {
  createPieChartBaseOptions,
  createPieChartSeries,
} from './doughnut-chart.config';
import { DoughnutConfig } from './models/doughnut-config.model';
import { DoughnutSeriesConfig } from './models/doughnut-series-config.model';

@Component({
  selector: 'ia-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutChartComponent {
  options: EChartsOption;

  // only two series supported by now
  private readonly seriesColors = ['#A1C861', '#78909C'];

  @Input() set data(data: DoughnutConfig) {
    const values = data.series.map((seriesObj) => seriesObj.value);
    const total = values.length > 0 ? values.reduce((sum, x) => sum + x) : 0;

    const baseOptions = createPieChartBaseOptions(
      data.legend,
      `${total}`,
      data.name
    );

    const series = this.createSeriesOptions(data);

    this.options = {
      series,
      ...baseOptions,
    };
  }

  createSeriesOptions = (data: DoughnutConfig): any[] => {
    let radiusStart = 60;
    const radiusStep = 10;
    const radiusGap = 5;

    const series: any[] = data.series.map(
      (seriesObj: DoughnutSeriesConfig, idx: number) => {
        const radius = [`${radiusStart}%`, `${radiusStart + radiusStep}%`];
        const pieChartSeries = createPieChartSeries(
          radius,
          seriesObj.value,
          data.series
            .map((element) => element.value)
            .reduce((value1, value2) => value1 + value2),
          this.seriesColors[idx] ?? '#000',
          data.name,
          seriesObj.name
        );

        radiusStart += radiusStep + radiusGap;

        return pieChartSeries;
      }
    );

    return series;
  };
}
