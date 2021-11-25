import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { EChartsOption } from 'echarts';

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
    const date = new Date();
    this.currentYear = date.getFullYear();
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
    const now = new Date();

    const threeMonthsAgo = this.getDateInMonths(now, -3);
    const twoMonthsAgo = this.getDateInMonths(now, -2);
    const oneMonthAgo = this.getDateInMonths(now, -1);
    const nextMonth = this.getDateInMonths(now, 1);
    const nextButOneMonth = this.getDateInMonths(now, 2);

    return [
      `${this.getHumanReadableMonth(
        threeMonthsAgo
      )}/${this.getLastTwoDigitsOfYear(threeMonthsAgo)}`,
      `${this.getHumanReadableMonth(
        twoMonthsAgo
      )}/${this.getLastTwoDigitsOfYear(twoMonthsAgo)}`,
      `${this.getHumanReadableMonth(oneMonthAgo)}/${this.getLastTwoDigitsOfYear(
        oneMonthAgo
      )}`,
      `${this.getHumanReadableMonth(now)}/${this.getLastTwoDigitsOfYear(now)}`,
      `${this.getHumanReadableMonth(nextMonth)}/${this.getLastTwoDigitsOfYear(
        nextMonth
      )}`,
      `${this.getHumanReadableMonth(
        nextButOneMonth
      )}/${this.getLastTwoDigitsOfYear(nextButOneMonth)}`,
    ];
  }

  getDateInMonths(date: Date, months: number): Date {
    const newDate = new Date(date.getTime());
    newDate.setMonth(newDate.getMonth() + months);

    return newDate;
  }

  getLastTwoDigitsOfYear(date: Date): string {
    return date.getFullYear().toString().slice(-2);
  }

  getHumanReadableMonth(date: Date): number {
    // getMonth is zero based
    return date.getMonth() + 1;
  }
}
