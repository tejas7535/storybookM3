/* eslint-disable @typescript-eslint/member-ordering */
import { computed, inject, Injectable } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { switchMap } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import {
  Colors,
  ConditionalPageBreak,
  ControlCommands,
  DisclaimerFooter,
  FontConfig,
  FontResolverService,
  PDFDocument,
  PDFHeader,
} from '@schaeffler/pdf-generator';

import { ResultDataService } from '../result-data.service';
import { PdfFileSaveService } from './pdf-file-save.service';
import { PdfImagesProviderService } from './pdf-images-provider.service';
import { PdfProductQrLinkService } from './pdf-product-qr-link.service';
import { PdfInputsService } from './sections/pdf-inputs.service';
import { PdfMountingToolsService } from './sections/pdf-mounting-tools.service';
import { PdfRecommendationService } from './sections/pdf-recommendation.service';
import { PdfResultsService } from './sections/pdf-results.service';

@Injectable()
export class PdfGenerationService {
  private readonly fontResolver = inject(FontResolverService);
  private readonly dataService = inject(ResultDataService);
  private readonly imagesProviderService = inject(PdfImagesProviderService);
  private readonly productQrLinkService = inject(PdfProductQrLinkService);

  private readonly inputsService = inject(PdfInputsService);
  private readonly mountingToolsService = inject(PdfMountingToolsService);
  private readonly recommendationService = inject(PdfRecommendationService);
  private readonly resultsService = inject(PdfResultsService);
  private readonly pdfFileSaveService = inject(PdfFileSaveService);

  private readonly translocoService = inject(TranslocoService);
  private readonly languageChanges = toSignal(
    this.translocoService.langChanges$,
    {
      initialValue: this.translocoService.getActiveLang(),
    }
  );

  readonly activeLang = computed(
    () => this.languageChanges() ?? this.translocoService.getActiveLang()
  );

  private readonly activeLang$ = toObservable(this.activeLang);

  readonly fonts = toSignal(
    this.activeLang$.pipe(
      switchMap((lang) => this.fontResolver.fetchForLocale(lang))
    ),
    { initialValue: [] as FontConfig[] }
  );

  public async generatePdf(): Promise<void> {
    const fonts = this.fonts();

    await Promise.all([
      this.imagesProviderService.getImages(),
      this.productQrLinkService.preloadProductQrCodes(),
    ]);

    const reportTitle = this.getReportTitle();

    const minSpaceForNewSectionWithTite = 100;

    const doc = new PDFDocument()
      .addFont(...fonts)
      .setTextColor(Colors.DarkGreyVariant)
      .setPageMargin({ left: 7, right: 7, top: 6, bottom: 10 })
      .setDebug(false)
      .addFooter(this.getPdfFooter())
      .addHeader(this.getPdfHeader(reportTitle))
      .setComponentSpacing(3)
      .addComponent(...this.inputsService.getInputsSection())
      .addComponent(new ConditionalPageBreak(minSpaceForNewSectionWithTite))
      .addComponent(...this.resultsService.getHeading())
      .addComponent(...this.resultsService.getRadialClearanceSection())
      .addComponent(...this.resultsService.getStartEndPositionsSection())
      .addComponent(...this.mountingToolsService.getHeading())
      .addComponent(...this.mountingToolsService.getLockNutSection())
      .addComponent(...this.mountingToolsService.getAdditionalToolsSection())
      .addComponent(...this.mountingToolsService.getRecommendedPumpSection())
      .addComponent(...this.mountingToolsService.getAlternativePumpsSection())
      .addComponent(...this.mountingToolsService.getSleeveConnectorSection())
      .addComponent(ControlCommands.PageBreak)
      .addComponent(...this.recommendationService.getInstructionsHeading())
      .addComponent(
        ...this.recommendationService.getMountingRecommendationSection()
      )
      .addComponent(...this.recommendationService.getReportMessagesHeading())
      .addComponent(...this.recommendationService.getReportMessagesSection());
    doc.generate();

    const reportDate = new Intl.DateTimeFormat(
      this.translocoService.getActiveLang()
    ).format(Date.now());

    const fileName = `${reportTitle} - ${reportDate}.pdf`;

    this.pdfFileSaveService.saveAndOpenFile(doc, fileName);
  }

  private getReportTitle(): string {
    return this.translocoService.translate('pdf.title', {
      designation: this.dataService.selectedBearing(),
    });
  }

  private getPdfHeader(reportTitle: string): PDFHeader {
    return new PDFHeader({
      reportTitle,
      heading: reportTitle,
      date: {
        dateLocale: this.translocoService.getActiveLang(),
      },
    });
  }

  private getPdfFooter(): DisclaimerFooter {
    return new DisclaimerFooter({
      disclaimerText: this.translocoService.translate('pdf.disclaimer'),
    });
  }
}
