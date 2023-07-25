import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { debounceTime, Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { environment } from '@ga/../environments/environment';
import { AppRoutePath } from '@ga/app-route-path.enum';
import { getSelectedBearing, SettingsFacade } from '@ga/core/store';
import { getCalculation } from '@ga/core/store/actions/calculation-result/calculation-result.actions';
import {
  getAutomaticLubrication,
  getPreferredGreaseSelection,
} from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import { getReportUrls } from '@ga/core/store/selectors/calculation-result/calculation-result.selector';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import { ReportUrls } from '@ga/shared/models';

import { GreaseReportComponent } from './components/grease-report';
import { GreaseReportPdfGeneratorService } from './services/grease-report-pdf-generator.service';

@Component({
  selector: 'ga-calculation-result',
  templateUrl: './calculation-result.component.html',
})
export class CalculationResultComponent implements OnInit, OnDestroy {
  @ViewChild('greaseReport') greaseReport: GreaseReportComponent;

  public isProduction = environment.production;
  public reportUrls: ReportUrls;
  public reportSelector = '.content';
  public showCompactView = true;
  public selectedBearing$ = this.store.select(getSelectedBearing);
  public preferredGreaseSelection$ = this.store.select(
    getPreferredGreaseSelection
  );
  public automaticLubrication$ = this.store.select(getAutomaticLubrication);
  public appIsEmbedded$ = this.settingsFacade.appIsEmbedded$;

  private currentLanguage!: string;
  private reportUrlsSubscription!: Subscription;
  private languageChangeSubscription!: Subscription;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly settingsFacade: SettingsFacade,
    private readonly greaseReportGeneratorService: GreaseReportPdfGeneratorService
  ) {}

  public ngOnInit(): void {
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

  public generateReport(selectedBearing: string): void {
    const title = this.translocoService.translate(
      'calculationResult.title.main'
    );

    const hint = this.translocoService.translate(
      'calculationResult.title.247hint'
    );
    const reportTitle = `${title} ${selectedBearing} - ${hint}`;

    this.greaseReportGeneratorService.generateReport({
      reportTitle,
      data: this.greaseReport.subordinates,
      legalNote: this.greaseReport.legalNote,
    });
  }

  private resetReportUrls(): void {
    this.reportUrls = undefined;
  }
}
