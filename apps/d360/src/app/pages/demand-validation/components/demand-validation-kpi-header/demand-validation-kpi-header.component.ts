import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';
import {
  addDays,
  differenceInBusinessDays,
  endOfMonth,
  format,
  isFirstDayOfMonth,
  nextMonday,
  parseISO,
} from 'date-fns';

import {
  KpiBucketType,
  KpiEntry,
} from '../../../../feature/demand-validation/model';

export interface ICustomHeaderParams extends IHeaderParams {
  kpiEntry: KpiEntry;
  onClickHeader(entry: KpiEntry): void;
}

@Component({
  selector: 'd360-demand-validation-kpi-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demand-validation-kpi-header.component.html',
  styleUrl: './demand-validation-kpi-header.component.scss',
})
export class DemandValidationKpiHeaderComponent implements IHeaderAngularComp {
  @Input({ required: true }) params!: ICustomHeaderParams;

  public agInit(params: ICustomHeaderParams): void {
    this.params = params;
  }

  public refresh(_: ICustomHeaderParams): boolean {
    return false;
  }

  protected getWeekHeader(date: string, bucketType: KpiBucketType) {
    const fromDate = parseISO(date);
    const kw = translate(
      'validation_of_demand.planning_table.calendar_week_table_header_kw',
      {
        calendar_week: this.getCalendarWeek(fromDate),
      }
    );

    const partWeek =
      bucketType === 'PARTIAL_WEEK'
        ? ` ${translate(
            'validation_of_demand.planning_table.calendar_week_table_header_part_week',
            {
              days: isFirstDayOfMonth(fromDate)
                ? differenceInBusinessDays(nextMonday(fromDate), fromDate)
                : differenceInBusinessDays(
                    addDays(endOfMonth(fromDate), 1),
                    fromDate
                  ),
            }
          )}`
        : '';

    return kw + partWeek;
  }

  protected getDate(input: any): string {
    return format(input, 'MM.yyyy');

    // TODO: Use the following code after https://github.com/Schaeffler-Group/frontend-schaeffler/pull/6770 was merged
    // return format(
    //   input,
    //   getMonthYearDateFormatByCode(
    //     this.localeService.getLocale() as LocaleType
    //   ).display.dateInput
    // );
  }

  protected handleHeaderClick() {
    this.params.onClickHeader(this.params.kpiEntry);
  }

  private getCalendarWeek(date: Date): string {
    return format(date, 'ww');
  }
}
