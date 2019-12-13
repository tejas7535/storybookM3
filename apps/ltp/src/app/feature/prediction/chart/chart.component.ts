import { Observable } from 'rxjs';

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { DxChartComponent } from 'devextreme-angular/ui/chart';

import { ChartSettings, Limits } from '../../../shared/models';

@Component({
  selector: 'ltp-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() limits: Limits;
  @Input() data: Object[];
  @Input() lines: Object[];
  @Input() bannerIsVisible: Observable<boolean>;
  @Input() chartSettings: ChartSettings;
  @Input() customizeTooltip: Function;

  @Input() fileNamePrefix = 'Lifetime-Predictor-Woehler-Chart-Export';

  @ViewChild('chart1', { static: false }) chart1: DxChartComponent;
  @ViewChild('chartContainer', { static: false }) chartContainer;

  ngOnInit(): void {
    this.bannerIsVisible.subscribe(() => {
      setTimeout(() => this.rerenderChart(), 0);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.rerenderChart();
  }

  /**
   * Calls the native Devextreme chartexport method
   */
  public exportChart(): void {
    const dateTime = this.generateDatetime();
    this.chart1.instance.exportTo(`${this.fileNamePrefix}-${dateTime}`, 'PDF');
  }

  /**
   * Gernates a string of the current datetime
   */
  public generateDatetime(): string {
    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth() +
      1}-${today.getDate()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    return `${date} ${time}`;
  }

  /**
   * Adjusts the size of the chart to the component dimensions
   */
  public rerenderChart(): void {
    if (this.chartContainer) {
      let size = { height: 450 };
      this.chart1.instance.option(size);
      size = {
        height: Math.max(450, this.chartContainer.nativeElement.offsetHeight)
      };
      this.chart1.instance.option(size);
      this.chart1.instance.render({ animate: true, force: true });
    }
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index): number {
    return index;
  }
}
