import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-enterprise';
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
import { getMonthYearDateFormatByCode } from '../../../../shared/constants/available-locales';
import { LocaleType } from './../../../../shared/constants/available-locales';

export interface ICustomHeaderParams extends IHeaderParams {
  kpiEntry: KpiEntry;
  disableClick?: boolean;
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
  protected readonly translocoLocaleService = inject(TranslocoLocaleService);
  protected params!: ICustomHeaderParams;

  public agInit(params: ICustomHeaderParams): void {
    this.params = params;
  }

  public refresh(_: ICustomHeaderParams): boolean {
    return false;
  }

  protected getCalendarWeek(date: Date): string {
    return format(date, 'ww');
  }

  protected getWeekHeader(date: string, bucketType: KpiBucketType) {
    const fromDate = parseISO(date);
    const kw = translate(
      'validation_of_demand.planningTable.calendarWeekTableHeaderKw',
      { calendar_week: this.getCalendarWeek(fromDate) }
    );

    const partWeek =
      bucketType === 'PARTIAL_WEEK'
        ? ` ${translate(
            'validation_of_demand.planningTable.calendarWeekTableHeaderPartWeek',
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

  protected getDate(input: string, bucketType: KpiBucketType): string {
    if (bucketType === 'MONTH') {
      return format(
        input,
        getMonthYearDateFormatByCode(
          this.translocoLocaleService.getLocale() as LocaleType
        ).display.dateInput
      );
    }

    return this.translocoLocaleService.localizeDate(
      input,
      this.translocoLocaleService.getLocale(),
      { day: '2-digit', month: '2-digit', year: 'numeric' }
    );
  }

  protected handleHeaderClick(): void {
    if (this.params?.disableClick) {
      return;
    }

    this.params.onClickHeader(this.params?.kpiEntry);
  }
}
