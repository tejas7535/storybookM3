import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { CalculationParametersFacade, SettingsFacade } from '@ga/core/store';
import { BearingSelectionFacade } from '@ga/core/store/facades/bearing-selection/bearing-selection.facade';
import { CalculationResultFacade } from '@ga/core/store/facades/calculation-result/calculation-result.facade';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import { TRACKING_PDF_DOWNLOAD } from '@ga/shared/constants';

import { ApplicationScenario } from '../calculation-parameters/constants/application-scenarios.model';
import { GreaseReportComponent } from './components/grease-report';
import { GreasePDFSelectionService } from './services/grease-pdf-select.service';
import { PdfGenerationService } from './services/pdf/pdf-generation.service';

@Component({
  selector: 'ga-calculation-result',
  templateUrl: './calculation-result.component.html',
  standalone: false,
})
export class CalculationResultComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);
  private readonly settingsFacade = inject(SettingsFacade);
  private readonly bearingSelectionFacade = inject(BearingSelectionFacade);
  private readonly calculationParametersFacade = inject(
    CalculationParametersFacade
  );
  private readonly calculationResultFacade = inject(CalculationResultFacade);

  private readonly pdfGenerationService = inject(PdfGenerationService);

  private readonly appInsightsService = inject(ApplicationInsightsService);
  private readonly pdfSelectionService = inject(GreasePDFSelectionService);

  private readonly greaseReport =
    viewChild<GreaseReportComponent>('greaseReport');

  public reportUrls = this.calculationResultFacade.reportUrls;
  public generatingPdf = signal(false);
  public pdfButtonLoadingState = computed(
    () => !this.reportUrls() || this.generatingPdf()
  );
  public pdfButtonDisabled = computed(
    () =>
      (this.isSelectionModeEnabled() && this.selectedCount() === 0) ||
      this.pdfButtonLoadingState()
  );
  public reportSelector = '.content';
  public selectedBearing = this.bearingSelectionFacade.selectedBearing;
  public preferredGreaseSelection = computed(
    () => this.calculationParametersFacade.preferredGrease()?.selectedGrease
  );
  public automaticLubrication =
    this.calculationParametersFacade.automaticLubrication;
  public appIsEmbedded = toSignal(this.settingsFacade.appIsEmbedded$);
  public partnerVersion = toSignal(this.settingsFacade.partnerVersion$);
  public bearinxVersions = this.calculationResultFacade.bearinxVersions;
  private readonly selectedApplications = toSignal(
    this.calculationParametersFacade.selectedGreaseApplication$
  );

  protected selectedCount = this.pdfSelectionService.selectedCount;
  protected isSelectionModeEnabled = this.pdfSelectionService.selectionMode;

  public titleHint = signal('resultsDefault');

  constructor() {
    const langChange = toSignal(this.translocoService.langChanges$, {
      initialValue: this.translocoService.getActiveLang(),
    });
    effect(() => {
      langChange(); // Track the signal
      this.calculationResultFacade.getCalculation();
    });
  }

  public ngOnInit(): void {
    this.calculationResultFacade.fetchBearinxVersions();
    this.pdfSelectionService.setSelectionMode(false);
  }

  public navigateBack(): void {
    this.router.navigate([
      `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
    ]);
  }

  public async generateReport(selectedBearing: string) {
    this.generatingPdf.set(true);

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
    await this.pdfGenerationService.generatePdf({
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

    this.generatingPdf.set(false);

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
}
