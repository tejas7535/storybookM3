import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { translate } from '@ngneat/transloco';

import { Subordinate, TitleId } from '../../models/index';
import { GreaseReportService } from '../services/grease-report.service';

@Component({
  selector: 'schaeffler-grease-report',
  templateUrl: './grease-report.component.html',
  styleUrls: ['./grease-report.component.scss'],
  providers: [GreaseReportService],
})
export class GreaseReportComponent implements OnInit, OnDestroy {
  @Input() public greaseReportTitle!: string;
  @Input() public greaseReportSubtitle?: string;
  @Input() public greaseReportUrl = '';
  @Input() public greaseReportSelector?: string;
  @Input() public errorMessage = translate('snackbarError') as string;
  @Input() public actionText = translate('snackbarRetry') as string;
  @Input() public resultAmount = 3;

  public limitResults = true;
  public subordinates: Subordinate[] = [];
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  public constructor(
    private readonly greaseReportService: GreaseReportService,
    private readonly snackbar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    if (this.greaseReportUrl) {
      this.fetchGreaseReport();
    }
  }

  public ngOnDestroy(): void {
    this.snackBarRef?.dismiss();
  }

  private fetchGreaseReport(): void {
    this.greaseReportService
      .getGreaseReport(this.greaseReportUrl)
      .then((report) => {
        this.assignReportData(report?.subordinates);
      })
      .catch(() => {
        this.showSnackBarError();
      });
  }

  public showSnackBarError(): void {
    this.snackBarRef = this.snackbar.open(this.errorMessage, this.actionText, {
      duration: Number.POSITIVE_INFINITY,
    });
  }

  public isGreaseResultSection = (
    titleID: TitleId | string | undefined
  ): boolean => titleID === TitleId.STRING_OUTP_RESULTS;

  public toggleLimitResults(): void {
    this.limitResults = !this.limitResults;
  }

  public limitSubordinates = (
    subordinates: Subordinate[],
    titleID: `${TitleId}`
  ): Subordinate[] =>
    this.isGreaseResultSection(titleID) && this.limitResults
      ? subordinates.slice(0, this.resultAmount)
      : subordinates;

  public getResultAmount(): number {
    return this.greaseReportService.getResultAmount(this.subordinates);
  }

  public typedSubordinate = (subordinate: Subordinate) => subordinate;

  private assignReportData(subordinates: Subordinate[]): void {
    this.subordinates =
      this.greaseReportService.formatGreaseReport(subordinates);
  }
}
