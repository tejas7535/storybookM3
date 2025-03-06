import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ECharts, EChartsOption } from 'echarts';

import { LOADING_OPTS } from '../../constants';
import { BarChartConfig } from '../models/bar-chart-config.model';
import { createBarChartOption } from './bar-chart.config';

@Component({
  selector: 'ia-bar-chart',
  templateUrl: './bar-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BarChartComponent {
  loadingOpts = LOADING_OPTS;
  options: EChartsOption;

  @Input() set config(config: BarChartConfig) {
    if (config) {
      this.options = createBarChartOption(config);
    }
  }

  @Input() loading: boolean;

  onChartInit(chart: ECharts): void {
    if (this.loading) {
      chart.showLoading(this.loadingOpts);
    } else {
      chart.hideLoading();
    }
  }
}
