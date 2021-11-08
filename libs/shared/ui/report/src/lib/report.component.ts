import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SnackBarService } from '@schaeffler/snackbar';

import { Field, Hint, TitleId, Type } from './models';
import { Subordinate } from './models/subordinate.model';
import { TableItem } from './models/table-item.model';
import { ReportService } from './report.service';

@Component({
  selector: 'schaeffler-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [ReportService],
  encapsulation: ViewEncapsulation.None,
})
export class ReportComponent implements OnInit, OnDestroy {
  @Input() public title!: string;
  @Input() public subtitle?: string;
  @Input() public htmlReport?: string;
  @Input() public jsonReport?: string;
  @Input() public reportSelector?: string;
  @Input() public downloadReport?: string;
  @Input() public errorMsg =
    'Unfortunately an error occured. Please try again later.';
  @Input() public actionText = 'Retry';
  @Input() public type = Type.GENERIC;

  public htmlResult$ = new ReplaySubject<string>();
  public jsonResult$ = new ReplaySubject<Subordinate[]>();
  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly reportService: ReportService,
    private readonly snackbarService: SnackBarService
  ) {}

  public ngOnInit(): void {
    if (this.htmlReport) {
      this.getHtmlReport();
    } else if (this.jsonReport) {
      this.getJsonReport();
    }
  }

  public ngOnDestroy(): void {
    this.snackbarService.dismiss();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getHtmlReport(): void {
    this.reportService
      .getHtmlReport(this.htmlReport as string, this.reportSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: string) => this.htmlResult$.next(result),
        error: () => {
          this.snackbarService
            .showErrorMessage(this.errorMsg, this.actionText, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.getHtmlReport());
        },
      });
  }

  public getJsonReport(): void {
    this.reportService
      .getJsonReport(this.jsonReport as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: Subordinate[]) =>
          this.type === Type.GREASE
            ? this.jsonResult$.next(this.formatGreaseReport(result))
            : this.jsonResult$.next(result),
        error: () => {
          this.snackbarService
            .showErrorMessage(this.errorMsg, this.actionText, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.getJsonReport());
        },
      });
  }

  public getItem(row: TableItem[], field: string): TableItem | undefined {
    return row.find((element: TableItem) => element.field === field);
  }

  public getHeaders(fields: string[]): string[] {
    return fields.map((field: string, index: number) => `${field}${index}`);
  }

  public formatGreaseReport(result: Subordinate[]): Subordinate[] {
    // console.log(result);
    let formattedResult = result;

    // remove unneeded sections
    formattedResult = formattedResult.filter(
      (section: Subordinate) => section.titleID === TitleId.STRING_OUTP_INPUT
    );

    // compose result sections
    const resultSection = result.find(
      (section: Subordinate) => section.titleID === TitleId.STRING_OUTP_RESULTS
    ) as Subordinate;

    console.log(resultSection);

    // get table 2
    const tables = resultSection?.subordinates
      ?.filter(
        ({ titleID }: Subordinate) =>
          titleID === TitleId.STRING_OUTP_RESULTS_FOR_GREASE_SELECTION
      )
      .pop();

    const table1 = tables?.subordinates?.find(
      ({ titleID }: Subordinate) =>
        titleID ===
        TitleId.STRING_OUTP_RESULTS_FOR_GREASE_SERVICE_STRING_OUTP_GREASE_QUANTITY_IN_CCM
    );

    const table2 = tables?.subordinates?.find(
      ({ titleID }: Subordinate) =>
        titleID === TitleId.STRING_OUTP_OVERVIEW_OF_CALCULATION_DATA_FOR_GREASES
    );

    console.log(tables);
    console.log(table1);
    // console.log(table2);

    // compose compact grease table
    formattedResult = [
      ...formattedResult,
      {
        ...resultSection,
        defaultOpen: true,
        subordinates: [
          ...(table2?.data?.items
            .slice(0, 3)
            .map((item: TableItem[], index: number) => {
              const table1Values = table1?.data?.items[index];
              console.log(table1Values);

              const findItem = (searchField: Field): TableItem =>
                table1Values?.find(
                  ({ field }: TableItem) => field === searchField
                ) as TableItem;

              const greaseResult = {
                title: '',
                subtitlePart1: '',
                subtitlePart2: '',
                subtitlePart3: '',
                displayedColumns: ['title', 'values'],
                dataSource: [
                  {
                    title: 'Inital grease quantity', // TODO: transloco
                    values: `${findItem(Field.QVIN).value} ${
                      findItem(Field.QVIN).unit
                    }`,
                  },
                  {
                    title: 'Manual relubrication quantity/interval', // TODO: transloco
                    values: `${
                      (+(findItem(Field.QVRE_MAN_MIN) as any).value +
                        +(findItem(Field.QVRE_MAN_MAX) as any).value) /
                      2
                    } ${findItem(Field.QVRE_MAN_MIN).unit} / 
                    ${Math.round(
                      (+(findItem(Field.TFR_MIN) as any).value +
                        +(findItem(Field.TFR_MIN) as any).value) /
                        2 /
                        24
                    )} d`,
                  },
                  {
                    title: 'Automatic relubrication quantity per day', // TODO: transloco
                    values: `${
                      (+(findItem(Field.QVRE_AUT_MIN) as any).value +
                        +(findItem(Field.QVRE_AUT_MAX) as any).value) /
                      2
                    } ${findItem(Field.QVRE_AUT_MIN).unit}`,
                  },
                ],
              };

              item.forEach(({ field, value }: TableItem) => {
                // console.log({ field, value });

                switch (field) {
                  case Field.GREASE_GRADE:
                    greaseResult.title = `${value}`;
                    break;
                  case Field.BASEOIL:
                    greaseResult.subtitlePart1 = `${value}`;
                    break;
                  case Field.NLGI:
                    greaseResult.subtitlePart2 = `NLGI${value}`;
                    break;
                  case Field.THICKENER:
                    greaseResult.subtitlePart3 = `${value}`;
                    break;
                  default:
                    break;
                }
              });

              return {
                greaseResult,
                identifier: 'greaseResult',
              } as Subordinate;
            }) as Subordinate[]),
          table1 as any, // Todo: remove later
          table2 as any, // Todo: remove later
        ],
      },
    ];

    // add errors, warning, notes
    formattedResult = [
      ...formattedResult,
      {
        identifier: 'block',
        title: 'Errors, Warnings & Notes', // Todo: translate
        subordinates: result.filter(
          (section: Subordinate) =>
            section.title && Object.values(Hint).includes(section.title as any)
        ),
      },
    ];

    // console.log(formattedResult);

    return formattedResult;
  }
}
