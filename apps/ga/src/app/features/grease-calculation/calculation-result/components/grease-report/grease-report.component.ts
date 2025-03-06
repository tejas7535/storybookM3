import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BehaviorSubject, Subject, Subscription } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SettingsFacade } from '@ga/core/store';
import {
  getResultMessages,
  hasResultMessage,
} from '@ga/core/store/selectors/calculation-result/calculation-result.selector';
import { AppStoreButtonsComponent } from '@ga/shared/components/app-store-buttons/app-store-buttons.component';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';

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
  imports: [
    CommonModule,
    PushPipe,
    MatExpansionModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    SharedTranslocoModule,
    GreaseReportInputComponent,
    GreaseReportResultComponent,
    PushPipe,
    MatButtonModule,
    MatIconModule,
    AppStoreButtonsComponent,
    ApplicationInsightsModule,
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
  @Input() public versions?: string;

  public resultsLimit = 3;
  public limitResults = true;
  public isAppEmbedded$ = this.settingsFacade.appIsEmbedded$;
  public legalNote: string;
  public subordinates: GreaseReportSubordinate[] = [];
  public greaseInput: GreaseReportSubordinate | undefined;
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  public triggerRecommendationPresenceDetection$$ = new Subject<void>();
  public hasRecommendation$$ = new BehaviorSubject(false);
  public hasMessages$ = this.store.select(hasResultMessage);
  public resultMessages$ = this.store.select(getResultMessages);

  private reportRaw!: GreaseReport;
  private currentLocale!: string;
  private localeChangeSubscription!: Subscription;

  public constructor(
    private readonly greaseReportService: GreaseReportService,
    private readonly snackbar: MatSnackBar,
    private readonly localeService: TranslocoLocaleService,
    private readonly store: Store,
    private readonly appAnalyticsService: AppAnalyticsService,
    private readonly settingsFacade: SettingsFacade
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

  public isMessagesSection = (
    titleID: GreaseReportSubordinateTitle | string | undefined
  ): boolean => titleID === GreaseReportSubordinateTitle.STRING_NOTE_BLOCK;

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
    this.appAnalyticsService.logInteractionEvent(
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

  private async assignReportData(): Promise<void> {
    this.subordinates = await this.greaseReportService.formatGreaseReport(
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

    const hasRecommendation = this.subordinates
      .find((sub) => sub.titleID === 'STRING_OUTP_RESULTS')
      ?.subordinates.some((sub) => sub.greaseResult?.isRecommended);
    this.hasRecommendation$$.next(hasRecommendation);
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
