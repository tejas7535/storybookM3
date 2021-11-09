/* eslint-disable max-lines */
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';

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
  public formattedResult: any;

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
            ? this.formatGreaseReport(result)
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

  public formatGreaseReport(result: Subordinate[]): void {
    this.formattedResult = result;

    // remove unneeded sections
    this.formattedResult = this.formattedResult.filter(
      (section: Subordinate) => section.titleID === TitleId.STRING_OUTP_INPUT
    );

    // compose result sections
    const resultSection = result.find(
      (section: Subordinate) => section.titleID === TitleId.STRING_OUTP_RESULTS
    ) as Subordinate;

    // get tables
    const tables = resultSection?.subordinates
      ?.filter(
        ({ titleID }: Subordinate) =>
          titleID === TitleId.STRING_OUTP_RESULTS_FOR_GREASE_SELECTION
      )
      .pop();

    // get table 1
    const table1 = tables?.subordinates?.find(
      ({ titleID }: Subordinate) =>
        titleID ===
        TitleId.STRING_OUTP_RESULTS_FOR_GREASE_SERVICE_STRING_OUTP_GREASE_QUANTITY_IN_CCM
    );

    // get table 2
    const table2 = tables?.subordinates?.find(
      ({ titleID }: Subordinate) =>
        titleID === TitleId.STRING_OUTP_OVERVIEW_OF_CALCULATION_DATA_FOR_GREASES
    );

    // console.log(tables);
    // console.log(table1);
    // console.log(table2);

    // compose compact grease table
    this.formattedResult = [
      ...this.formattedResult,
      {
        ...resultSection,
        defaultOpen: true,
        subordinates: [
          ...(table2?.data?.items
            .slice(0, 3)
            .map((item: TableItem[], index: number) => {
              const table1Values = table1?.data?.items[index];
              // console.log(item);

              const findItem = (searchField: Field): TableItem =>
                table1Values?.find(
                  ({ field }: TableItem) => field === searchField
                ) as TableItem;

              const greaseResult = {
                title: '',
                subtitlePart1: '',
                subtitlePart2: '',
                subtitlePart3: '',
                showValues: false,
                displayedColumns: ['title', 'values'],
                dataSource: [
                  {
                    title: 'greaseTable.initalGreaseQuantity',
                    values: `${findItem(Field.QVIN).value} ${
                      findItem(Field.QVIN).unit
                    }`,
                  },
                  {
                    title: 'greaseTable.manualRelubricationQuantityInterval',
                    values: `${
                      (+(findItem(Field.QVRE_MAN_MIN) as any).value +
                        +(findItem(Field.QVRE_MAN_MAX) as any).value) /
                      2
                    } ${findItem(Field.QVRE_MAN_MIN).unit}/${Math.round(
                      (+(findItem(Field.TFR_MIN) as any).value +
                        +(findItem(Field.TFR_MIN) as any).value) /
                        2 /
                        24
                    )} d`,
                  },
                  {
                    title: 'greaseTable.automaticRelubricationQuantityPerDay',
                    values: `${
                      (+(findItem(Field.QVRE_AUT_MIN) as any).value +
                        +(findItem(Field.QVRE_AUT_MAX) as any).value) /
                      2
                    } ${findItem(Field.QVRE_AUT_MIN).unit}`,
                  },
                ],
              };

              (greaseResult.dataSource as any)[3] = {
                title: 'greaseTable.automaticRelubricationPerWeek',
                values: `${Number(
                  ((+(findItem(Field.QVRE_AUT_MIN) as any).value +
                    +(findItem(Field.QVRE_AUT_MAX) as any).value) /
                    2) *
                    7
                ).toFixed(2)} ${findItem(Field.QVIN).unit}/7d`,
                display: false,
              };
              (greaseResult.dataSource as any)[4] = {
                title: 'greaseTable.automaticRelubricationPerMonth',
                values: `${Number(
                  ((+(findItem(Field.QVRE_AUT_MIN) as any).value +
                    +(findItem(Field.QVRE_AUT_MAX) as any).value) /
                    2) *
                    30
                ).toFixed(2)} ${findItem(Field.QVIN).unit}/30d`,
                display: false,
              };
              (greaseResult.dataSource as any)[5] = {
                title: 'greaseTable.automaticRelubricationPerYear',
                values: `${Number(
                  ((+(findItem(Field.QVRE_AUT_MIN) as any).value +
                    +(findItem(Field.QVRE_AUT_MAX) as any).value) /
                    2) *
                    365
                ).toFixed(2)} ${findItem(Field.QVIN).unit}/365d`,
                display: false,
              };
              (greaseResult.dataSource as any)[9] = {
                title: 'greaseTable.greaseServiceLife',
                values: `~ ${Math.round(
                  (+(findItem(Field.TFG_MIN) as any).value +
                    +(findItem(Field.TFG_MAX) as any).value) /
                    2 /
                    24
                )} d`,
                display: false,
              };
              (greaseResult.dataSource as any)[11] = {
                title: 'greaseTable.additiveRequired',
                values: `${findItem(Field.ADD_REQ).value}`,
                display: false,
              };
              (greaseResult.dataSource as any)[12] = {
                title: 'greaseTable.effectiveEpAdditivation',
                values: `${findItem(Field.ADD_W).value}`,
                display: false,
              };

              item.forEach(({ field, value, unit }: TableItem) => {
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
                  case Field.NY40:
                    (greaseResult.dataSource as any)[6] = {
                      title: 'greaseTable.baseOilViscosityAt40',
                      values: `${value} ${unit}`,
                      display: false,
                    };
                    break;
                  case Field.T_LIM_LOW:
                    (greaseResult.dataSource as any)[7] = {
                      title: 'greaseTable.lowerTemperatureLimit',
                      values: `${value} ${unit}`,
                      display: false,
                    };
                    break;
                  case Field.T_LIM_UP:
                    (greaseResult.dataSource as any)[8] = {
                      title: 'greaseTable.upperTemperatureLimit',
                      values: `${value} ${unit}`,
                      display: false,
                    };
                    break;
                  case Field.RHO:
                    (greaseResult.dataSource as any)[12] = {
                      title: 'greaseTable.density',
                      values: `${value} ${unit}`,
                      display: false,
                    };
                    break;
                  case Field.F_LOW:
                    (greaseResult.dataSource as any)[13] = {
                      title: 'greaseTable.lowFriction',
                      values: `${value} (${this.checkSuitablity(
                        value as string
                      )})`,
                      display: false,
                    };
                    break;
                  case Field.VIP:
                    (greaseResult.dataSource as any)[14] = {
                      title: 'greaseTable.suitableForVibrations',
                      values: `${value} (${this.checkSuitablity(
                        value as string
                      )})`,
                      display: false,
                    };
                    break;
                  case Field.SEAL:
                    (greaseResult.dataSource as any)[15] = {
                      title: 'greaseTable.supportForSeals',
                      values: `${value} (${this.checkSuitablity(
                        value as string
                      )})`,
                      display: false,
                    };
                    break;
                  case Field.NSF_H1:
                    (greaseResult.dataSource as any)[16] = {
                      title: 'greaseTable.H1Registration',
                      values: `${value}`,
                      display: false,
                    };
                    break;
                  default:
                    break;
                }
              });

              return {
                greaseResult,
                index,
                identifier: 'greaseResult',
              } as Subordinate;
            }) as Subordinate[]),
          // table1 as any, // Todo: remove later
          // table2 as any, // Todo: remove later
        ],
      },
    ];

    // add errors, warning, notes
    this.formattedResult = [
      ...this.formattedResult,
      {
        identifier: 'block',
        title: translate('errorsWarningsNotes'), // language change not considered
        subordinates: result.filter(
          (section: Subordinate) =>
            section.title && Object.values(Hint).includes(section.title as any)
        ),
      },
    ];

    // console.log(this.formattedResult);

    this.showActiveData();
  }

  public checkSuitablity(suitable: string) {
    const suitablityLevels = {
      '++': 'extremely suitable',
      '+': 'highly suitable',
      '0': 'suitable',
      '-': 'lett suitable',
      '--': 'note suitable',
    };

    return (suitablityLevels as any)[suitable] || '';
  }

  public toggleShowValues(subordinate: Subordinate): void {
    this.formattedResult = this.formattedResult.map((section: Subordinate) =>
      section.titleID === TitleId.STRING_OUTP_RESULTS
        ? {
            ...section,
            subordinates: section.subordinates?.map((subsection: any) =>
              subsection.index === (subordinate as any).index
                ? {
                    ...subsection,
                    greaseResult: {
                      ...subsection.greaseResult,
                      showValues: !subsection.greaseResult.showValues,
                    },
                  }
                : subsection
            ),
          }
        : section
    ) as Subordinate[];

    this.showActiveData();
  }

  public showActiveData(): void {
    const activeData = this.formattedResult.map((section: Subordinate) =>
      section.titleID === TitleId.STRING_OUTP_RESULTS
        ? {
            ...section,
            subordinates: section.subordinates?.map((subsection: any) => ({
              ...subsection,
              greaseResult: {
                ...subsection.greaseResult,
                dataSource: subsection.greaseResult?.dataSource.filter(
                  (entry: any) =>
                    entry.display !== subsection.greaseResult.showValues
                ),
              },
            })),
          }
        : section
    ) as Subordinate[];

    this.jsonResult$.next(activeData);
  }
}
