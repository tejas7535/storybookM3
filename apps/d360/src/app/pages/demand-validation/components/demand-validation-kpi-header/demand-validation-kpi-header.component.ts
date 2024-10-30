import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
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
import { de } from 'date-fns/locale';

import {
  KpiBucketType,
  KpiEntry,
} from '../../../../feature/demand-validation/model';

export interface ICustomHeaderParams extends IHeaderParams {
  kpiEntry: KpiEntry;
  // onClickHeader(entry: KpiEntry): void;
}

@Component({
  selector: 'app-demand-validation-kpi-header',
  standalone: true,
  imports: [CommonModule, TranslocoDatePipe],
  templateUrl: './demand-validation-kpi-header.component.html',
  styleUrl: './demand-validation-kpi-header.component.scss',
})
export class DemandValidationKpiHeaderComponent implements IHeaderAngularComp {
  @Input({ required: true }) params!: ICustomHeaderParams;

  agInit(params: ICustomHeaderParams): void {
    this.params = params;
  }

  refresh(_: ICustomHeaderParams): boolean {
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

  private readonly getCalendarWeek = (date: Date) =>
    format(date, 'ww', { locale: de });

  handleHeaderClick() {
    // TODO implement
  }
}
