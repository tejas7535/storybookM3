import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ECharts, EChartsOption, LineSeriesOption } from 'echarts';
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
  readonly DATE_FORMAT = 'MM.YYYY';
  loadingOpts = {
    text: '',
    color: Color.GREEN,
    zlevel: 0,
  };
  echartsInstance: ECharts;
  options: EChartsOption;
  mergeOptions: EChartsOption = {
    series: [],
    color: [Color.GREEN, Color.DARK_GREY],
  };

  private _config: EChartsOption;
  private _banchmarkSeries: LineSeriesOption;
  private _series: LineSeriesOption;
  private _isDataLoading = true;

  @Input() set isDataLoading(isDataLoading: boolean) {
    this._isDataLoading = isDataLoading;
  }

  get isDataLoading() {
    return this._isDataLoading;
  }

  @Input() title: string;

  get config(): EChartsOption {
    return this._config;
  }

  @Input() set config(config: EChartsOption) {
    this._config = { ...config };
    this.options = this.createEChartsOption();
  }

  get series() {
    return this._series;
  }

  @Input() set series(series: LineSeriesOption) {
    this._series = series;

    let mergeSeries: LineSeriesOption[];

    if (this.benchmarkSeries) {
      mergeSeries = [this.benchmarkSeries, this.series];
    } else {
      mergeSeries = this.series ? [this.series] : [];
    }

    this.mergeOptions = {
      series: mergeSeries,
    };
  }

  get benchmarkSeries() {
    return this._banchmarkSeries;
  }

  @Input() set benchmarkSeries(benchmarkSeries: LineSeriesOption) {
    this._banchmarkSeries = benchmarkSeries;

    let mergeSeries: LineSeriesOption[];

    if (this.series) {
      mergeSeries = [this.benchmarkSeries, this.series];
    } else {
      mergeSeries = this.benchmarkSeries ? [this.benchmarkSeries] : [];
    }

    this.mergeOptions = {
      series: mergeSeries,
    };
  }

  onChartInit(ec: ECharts): void {
    this.echartsInstance = ec;

    if (this.isDataLoading) {
      ec.showLoading(this.loadingOpts);
    } else {
      ec.hideLoading();
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
        right: 0,
      },
    };
  }
}
