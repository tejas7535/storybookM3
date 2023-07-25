import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {
  LegacyTextOnlySnackBar as TextOnlySnackBar,
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarModule as MatSnackBarModule,
  MatLegacySnackBarRef as MatSnackBarRef,
} from '@angular/material/legacy-snack-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { Subscription } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmbeddedGoogleAnalyticsService } from '@ga/shared/services';
import { InteractionEventType } from '@ga/shared/services/embedded-google-analytics/interaction-event-type.enum';

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
    MatIconModule,
    MatButtonModule,
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
  public legalNote: string;
  public subordinates: GreaseReportSubordinate[] = [];
  public greaseInput: GreaseReportSubordinate | undefined;
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  private reportRaw!: GreaseReport;
  private currentLocale!: string;
  private localeChangeSubscription!: Subscription;

  public constructor(
    private readonly greaseReportService: GreaseReportService,
    private readonly snackbar: MatSnackBar,
    private readonly localeService: TranslocoLocaleService,
    private readonly embeddedGoogleAnalyticsService: EmbeddedGoogleAnalyticsService
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

  public getRemainingResultAmount(): number {
    return this.getResultAmount() - 3;
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

  public logTogglingInputSection(): void {
    this.embeddedGoogleAnalyticsService.logInteractionEvent(
      InteractionEventType.ShowInput
    );
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

    if (this.reportRaw?.subordinates) {
      this.legalNote = this.reportRaw.subordinates.find(
        (subordinate) => subordinate.identifier === 'legalNote'
      )?.legal;
    }
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
