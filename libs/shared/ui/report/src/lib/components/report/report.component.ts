import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { ReplaySubject, Subject, takeUntil } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { Field, Subordinate, TableItem, Type } from '../../models';
import { ReportService } from '../../report.service';

@Component({
  selector: 'schaeffler-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [ReportService],
})
export class ReportComponent implements OnInit, OnDestroy {
  @Input() public title!: string;
  @Input() public subtitle?: string;
  @Input() public jsonReportUrl = '';
  @Input() public reportSelector?: string;
  @Input() public downloadReport?: string;
  @Input() public errorMsg = translate('snackbarError') as string;
  @Input() public actionText = translate('snackbarRetry') as string;
  @Input() public type = Type.GENERIC;
  @Input() public resultAmount = 3;

  public jsonResult$: ReplaySubject<Subordinate[]> = new ReplaySubject<
    Subordinate[]
  >();
  private readonly destroy$ = new Subject<void>();
  public formattedResult: Subordinate[] = [];
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  public constructor(
    private readonly reportService: ReportService,
    private readonly snackbar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    if (this.jsonReportUrl) {
      this.getJsonReport();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.snackBarRef?.dismiss();
  }

  public getJsonReport(): void {
    this.reportService
      .getJsonReport(this.jsonReportUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: Subordinate[]) => {
          this.jsonResult$.next(result);
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

  public getItem(
    tableItems: TableItem[],
    field: `${Field}`
  ): TableItem | undefined {
    return tableItems.find((tableItem: TableItem) => tableItem.field === field);
  }

  public getHeaders(fields: string[]): string[] {
    return fields.map((field: string, index: number) => `${field}${index}`);
  }
}
