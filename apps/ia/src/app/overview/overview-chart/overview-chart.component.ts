import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EChartsOption } from 'echarts';

import {
  LINE_CHART_BASE_OPTIONS,
  LINE_SERIES_BASE_OPTIONS,
} from '../../shared/charts/line-chart/line-chart.config';
import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogMeta } from '../../shared/employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { Employee } from '../../shared/models';
import { ChartSeries } from '../models/chart-series.model';

@Component({
  selector: 'ia-overview-chart',
  templateUrl: './overview-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewChartComponent {
  private _data: {
    [seriesName: string]: {
      employees: Employee[][];
      attrition: number[];
    };
  };

  @Input() public loading: boolean;
  @Input() public set data(data: {
    [seriesName: string]: {
      employees: Employee[][];
      attrition: number[];
    };
  }) {
    this._data = data;

    const series: any = data
      ? Object.keys(data).map((name) => ({
          ...LINE_SERIES_BASE_OPTIONS,
          name,
          data: data[name].attrition,
        }))
      : [];

    this.options = {
      ...LINE_CHART_BASE_OPTIONS,
      xAxis: {
        ...LINE_CHART_BASE_OPTIONS.xAxis,
        type: 'category',
        data: [
          'JAN',
          'FEB',
          'MAR',
          'APR',
          'MAY',
          'JUN',
          'JUL',
          'AUG',
          'SEP',
          'OCT',
          'NOV',
          'DEC',
        ],
      },
      yAxis: {
        type: 'value',
        name: 'Number of Employees',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          fontFamily: 'Roboto',
        },
      },
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
      employees: Employee[][];
      attrition: number[];
    };
  } {
    return this._data;
  }

  public options: EChartsOption;

  public chartSeries: ChartSeries[];

  constructor(private readonly dialog: MatDialog) {}

  public onChartClick(event: any): void {
    const employees = this.data[event.seriesName].employees[event.dataIndex];
    const attrition = this.data[event.seriesName].attrition[event.dataIndex];
    const enoughRights = employees?.length === attrition;

    if (attrition > 0) {
      const data = new EmployeeListDialogMeta(
        new EmployeeListDialogMetaHeadings(
          `${event.seriesName} - ${event.name}:`,
          undefined
        ),
        employees,
        enoughRights
      );

      this.dialog.open(EmployeeListDialogComponent, {
        data,
      });
    }
  }
}
