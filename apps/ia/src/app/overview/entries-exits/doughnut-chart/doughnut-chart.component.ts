import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EChartsOption, SeriesOption } from 'echarts';

import { Color } from '../../../shared/models/color.enum';
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
  mergeOptions: EChartsOption;

  @Input() isLoading: boolean;

  @Input() set initialConfig(configs: DoughnutSeriesConfig[]) {
    const baseOptions = createPieChartBaseOptions(
      configs.map((serie) => serie.name) ?? [],
      '-',
      ''
    );

    const seriesConfigs = configs.map(
      (serie) => new DoughnutSeriesConfig(serie.value, serie.name, serie.color)
    );

    const series = this.createSeriesOptions(
      new DoughnutConfig('', seriesConfigs)
    );

    this.options = {
      ...baseOptions,
      series,
    };
  }

  @Input() set data(config: DoughnutConfig) {
    if (config && config.series) {
      const series = this.createSeriesOptions(config);
      const totalValue = config.series
        .map((serie) => serie.value)
        .reduce((x1, x2) => x1 + x2)
        .toString();

      this.mergeOptions = {
        title: {
          ...this.options?.title,
          text: totalValue,
          subtext: config.name,
        },
        series,
      };
    }
  }

  createSeriesOptions = (data: DoughnutConfig): SeriesOption[] => {
    let radiusStart = 60;
    const radiusStep = 10;
    const radiusGap = 5;

    const series: any[] = data.series.map((seriesObj: DoughnutSeriesConfig) => {
      const radius = [`${radiusStart}%`, `${radiusStart + radiusStep}%`];
      const pieChartSeries = createPieChartSeries(
        radius,
        seriesObj.value,
        data.series
          .map((element) => element.value)
          .reduce((value1, value2) => value1 + value2),
        seriesObj.color ?? Color.BLACK,
        data.name,
        seriesObj.name
      );

      radiusStart += radiusStep + radiusGap;

      return pieChartSeries;
    });

    return series;
  };
}
