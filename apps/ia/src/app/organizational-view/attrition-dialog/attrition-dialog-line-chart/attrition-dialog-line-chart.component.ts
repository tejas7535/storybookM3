import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import {
  LINE_CHART_BASE_OPTIONS,
  LINE_SERIES_BASE_OPTIONS,
} from '../../../shared/configs/line-chart.config';
import { OrganizationalViewState } from '../../store';
import {
  getAttritionOverTimeOrgChartData,
  getIsLoadingAttritionOverTimeOrgChart,
} from '../../store/selectors/organizational-view.selector';

@Component({
  selector: 'ia-attrition-dialog-line-chart',
  templateUrl: './attrition-dialog-line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttritionDialogLineChartComponent implements OnInit {
  currentYear: number;
  options$: Observable<EChartsOption>;
  attritionQuotaLoading$: Observable<boolean>;

  constructor(private readonly store: Store<OrganizationalViewState>) {}

  ngOnInit(): void {
    const date = new Date();

    this.currentYear = date.getFullYear();
    this.attritionQuotaLoading$ = this.store.select(
      getIsLoadingAttritionOverTimeOrgChart
    );
    this.options$ = this.store.select(getAttritionOverTimeOrgChartData).pipe(
      map((data) => {
        const series: any = data
          ? Object.keys(data).map((name) => ({
              ...LINE_SERIES_BASE_OPTIONS,
              name,
              data: data[name].attrition,
            }))
          : [];

        return {
          ...LINE_CHART_BASE_OPTIONS,
          xAxis: {
            ...LINE_CHART_BASE_OPTIONS.xAxis,
            data: this.getXAxisData(),
          },
          series,
        };
      })
    );
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
    return date.getFullYear().toString().substr(-2);
  }

  getHumanReadableMonth(date: Date): number {
    // getMonth is zero based
    return date.getMonth() + 1;
  }
}
