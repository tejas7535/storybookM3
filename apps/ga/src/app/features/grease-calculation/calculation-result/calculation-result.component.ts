import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { debounceTime, Subscription } from 'rxjs';

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
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import { TRACKING_PDF_DOWNLOAD } from '@ga/shared/constants';
import { ReportUrls } from '@ga/shared/models';

import { ApplicationScenario } from '../calculation-parameters/constants/application-scenarios.model';
import { GreaseReportComponent } from './components/grease-report';
import { GreasePDFSelectionService } from './services/grease-pdf-select.service';
import { PdfGenerationService } from './services/pdf/pdf-generation.service';

@Component({
  selector: 'ga-calculation-result',
  templateUrl: './calculation-result.component.html',
  standalone: false,
})
export class CalculationResultComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);
  private readonly settingsFacade = inject(SettingsFacade);
  private readonly calculationParametersFacade = inject(
    CalculationParametersFacade
  );

  private readonly pdfGenerationService = inject(PdfGenerationService);

  private readonly appInsightsService = inject(ApplicationInsightsService);
  private readonly pdfSelectionService = inject(GreasePDFSelectionService);

  private readonly greaseReport =
    viewChild<GreaseReportComponent>('greaseReport');

  public reportUrls: ReportUrls;
  public reportSelector = '.content';
  public selectedBearing = toSignal(this.store.select(getSelectedBearing));
  public preferredGreaseSelection = toSignal(
    this.store.select(getPreferredGreaseSelection)
  );
  public automaticLubrication = toSignal(
    this.store.select(getAutomaticLubrication)
  );
  public appIsEmbedded = toSignal(this.settingsFacade.appIsEmbedded$);
  public partnerVersion = toSignal(this.settingsFacade.partnerVersion$);
  public bearinxVersions = toSignal(this.store.select(getVersions));
  private readonly selectedApplications = toSignal(
    this.calculationParametersFacade.selectedGreaseApplication$
  );

  private currentLanguage!: string;
  private reportUrlsSubscription!: Subscription;
  private languageChangeSubscription!: Subscription;

  protected selectedCount = this.pdfSelectionService.selectedCount;
  protected isSelectionModeEnabled = this.pdfSelectionService.selectionMode;

  public titleHint = signal('resultsDefault');

  public ngOnInit(): void {
    this.store.dispatch(fetchBearinxVersions());
    this.store.dispatch(getCalculation());
    this.pdfSelectionService.setSelectionMode(false);

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

    const selectedApplication = this.selectedApplications();
    const applicationLabel = this.translocoService.translate(
      'parameters.application'
    );
    const translatedApplicationSelection = selectedApplication
      ? this.translocoService.translate(
          `parameters.applications.${selectedApplication}`
        )
      : '';

    const inputSubordinate = {
      ...this.greaseReport().greaseResultReport().inputs,
    };
    inputSubordinate.subordinates = inputSubordinate.subordinates.map((env) => {
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
    });

    const selectedGreaseResults = this.greaseReport()
      .greaseResultReport()
      .greaseResult.filter((result) =>
        this.pdfSelectionService.isSelected(result.mainTitle)
      );

    const versions = this.bearinxVersions();
    this.pdfGenerationService.generatePdf({
      reportTitle,
      sectionSubTitle: hint,
      data: [
        inputSubordinate,
        this.greaseReport().greaseResultReport().errorWarningsAndNotes,
      ],
      results: selectedGreaseResults,
      legalNote: this.greaseReport().legalNote(),
      versions,
    });

    this.appInsightsService.logEvent(TRACKING_PDF_DOWNLOAD, {
      selectedBearing,
    });
  }

  public toggleGreaseSelection() {
    this.pdfSelectionService.toggleSelectionMode();
  }

  public setTitleHintContext(hint: string): void {
    this.titleHint.set(hint);
  }

  private resetReportUrls(): void {
    this.reportUrls = undefined;
  }
}
