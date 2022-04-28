import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { EChartsOption } from 'echarts';
import moment from 'moment';

import { LINE_CHART_BASE_OPTIONS } from './line-chart.config';

@Component({
  selector: 'ia-line-chart',
  templateUrl: './line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnInit {
  options: EChartsOption;
  currentYear: number;

  private _config: EChartsOption;

  @Input() title: string;
  @Input() isDataLoading: boolean;
  @Input() get config(): EChartsOption {
    return this._config;
  }

  set config(config: EChartsOption) {
    this._config = config;
    this.options = this.createEChartsOption();
  }

  ngOnInit(): void {
    this.currentYear = moment().get('year');
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
    };
  }

  getXAxisData(): string[] {
    const now = moment();

    const threeMonthsAgo = moment().clone().subtract(3, 'months');
    const twoMonthsAgo = moment().clone().subtract(2, 'months');
    const oneMonthAgo = moment().clone().subtract(1, 'months');
    const nextMonth = moment().clone().add(1, 'months');
    const nextButOneMonth = moment().clone().add(2, 'months');

    return [
      `${threeMonthsAgo.format('M/YY')}`,
      `${twoMonthsAgo.format('M/YY')}`,
      `${oneMonthAgo.format('M/YY')}`,
      `${now.format('M/YY')}`,
      `${nextMonth.format('M/YY')}`,
      `${nextButOneMonth.format('M/YY')}`,
    ];
  }
}
