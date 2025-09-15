/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TranslocoService } from '@jsverse/transloco';
import { ResultTypeConfig } from '@mm/core/store/models/calculation-result-state.model';
import { QualtricsInfoBannerComponent } from '@mm/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import {
  PdfCardFactory,
  PdfGenerationService,
  PdfImagesProviderService,
  PdfInputsService,
  PdfMountingToolsService,
  PdfProductQrLinkService,
  PdfRecommendationService,
  PdfResultsService,
} from '@mm/shared/services/pdf';
import { PdfFileSaveService } from '@mm/shared/services/pdf/pdf-file-save.service';
import { ResultDataService } from '@mm/shared/services/result-data.service';
import * as QRCode from 'qrcode';

import { EaEmbeddedService } from '@schaeffler/engineering-apps-behaviors/utils';
import { QR_CODE_LIB, QrCodeService } from '@schaeffler/pdf-generator';
import { ResultReportComponent } from '@schaeffler/result-report';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AdditionalToolsComponent } from './additional-tools/additional-tools.component';
import { GridResultItemCardComponent } from './grid-result-item-card/grid-result-item-card.component';
import { HydraulicOrLockNutComponent } from './hydraulic-or-lock-nut/hydraulic-or-lock-nut.component';
import { MobileDownloadPdfButtonComponent } from './mobile-download-pdf-button/mobile-download-pdf-button.component';
import { MountingRecommendationComponent } from './mounting-recommendation/mounting-recommendation.component';
import { ReportPumpsComponent } from './report-pumps/report-pumps.component';
import { ReportSelectionComponent } from './report-selection/report-selection.component';
import { SleeveConnectorComponent } from './sleeve-connector/sleeve-connector.component';

@Component({
  selector: 'mm-report-result-page',
  templateUrl: './report-result-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedTranslocoModule,
    MatProgressSpinner,
    ResultReportComponent,
    ReportPumpsComponent,
    AdditionalToolsComponent,
    HydraulicOrLockNutComponent,
    MountingRecommendationComponent,
    SleeveConnectorComponent,
    ReportSelectionComponent,
    GridResultItemCardComponent,
    QualtricsInfoBannerComponent,
    MobileDownloadPdfButtonComponent,
    CommonModule,
  ],
  providers: [
    PdfGenerationService,
    PdfInputsService,
    PdfCardFactory,
    PdfMountingToolsService,
    PdfRecommendationService,
    PdfResultsService,
    PdfImagesProviderService,
    PdfProductQrLinkService,

    PdfFileSaveService,
    QrCodeService,
    { provide: QR_CODE_LIB, useValue: QRCode },
  ],
})
export class ReportResultPageComponent {
  private readonly pdfGenerationService = inject(PdfGenerationService);
  private readonly dataService = inject(ResultDataService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);
  private readonly embeddedService = inject(EaEmbeddedService);

  private readonly _isGeneratingPdf = signal(false);
  public isGeneratingPdf = this._isGeneratingPdf.asReadonly();

  public readonly selectedBearing = this.dataService.selectedBearing;

  public readonly inputs = this.dataService.inputs;
  public readonly messages = this.dataService.categorizedMessages;
  public readonly isStandalone = this.embeddedService.isStandalone;

  public readonly mountingRecommendations =
    this.dataService.mountingRecommendations;

  public readonly mountingTools = this.dataService.mountingTools;

  public readonly isResultAvailable = this.dataService.isResultAvailable;

  public readonly hasMountingTools = this.dataService.hasMountingTools;

  public readonly reportSelectionTypes = this.dataService.reportSelectionTypes;

  public startPositions = this.dataService.startPositions;

  public radialClearance = this.dataService.radialClearance;

  public clearanceClasses = this.dataService.clearanceClasses;
  public endPositions = this.dataService.endPositions;

  public sleeveConnectors = this.dataService.sleeveConnectors;
  public readonly pumpsTitle = this.dataService.pumpsTile;
  public readonly pumps = this.dataService.allPumps;

  public readonly temperatures = this.dataService.temperatures;

  public hydraulicNut = computed(() => {
    const mountingTools = this.mountingTools();

    return mountingTools.hydraulicNut;
  });

  public lockNut = computed(() => {
    const mountingTools = this.mountingTools();

    return mountingTools.locknut;
  });

  public additionalTools = this.dataService.additionalTools;

  public importantStartPositions = computed(() =>
    this.startPositions().filter((position) => position.isImportant)
  );

  public nonImportantStartPositions = computed(() =>
    this.startPositions().filter((position) => !position.isImportant)
  );

  public importantEndPositions = computed(() =>
    this.endPositions().filter((position) => position.isImportant)
  );

  public nonImportantEndPositions = computed(() =>
    this.endPositions().filter((position) => !position.isImportant)
  );

  scrollIntoView(itemName: ResultTypeConfig['name']) {
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'start',
    };
    document.querySelector(`#${itemName}`)?.scrollIntoView(scrollOptions);
  }

  public async generatePDF(): Promise<void> {
    try {
      this._isGeneratingPdf.set(true);
      await this.pdfGenerationService.generatePdf();
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showErrorMessage();
    } finally {
      this._isGeneratingPdf.set(false);
    }
  }

  private showErrorMessage() {
    const text = this.translocoService.translate('pdf.generationError');
    const action = this.translocoService.translate('pdf.close');
    this.snackBar.open(text, action);
  }
}
