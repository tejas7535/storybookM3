import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { Report, Subordinate, TitleId } from '../../models';
import { GreaseReportService } from '../services/grease-report.service';

@Component({
  selector: 'schaeffler-grease-report',
  templateUrl: './grease-report.component.html',
  styleUrls: ['./grease-report.component.scss'],
})
export class GreaseReportComponent implements OnInit, OnDestroy {
  @Input() public greaseReportUrl = '';

  public resultsLimit = 3;
  public limitResults = true;
  public subordinates: Subordinate[] = [];
  public greaseInput: Subordinate | undefined;
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  private reportRaw!: Report;
  private currentLocale!: string;
  private localeChangeSubscription!: Subscription;

  public constructor(
    private readonly greaseReportService: GreaseReportService,
    private readonly snackbar: MatSnackBar,
    private readonly localeService: TranslocoLocaleService
  ) {}

  public ngOnInit(): void {
    if (this.greaseReportUrl) {
      this.fetchGreaseReport();
    }

    this.currentLocale = this.localeService.getLocale();

    this.localeChangeSubscription = this.localeService.localeChanges$.subscribe(
      (locale) => {
        if (locale !== this.currentLocale) {
          this.currentLocale = locale;
          this.localeService.setLocale(locale);
          this.fetchGreaseReport();
        }
      }
    );
  }

  public ngOnDestroy(): void {
    this.snackBarRef?.dismiss();

    if (this.localeChangeSubscription) {
      this.localeChangeSubscription.unsubscribe();
    }
  }

  private fetchGreaseReport(): void {
    this.greaseReportService
      .getGreaseReport(this.greaseReportUrl)
      .then((report) => {
        this.reportRaw = report;
        this.assignReportData();
      })
      .catch(() => {
        this.showSnackBarError();
      });
  }

  public showSnackBarError(): void {
    this.snackBarRef = this.snackbar.open(
      translate('snackbarError'),
      translate('snackbarRetry'),
      {
        duration: Number.POSITIVE_INFINITY,
      }
    );
  }

  public isGreaseResultSection = (
    titleID: TitleId | string | undefined
  ): boolean => titleID === TitleId.STRING_OUTP_RESULTS;

  public isInputSection = (subordinate: Subordinate): boolean =>
    subordinate?.titleID === TitleId.STRING_OUTP_INPUT;

  public toggleLimitResults(): void {
    this.limitResults = !this.limitResults;
  }

  public limitSubordinates = (
    subordinates: Subordinate[],
    titleID: `${TitleId}`
  ): Subordinate[] =>
    this.isGreaseResultSection(titleID) && this.limitResults
      ? subordinates.slice(0, this.resultsLimit)
      : subordinates;

  public getResultAmount(): number {
    return this.greaseReportService.getResultAmount(this.subordinates);
  }

  public typedSubordinate = (subordinate: Subordinate) => subordinate;

  private assignReportData(): void {
    this.subordinates = this.greaseReportService.formatGreaseReport(
      this.reportRaw?.subordinates
    );

    this.greaseInput = this.subordinates.find(
      (subordinate) => subordinate.titleID === TitleId.STRING_OUTP_INPUT
    );
  }
}
