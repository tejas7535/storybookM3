import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subscription } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  GreaseReport,
  GreaseReportSubordinate,
  GreaseReportSubordinateTitle,
  PreferredGreaseResult,
  SUITABILITY_LABEL,
} from '../../models';
import { UndefinedValuePipe } from '../../pipes';
import {
  GreaseReportService,
  GreaseResultDataSourceService,
} from '../../services';
import { GreaseReportInputComponent } from '../grease-report-input';
import { GreaseReportResultComponent } from '../grease-report-result';

@Component({
  selector: 'ga-grease-report',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSnackBarModule,
    SharedTranslocoModule,
    GreaseReportInputComponent,
    GreaseReportResultComponent,
  ],
  providers: [
    GreaseReportService,
    GreaseResultDataSourceService,
    UndefinedValuePipe,
  ],
  templateUrl: './grease-report.component.html',
  styleUrls: ['./grease-report.component.scss'],
})
export class GreaseReportComponent implements OnInit, OnDestroy {
  @Input() public greaseReportUrl = '';
  @Input() public preferredGreaseResult?: PreferredGreaseResult;
  @Input() public automaticLubrication = false;

  public resultsLimit = 3;
  public limitResults = true;
  public subordinates: GreaseReportSubordinate[] = [];
  public greaseInput: GreaseReportSubordinate | undefined;
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  private reportRaw!: GreaseReport;
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

  public isGreaseResultSection = (
    titleID: GreaseReportSubordinateTitle | string | undefined
  ): boolean => titleID === GreaseReportSubordinateTitle.STRING_OUTP_RESULTS;

  public isInputSection = (subordinate: GreaseReportSubordinate): boolean =>
    subordinate?.titleID === GreaseReportSubordinateTitle.STRING_OUTP_INPUT;

  public toggleLimitResults(): void {
    this.limitResults = !this.limitResults;
  }

  public limitSubordinates = (
    subordinates: GreaseReportSubordinate[],
    titleID: `${GreaseReportSubordinateTitle}`
  ): GreaseReportSubordinate[] =>
    this.isGreaseResultSection(titleID) && this.limitResults
      ? subordinates.slice(0, this.resultsLimit)
      : subordinates;

  public getResultAmount(): number {
    return this.greaseReportService.getResultAmount(this.subordinates);
  }

  public typedSubordinate = (subordinate: GreaseReportSubordinate) =>
    subordinate;

  public concept1Impossible(): boolean {
    return (
      this.automaticLubrication &&
      this.subordinates
        .find(({ titleID }) => this.isGreaseResultSection(titleID))
        ?.subordinates.filter(
          ({ greaseResult }) =>
            greaseResult.dataSource[0].custom.data.label ===
            SUITABILITY_LABEL.SUITED
        ).length === 0
    );
  }

  private assignReportData(): void {
    this.subordinates = this.greaseReportService.formatGreaseReport(
      this.reportRaw?.subordinates,
      this.preferredGreaseResult,
      this.automaticLubrication
    );

    this.greaseInput = this.subordinates.find(
      (subordinate) =>
        subordinate.titleID === GreaseReportSubordinateTitle.STRING_OUTP_INPUT
    );
  }

  private showSnackBarError(): void {
    this.snackBarRef = this.snackbar.open(
      translate('calculationResult.snackbarError'),
      translate('calculationResult.snackbarRetry'),
      {
        duration: Number.POSITIVE_INFINITY,
      }
    );
  }
}
