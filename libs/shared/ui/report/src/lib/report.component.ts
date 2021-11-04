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

    // console.log(resultSection);

    // compose compact grease table
    const greaseList = resultSection?.subordinates
      ?.filter(
        ({ titleID }: Subordinate) =>
          titleID === TitleId.STRING_OUTP_RESULTS_FOR_GREASE_SELECTION
      )
      .pop()
      ?.subordinates?.find(
        ({ titleID }: Subordinate) =>
          titleID ===
          TitleId.STRING_OUTP_OVERVIEW_OF_CALCULATION_DATA_FOR_GREASES
      );

    console.log(greaseList);

    formattedResult = [
      ...formattedResult,
      {
        ...resultSection,
        defaultOpen: true,
        subordinates: [
          ...(greaseList?.data?.items.slice(0, 3).map((item: TableItem[]) => {
            let title = '';
            let subtitlePart1 = '';
            let subtitlePart2 = '';
            let subtitlePart3 = '';

            item.forEach(({ field, value }: TableItem) => {
              // console.log({ field, value });

              switch (field) {
                case Field.GREASE_GRADE:
                  title = `
                    <a 
                      class="text-caption text-primary" 
                      href="https://medias.schaeffler.de/de/search/searchpage?text=${value}" 
                      target="_blank">
                        ${value} &#10140;
                    </a>`;
                  break;
                case Field.BASEOIL:
                  subtitlePart1 = `${value}`;
                  break;
                case Field.NLGI:
                  subtitlePart2 = `NLGI${value}`;
                  break;
                case Field.THICKENER:
                  subtitlePart3 = `${value}`;
                  break;
                default:
                  break;
              }
            });

            const outerHTML = `
              <div class="py-6">
                ${title}
                <p class="text-caption">${subtitlePart1}, ${subtitlePart2}, ${subtitlePart3}</p>
              <div>
            `;

            return {
              outerHTML,
              identifier: 'custom',
            } as Subordinate;
          }) as Subordinate[]),
          greaseList as any, // Todo: remove later
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
