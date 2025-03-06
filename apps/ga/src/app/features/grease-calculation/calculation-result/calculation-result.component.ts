import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { debounceTime, firstValueFrom, Subscription } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { AppRoutePath } from '@ga/app-route-path.enum';
import {
  CalculationParametersFacade,
  getSelectedBearing,
  SettingsFacade,
} from '@ga/core/store';
import {
  fetchBearinxVersions,
  getCalculation,
} from '@ga/core/store/actions/calculation-result/calculation-result.actions';
import {
  getAutomaticLubrication,
  getPreferredGreaseSelection,
} from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import {
  getReportUrls,
  getVersions,
} from '@ga/core/store/selectors/calculation-result/calculation-result.selector';
import { Environment } from '@ga/environments/environment.model';
import { ENV } from '@ga/environments/environments.provider';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import { TRACKING_PDF_DOWNLOAD } from '@ga/shared/constants';
import { ReportUrls } from '@ga/shared/models';

import { ApplicationScenario } from '../calculation-parameters/constants/application-scenarios.model';
import { GreaseReportComponent } from './components/grease-report';
import { GreaseReportPdfGeneratorService } from './services/pdf/grease-report-pdf-generator.service';

@Component({
  selector: 'ga-calculation-result',
  templateUrl: './calculation-result.component.html',
})
export class CalculationResultComponent implements OnInit, OnDestroy {
  @ViewChild('greaseReport') greaseReport: GreaseReportComponent;

  public isProduction;
  public reportUrls: ReportUrls;
  public reportSelector = '.content';
  public showCompactView = true;
  public selectedBearing$ = this.store.select(getSelectedBearing);
  public preferredGreaseSelection$ = this.store.select(
    getPreferredGreaseSelection
  );
  public automaticLubrication$ = this.store.select(getAutomaticLubrication);
  public appIsEmbedded$ = this.settingsFacade.appIsEmbedded$;
  public partnerVersion$ = this.settingsFacade.partnerVersion$;
  public bearinxVersions$ = this.store.select(getVersions);
  private readonly selectedApplications$ =
    this.calculationParametersFacade.selectedGreaseApplication$;

  private currentLanguage!: string;
  private reportUrlsSubscription!: Subscription;
  private languageChangeSubscription!: Subscription;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly settingsFacade: SettingsFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly greaseReportGeneratorService: GreaseReportPdfGeneratorService,
    private readonly appInsightsService: ApplicationInsightsService,
    @Inject(ENV) private readonly env: Environment
  ) {
    this.isProduction = this.env.production;
  }

  public ngOnInit(): void {
    this.store.dispatch(fetchBearinxVersions());
    this.store.dispatch(getCalculation());

    this.reportUrlsSubscription = this.store
      .select(getReportUrls)
      .pipe(debounceTime(3000))
      .subscribe((reportUrls) => {
        this.reportUrls = reportUrls;
      });

    this.currentLanguage = this.translocoService.getActiveLang();

    this.languageChangeSubscription =
      this.translocoService.langChanges$.subscribe((language) => {
        if (language !== this.currentLanguage) {
          this.currentLanguage = language;
          this.resetReportUrls();
          this.store.dispatch(getCalculation());
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.reportUrlsSubscription) {
      this.reportUrlsSubscription.unsubscribe();
    }

    if (this.languageChangeSubscription) {
      this.languageChangeSubscription.unsubscribe();
    }
  }

  public navigateBack(): void {
    this.router.navigate([
      `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
    ]);
  }

  public async generateReport(selectedBearing: string) {
    const title = this.translocoService.translate(
      'calculationResult.title.main'
    );

    const hint = this.translocoService.translate(
      'calculationResult.title.247hint'
    );
    const reportTitle = `${title} ${selectedBearing}`;

    const selectedApplication = await firstValueFrom(
      this.selectedApplications$
    );
    const applicationLabel = this.translocoService.translate(
      'parameters.application'
    );
    const translatedApplicationSelection = selectedApplication
      ? this.translocoService.translate(
          `parameters.applications.${selectedApplication}`
        )
      : '';
    const reportData = [...this.greaseReport.subordinates].map((sub) => {
      if (sub.titleID === 'STRING_OUTP_INPUT') {
        const modifiedSubordinate = { ...sub };
        modifiedSubordinate.subordinates = modifiedSubordinate.subordinates.map(
          (env) => {
            if (
              env.titleID === 'PROPERTY_PAGE_TITLE_TEMPERATURES' &&
              !!selectedApplication &&
              selectedApplication !== ApplicationScenario.All
            ) {
              const modifiedEnv = { ...env };
              modifiedEnv.subordinates.push({
                identifier: 'variableLine',
                designation: applicationLabel,
                value: translatedApplicationSelection,
              });

              return modifiedEnv;
            }

            return env;
          }
        );
      }

      return sub;
    });

    const versions = await firstValueFrom(this.bearinxVersions$);

    this.greaseReportGeneratorService.generateReport({
      reportTitle,
      sectionSubTitle: hint,
      data: reportData,
      legalNote: this.greaseReport.legalNote,
      automaticLubrication: this.greaseReport.automaticLubrication,
      versions,
    });
    this.appInsightsService.logEvent(TRACKING_PDF_DOWNLOAD, {
      selectedBearing,
    });
  }

  private resetReportUrls(): void {
    this.reportUrls = undefined;
  }
}
