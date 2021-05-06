import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EChartsOption } from 'echarts';

import { TerminatedEmployee } from '../../shared/models';
import { ChartSeries } from '../models/chart-series';
import {
  CHART_BASE_OPTIONS,
  SERIES_BASE_OPTIONS,
} from './overview-chart.config';
import { TerminatedEmployeesDialogComponent } from './terminated-employees-dialog/terminated-employees-dialog.component';

@Component({
  selector: 'ia-overview-chart',
  templateUrl: './overview-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewChartComponent {
  private chartInstance: any;
  private _data: {
    [seriesName: string]: {
      employees: TerminatedEmployee[][];
      attrition: number[];
    };
  };

  @Input() public loading: boolean;
  @Input() public events: Event[];
  @Input() public set data(data: {
    [seriesName: string]: {
      employees: TerminatedEmployee[][];
      attrition: number[];
    };
  }) {
    this._data = data;

    const series: any = data
      ? Object.keys(data).map((name) => ({
          ...SERIES_BASE_OPTIONS,
          name,
          data: data[name].attrition,
        }))
      : [];

    this.options = {
      ...CHART_BASE_OPTIONS,
      series,
    };

    this.chartSeries = data
      ? Object.keys(data).map((name) => ({
          name,
          checked: true,
        }))
      : [];
  }

  public get data(): {
    [seriesName: string]: {
      employees: TerminatedEmployee[][];
      attrition: number[];
    };
  } {
    return this._data;
  }

  public options: EChartsOption;

  public chartSeries: ChartSeries[];

  constructor(private readonly dialog: MatDialog) {}

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

  public onChartClick(event: any): void {
    const employees = this.data[event.seriesName].employees[event.dataIndex];

    this.dialog.open(TerminatedEmployeesDialogComponent, {
      data: {
        employees,
        title: `${event.seriesName} - ${event.name}:`,
      },
      width: '600px',
    });
  }
}
