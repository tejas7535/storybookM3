import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EChartsOption, LineSeriesOption } from 'echarts';
import moment from 'moment';

import { DATA_IMPORT_DAY } from '../../constants';
import { Color } from '../../models';
import { LINE_CHART_BASE_OPTIONS } from './line-chart.config';

@Component({
  selector: 'ia-line-chart',
  templateUrl: './line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent {
  options: EChartsOption;
  mergeOptions: EChartsOption;

  private _config: EChartsOption;
  readonly DATE_FORMAT = 'MM.YYYY';

  @Input() title: string;
  @Input() isDataLoading: boolean;

  @Input() get config(): EChartsOption {
    return this._config;
  }

  set config(config: EChartsOption) {
    this._config = config;
    this.options = this.createEChartsOption();
  }

  @Input() set series(series: LineSeriesOption[]) {
    if (series) {
      this.mergeOptions = {
        series: this.options.series,
        color: [Color.GREEN, Color.DARK_GREY],
      };
      (this.mergeOptions.series as LineSeriesOption[]).unshift(series[0]);
    }
  }

  getXAxisData(): string[] {
    const now = moment.utc().subtract(DATA_IMPORT_DAY, 'days');

    const sixMonthsAgo = now.clone().subtract(6, 'months');
    const fiveMonthsAgo = now.clone().subtract(5, 'months');
    const fourMonthsAgo = now.clone().subtract(4, 'months');
    const threeMonthsAgo = now.clone().subtract(3, 'months');
    const twoMonthsAgo = now.clone().subtract(2, 'months');
    const oneMonthAgo = now.clone().subtract(1, 'months');

    return [
      `${sixMonthsAgo.format('M/YY')}`,
      `${fiveMonthsAgo.format('M/YY')}`,
      `${fourMonthsAgo.format('M/YY')}`,
      `${threeMonthsAgo.format('M/YY')}`,
      `${twoMonthsAgo.format('M/YY')}`,
      `${oneMonthAgo.format('M/YY')}`,
    ];
  }

  createEChartsOption(): EChartsOption {
    return {
      ...LINE_CHART_BASE_OPTIONS,
      xAxis: {
        ...LINE_CHART_BASE_OPTIONS.xAxis,
        type: 'category',
        data: this.getXAxisData(),
      },
      ...this.config,
      grid: {
        top: 20,
        left: '15%',
      },
    };
  }
}
