import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ECharts, EChartsOption, LineSeriesOption } from 'echarts';

import { LOADING_OPTS } from '../../constants';
import { Color } from '../../models';
import { LINE_CHART_BASE_OPTIONS } from './line-chart.config';

@Component({
  selector: 'ia-line-chart',
  templateUrl: './line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LineChartComponent {
  readonly DATE_FORMAT = 'MM.YYYY';
  readonly loadingOpts = LOADING_OPTS;
  echartsInstance: ECharts;
  options: EChartsOption;

  _mergeOptions: EChartsOption = {
    series: [],
    color: [Color.GREEN, Color.DARK_GREY],
  };

  get mergeOptions() {
    return this._mergeOptions;
  }

  @Input() set mergeOptions(mergeOptions: EChartsOption) {
    this._mergeOptions = { ...this.mergeOptions, ...mergeOptions };
  }

  private _config: EChartsOption;
  private _banchmarkSeries: LineSeriesOption[];
  private _series: LineSeriesOption[];
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

  @Input() set series(series: LineSeriesOption[]) {
    this._series = series;

    let mergeSeries: LineSeriesOption[];

    if (this.benchmarkSeries) {
      mergeSeries = [...this.benchmarkSeries, ...this.series];
    } else {
      mergeSeries = this.series ? [...this.series] : [];
    }

    this.mergeOptions = {
      series: mergeSeries,
    };
  }

  get benchmarkSeries() {
    return this._banchmarkSeries;
  }

  @Input() set benchmarkSeries(benchmarkSeries: LineSeriesOption[]) {
    this._banchmarkSeries = benchmarkSeries;

    let mergeSeries: LineSeriesOption[];

    if (this.series) {
      mergeSeries = [...this.benchmarkSeries, ...this.series];
    } else {
      mergeSeries = this.benchmarkSeries ? [...this.benchmarkSeries] : [];
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

  createEChartsOption(): EChartsOption {
    return {
      ...LINE_CHART_BASE_OPTIONS,
      xAxis: {
        ...LINE_CHART_BASE_OPTIONS.xAxis,
        type: 'category',
      },
      ...this.config,
      grid: {
        top: 20,
        left: 40,
        right: 40,
      },
    };
  }
}
