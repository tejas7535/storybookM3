import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { translate } from '@jsverse/transloco';
import { EChartsOption } from 'echarts';
import { ECActionEvent } from 'echarts/types/src/util/types';
import moment from 'moment';

import {
  LINE_CHART_BASE_OPTIONS,
  LINE_SERIES_BASE_OPTIONS,
} from '../../shared/charts/line-chart/line-chart.config';
import { EmployeeListDialogComponent } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaFilters,
} from '../../shared/dialogs/employee-list-dialog/models';
import { EmployeeListDialogMetaHeadings } from '../../shared/dialogs/employee-list-dialog/models/employee-list-dialog-meta-headings.model';
import {
  AttritionOverTime,
  AttritionSeries,
  EmployeeWithAction,
} from '../../shared/models';
import { getTimeRangeFromDates } from '../../shared/utils/utilities';
import { ExitEntryEmployeesResponse } from '../models';
import { ChartSeries } from '../models/chart-series.model';

@Component({
  selector: 'ia-overview-chart',
  templateUrl: './overview-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class OverviewChartComponent {
  readonly SYMBOL_SIZE = 10;

  employees: EmployeeWithAction[];

  @Input() filters: { filterDimension: string; value: string };

  @Input() dataLoading: boolean;

  private _data: AttritionSeries;

  @Input() set data(data: AttritionOverTime) {
    if (!data?.data) {
      return;
    }
    this._data = data.data;

    const series: any = data.responseModified
      ? undefined
      : Object.keys(data.data)
          .reverse()
          .map((name) => ({
            ...LINE_SERIES_BASE_OPTIONS,
            symbolSize: this.SYMBOL_SIZE,
            name,
            data: data?.data[name]?.attrition,
            emphasis: {
              focus: 'series',
            },
          }));

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
        minInterval: 1,
      },
      series,
    };

    this.options = data.responseModified
      ? {
          ...this.options,
          graphic: [
            {
              type: 'text',
              left: 'center',
              top: 'middle',
              style: {
                text: translate(
                  'notification.warning.absoluteFluctuationNoUserRights'
                ),
                fill: 'rgb(233, 179, 0)',
                fontSize: 24,
                fontFamily: 'Noto Sans',
              },
            },
          ],
        }
      : {
          ...this.options,
          graphic: [],
        };

    this.chartSeries = data
      ? Object.keys(data.data).map((name) => ({
          name,
          checked: true,
        }))
      : [];
  }

  public get data(): AttritionSeries {
    return this._data;
  }

  _attritionEmployeesLoading: boolean;

  @Input() set attritionEmployeesLoading(attritionEmployeesLoading: boolean) {
    this._attritionEmployeesLoading = attritionEmployeesLoading;
    this.dialogData.employeesLoading = attritionEmployeesLoading;

    this.dialogData.employees = attritionEmployeesLoading
      ? undefined
      : this.employees;
  }

  get attritionEmployeesLoading() {
    return this._attritionEmployeesLoading;
  }

  _attritionEmployeesData: ExitEntryEmployeesResponse;

  @Input() set attritionEmployeesData(
    attritionEmployeesData: ExitEntryEmployeesResponse
  ) {
    this._attritionEmployeesData = attritionEmployeesData;
    this.employees = attritionEmployeesData?.employees;
    this.dialogData.employees = this.dialogData.employeesLoading
      ? undefined
      : attritionEmployeesData?.employees;
    this.dialogData.enoughRightsToShowAllEmployees =
      !attritionEmployeesData?.responseModified;
  }

  get attritionEmployeesData() {
    return this._attritionEmployeesData;
  }

  @Output() leaversForTimeRangeRequested = new EventEmitter<string>();

  dialogData = new EmployeeListDialogMeta(
    {} as EmployeeListDialogMetaHeadings,
    undefined,
    this.attritionEmployeesLoading,
    true,
    'leavers',
    ['reasonForLeaving', 'from', 'to']
  );

  options: EChartsOption;

  chartSeries: ChartSeries[];

  constructor(private readonly dialog: MatDialog) {}

  onChartClick(event: any) {
    const start = moment.utc({
      year: (event as ECActionEvent).seriesName,
      month: (event as ECActionEvent).dataIndex,
      date: 1,
    });
    const end = start.clone().endOf('month');

    const timeRange = getTimeRangeFromDates(start, end);
    this.leaversForTimeRangeRequested.emit(timeRange);
    this.showEmployees(event as ECActionEvent);
  }

  showEmployees(event: ECActionEvent): void {
    if (event.componentType !== 'series') {
      return;
    }

    const attrition = this.data[event.seriesName].attrition[event.dataIndex];

    if (attrition > 0) {
      const timeframe = moment(
        `${event.seriesName} ${event.name}`,
        'YYYY MMM'
      ).format('MMMM YYYY');

      const title = translate(
        'overview.employeeListDialog.title.unforcedLeavers'
      );
      this.dialogData.headings = new EmployeeListDialogMetaHeadings(
        title,
        'person_add_disabled',
        false,
        new EmployeeListDialogMetaFilters(
          this.filters.filterDimension,
          this.filters.value,
          timeframe
        )
      );
      this.dialogData.customExcelFileName = `${title} ${this.filters.value} ${timeframe}`;

      this.dialog.open(EmployeeListDialogComponent, {
        data: this.dialogData,
      });
    }
  }
}
