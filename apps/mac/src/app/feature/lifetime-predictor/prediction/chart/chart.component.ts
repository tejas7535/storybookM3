import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { ECharts, EChartsOption } from 'echarts';

@Component({
  selector: 'mac-ltp-chart',
  templateUrl: './chart.component.html',
})
export class ChartComponent {
  @Input() chartSettings: EChartsOption;
  @Input() mergeData$: Observable<EChartsOption>;

  fileNamePrefix = 'Lifetime-Predictor-Woehler-Chart-Export';

  loaded = false;

  chart: ECharts;
  public imgUrl: string;
  public filename: string;

  /**
   * Creates an Image URL for the current chart
   */
  public exportChart(): void {
    const dateTime = this.generateDatetime();
    this.filename = `${this.fileNamePrefix}-${dateTime}.png`;
    this.imgUrl = this.chart.getDataURL({
      type: 'png',
      pixelRatio: 3,
    });
  }

  /**
   * Sets the ECharts reference
   */
  public initChart(ec: ECharts): void {
    this.chart = ec;
  }

  /**
   * Gernates a string of the current datetime
   */
  public generateDatetime(): string {
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    return `${date} ${time}`;
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
