/* eslint-disable max-lines */
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { ReplaySubject, Subject, takeUntil } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { GreaseReportService } from './grease/grease-report.service';
import { TableItem, TitleId, Type } from './models';
import { Subordinate } from './models/subordinate.model';
import { ReportService } from './report.service';

@Component({
  selector: 'schaeffler-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [ReportService, GreaseReportService],
  encapsulation: ViewEncapsulation.None,
})
export class ReportComponent implements OnInit, OnDestroy {
  @Input() public title!: string;
  @Input() public subtitle?: string;
  @Input() public htmlReport?: string;
  @Input() public jsonReport?: string;
  @Input() public reportSelector?: string;
  @Input() public downloadReport?: string;
  @Input() public errorMsg = translate('snackbarError') as string;
  @Input() public actionText = translate('snackbarRetry') as string;
  @Input() public type = Type.GENERIC;
  @Input() public resultAmount = 3;

  public limitResults = true;
  public htmlResult$ = new ReplaySubject<Subordinate[]>();
  public jsonResult$ = new ReplaySubject<Subordinate[]>();
  private readonly destroy$ = new Subject<void>();
  public formattedResult: Subordinate[] = [];
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  public constructor(
    private readonly reportService: ReportService,
    private readonly snackbar: MatSnackBar,
    private readonly greaseReportService: GreaseReportService
  ) {}

  public ngOnInit(): void {
    if (this.htmlReport) {
      this.getHtmlReport();
    } else if (this.jsonReport) {
      this.getJsonReport();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.snackBarRef?.dismiss();
  }

  public getHtmlReport(): void {
    this.reportService
      .getHtmlReport(this.htmlReport as string, this.reportSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => this.htmlResult$.next(result),
        error: () => {
          this.showSnackBarError();
          this.snackBarRef
            ?.afterDismissed()
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
        next: (result: Subordinate[]) => {
          if (this.type === Type.GREASE) {
            this.formattedResult =
              this.greaseReportService.formatGreaseReport(result);
            this.jsonResult$.next(
              this.greaseReportService.showActiveData(this.formattedResult)
            );
          } else {
            this.jsonResult$.next(result);
          }
        },
        error: () => {
          this.showSnackBarError();
          this.snackBarRef
            ?.afterDismissed()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.getJsonReport());
        },
      });
  }

  public showSnackBarError(): void {
    this.snackBarRef = this.snackbar.open(this.errorMsg, this.actionText, {
      duration: Number.POSITIVE_INFINITY,
    });
  }

  public getItem(row: TableItem[], field: string): TableItem | undefined {
    return row.find((element: TableItem) => element.field === field);
  }

  public getHeaders(fields: string[]): string[] {
    return fields.map((field: string, index: number) => `${field}${index}`);
  }

  public toggleShowValues(subordinate: Subordinate): void {
    this.formattedResult = this.greaseReportService.toggleShowValues(
      subordinate,
      this.formattedResult
    );

    const activeData = this.greaseReportService.showActiveData(
      this.formattedResult
    );

    this.jsonResult$.next(activeData);
  }

  public isGreaseResultSection = (titleID: TitleId | string) =>
    titleID === TitleId.STRING_OUTP_RESULTS;

  public toggleLimitResults(): void {
    this.limitResults = !this.limitResults;
  }

  public limitSubordinates(
    subordinates: Subordinate[],
    titleID: TitleId
  ): Subordinate[] {
    return this.isGreaseResultSection(titleID) && this.limitResults
      ? subordinates.slice(0, this.resultAmount)
      : subordinates;
  }

  public filteredData(data: any[]) {
    return data.filter(Boolean);
  }
}
