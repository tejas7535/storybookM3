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
  currentDate: string;

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

  ngOnInit(): void {
    this.currentDate = moment.utc().format(this.DATE_FORMAT);
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
    const now = moment.utc();

    const threeMonthsAgo = now.clone().subtract(3, 'months');
    const twoMonthsAgo = now.clone().subtract(2, 'months');
    const oneMonthAgo = now.clone().subtract(1, 'months');
    const nextMonth = now.clone().add(1, 'months');
    const nextButOneMonth = now.clone().add(2, 'months');

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
