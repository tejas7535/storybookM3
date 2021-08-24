import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EChartsOption } from 'echarts';

import { BarChartConfig } from '../models/bar-chart-config.model';
import { createBarChartOption } from './bar-chart.config';

@Component({
  selector: 'ia-bar-chart',
  templateUrl: './bar-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
  options: EChartsOption;

  @Input() set config(config: BarChartConfig) {
    if (config) {
      this.options = createBarChartOption(config);
    }
  }
}
