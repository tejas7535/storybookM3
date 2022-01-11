import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EChartsOption, SeriesOption } from 'echarts';

import { Color } from '../../models/color.enum';
import { ExternalLegend } from '../external-legend';
import { LegendSelectAction } from '../models';
import { DoughnutConfig } from '../models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../models/doughnut-series-config.model';
import {
  createPieChartBaseOptions,
  createPieChartSeries,
} from './loose-doughnut-chart.config';

@Component({
  selector: 'ia-loose-doughnut-chart',
  templateUrl: './loose-doughnut-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LooseDoughnutChartComponent extends ExternalLegend {
  options: EChartsOption;
  mergeOptions: EChartsOption;

  @Input() isLoading: boolean;

  @Input() set initialConfig(configs: DoughnutSeriesConfig[]) {
    const baseOptions = createPieChartBaseOptions(
      configs.map((serie) => serie.title) ?? [],
      '-',
      ''
    );

    const seriesConfigs = configs.map(
      (serie) => new DoughnutSeriesConfig(serie.data, serie.title, serie.color)
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
      this.resetSelection();
      const series = this.createSeriesOptions(config);
      let totalValue = 0;

      for (const serie of config.series) {
        totalValue += serie.data[0].value;
      }

      this.mergeOptions = {
        title: {
          ...this.options?.title,
          text: totalValue.toString(),
          subtext: config.name,
        },
        series,
      };
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

  createSeriesOptions = (data: DoughnutConfig): SeriesOption[] => {
    let radiusStart = 60;
    const radiusStep = 10;
    const radiusGap = 5;

    const series: any[] = data.series.map((seriesObj: DoughnutSeriesConfig) => {
      const radius = [`${radiusStart}%`, `${radiusStart + radiusStep}%`];
      let totalValue = 0;
      for (const serie of data.series) {
        totalValue += serie.data[0].value;
      }

      const pieChartSeries = createPieChartSeries(
        radius,
        seriesObj.data[0].value,
        totalValue,
        seriesObj.color ?? Color.BLACK,
        data.name,
        seriesObj.title
      );

      radiusStart += radiusStep + radiusGap;

      return pieChartSeries;
    });

    return series;
  };
}
