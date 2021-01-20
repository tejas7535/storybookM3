import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EChartsOption } from 'echarts';

import { TerminatedEmployee } from '../../../shared/models';
import { ChartSeries } from '../../models/chart-series';
import {
  CHART_BASE_OPTIONS,
  SERIES_BASE_OPTIONS,
} from './overview-chart.config';

@Component({
  selector: 'ia-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewChartComponent {
  private chartInstance: any;

  @Input() public loading: boolean;
  @Input() public events: Event[];
  @Input() public set data(data: {
    [seriesName: string]: {
      employees: TerminatedEmployee[][];
      attrition: number[];
    };
  }) {
    const series: any = Object.keys(data).map((name) => ({
      ...SERIES_BASE_OPTIONS,
      name,
      data: data[name].attrition,
    }));

    this.options = {
      ...CHART_BASE_OPTIONS,
      series,
    };

    this.chartSeries = Object.keys(data).map((name) => ({
      name,
      checked: true,
    }));
  }

  public options: EChartsOption;

  public chartSeries: ChartSeries[];

  public toggleChartSeries(name: string): void {
    const series = this.chartSeries.find((serie) => serie.name === name);
    series.checked = !series.checked;

    this.chartInstance.dispatchAction({
      name,
      type: 'legendToggleSelect',
    });
  }

  public onChartInit(eCharts: any): void {
    this.chartInstance = eCharts;
  }
}
