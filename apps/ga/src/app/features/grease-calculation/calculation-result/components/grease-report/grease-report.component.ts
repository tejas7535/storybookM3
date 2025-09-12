import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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

import { Subject, Subscription } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationParametersFacade, SettingsFacade } from '@ga/core/store';
import {
  getResultMessages,
  hasResultMessage,
} from '@ga/core/store/selectors/calculation-result/calculation-result.selector';
import { environment } from '@ga/environments/environment';
import { AppStoreButtonsComponent } from '@ga/shared/components/app-store-buttons/app-store-buttons.component';
import { GreaseDisclaimerComponent } from '@ga/shared/components/grease-disclaimer/grease-disclaimer.component';
import { SelectedCompetitorGreaseComponent } from '@ga/shared/components/selected-competitor-grease/selected-competitor-grease.component';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';

import {
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
import { GreasePDFSelectionService } from '../../services/grease-pdf-select.service';
import { GreaseReportInputComponent } from '../grease-report-input';
import { GreaseReportResultCardComponent } from '../grease-report-result-card/grease-report-result-card.component';

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
    PushPipe,
    MatButtonModule,
    MatIconModule,
    AppStoreButtonsComponent,
    ApplicationInsightsModule,
    GreaseReportResultCardComponent,
    GreaseDisclaimerComponent,
    SelectedCompetitorGreaseComponent,
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
  private readonly greaseReportService = inject(GreaseReportService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly localeService = inject(TranslocoLocaleService);
  private readonly store = inject(Store);
  private readonly appAnalyticsService = inject(AppAnalyticsService);
  private readonly settingsFacade = inject(SettingsFacade);
  private readonly calculationParametersFacade = inject(
    CalculationParametersFacade
  );
  protected readonly greasePDFSelection = inject(GreasePDFSelectionService);

  public greaseReportUrl = input<string>('');
  public preferredGreaseResult = input<PreferredGreaseResult | undefined>();
  public automaticLubrication = input(false);
  public versions = input<string | undefined>();

  public titleHintContext = output<string>();

  public messageSectionId = GreaseReportSubordinateTitle.STRING_NOTE_BLOCK;

  public isProdMode = environment.production;

  public resultsLimit = 3;
  public limitResults = signal(true);
  public isAppEmbedded$ = this.settingsFacade.appIsEmbedded$;
  public subordinates = this.greaseReportService.subordinates;
  public snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  public triggerRecommendationPresenceDetection$$ = new Subject<void>();
  public hasMessages$ = this.store.select(hasResultMessage);
  public resultMessages$ = this.store.select(getResultMessages);
  public hasMiscibileGreaseResult = toSignal(
    this.calculationParametersFacade.mixableSchaefflerGreases$
  );
  public hasMiscibileGreases = computed(
    () => this.hasMiscibileGreaseResult()?.length > 0
  );

  public greaseResultReport = this.greaseReportService.greaseResultReport;
  public greaseResults = computed(() => {
    if (this.limitResults()) {
      return (
        this.greaseResultReport()?.greaseResult?.slice(0, this.resultsLimit) ??
        []
      );
    }

    return this.greaseResultReport()?.greaseResult;
  });
  public greaseResultAmount = computed(
    () => this.greaseResultReport()?.greaseResult?.length || 0
  );
  concept1Impossible = computed(
    () =>
      this.automaticLubrication &&
      !this.greaseResultReport()?.greaseResult?.find(
        (result) =>
          result.relubrication.concept1.custom.data.label ===
          SUITABILITY_LABEL.SUITED
      )
  );
  public greaseInput = computed(() => this.greaseResultReport()?.inputs);
  public hasRecommendation = computed(() => {
    const hasRecommendation = this.greaseResultReport()?.greaseResult?.some(
      (greaseResult) => greaseResult.isRecommended
    );

    return hasRecommendation;
  });
  public errorWarningsAndNotes = computed(
    () => this.greaseResultReport()?.errorWarningsAndNotes
  );
  public legalNote = computed(() => this.greaseResultReport()?.legalNote);

  private currentLocale!: string;
  private localeChangeSubscription!: Subscription;

  constructor() {
    effect(() => {
      switch (true) {
        case this.hasMiscibileGreases() || !!this.preferredGreaseResult():
          this.titleHintContext.emit('resultsWithPreferred');
          break;
        case this.hasRecommendation():
          this.titleHintContext.emit('resultsWithRecommendation');
          break;
        default:
          this.titleHintContext.emit('resultsDefault');
          break;
      }
    });
  }

  public ngOnInit(): void {
    if (this.greaseReportUrl()) {
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

  public typedSubordinate = (subordinate: GreaseReportSubordinate) =>
    subordinate;

  public logTogglingInputSection(): void {
    this.appAnalyticsService.logInteractionEvent(
      InteractionEventType.ShowInput
    );
  }

  public handleGreaseToggle(greaseName: string) {
    this.greasePDFSelection.toggleSelected(greaseName);
  }

  private fetchGreaseReport(): void {
    this.greaseReportService
      .getGreaseReport(
        this.greaseReportUrl(),
        this.preferredGreaseResult(),
        this.automaticLubrication()
      )
      .catch((error) => {
        console.error(error);
        this.showSnackBarError();
      });
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
