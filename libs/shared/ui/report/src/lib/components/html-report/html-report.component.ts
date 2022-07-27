/* eslint-disable max-lines */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { ReplaySubject, Subject, takeUntil } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { Subordinate } from '../../models';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'schaeffler-html-report',
  templateUrl: './html-report.component.html',
  styleUrls: ['./html-report.component.scss'],
  providers: [ReportService],
})
export class HtmlReportComponent implements OnInit, OnDestroy {
  @Input() public htmlReportTitle!: string;
  @Input() public htmlReportSubtitle!: string;
  @Input() public htmlReportUrl = '';
  @Input() public reportSelector?: string;
  @Input() public downloadReport?: string;
  @Input() public errorMsg = translate('snackbarError') as string;
  @Input() public actionText = translate('snackbarRetry') as string;

  public htmlResult$: ReplaySubject<Subordinate[]> = new ReplaySubject<
    Subordinate[]
  >();
  private readonly destroy$ = new Subject<void>();
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  public constructor(
    private readonly reportService: ReportService,
    private readonly snackbar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    if (this.htmlReportUrl) {
      this.getHtmlReport();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.snackBarRef?.dismiss();
  }

  public getHtmlReport(): void {
    this.reportService
      .getHtmlReport(this.htmlReportUrl, this.reportSelector)
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

  public showSnackBarError(): void {
    this.snackBarRef = this.snackbar.open(this.errorMsg, this.actionText, {
      duration: Number.POSITIVE_INFINITY,
    });
  }
}
