import { Injectable } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { DocumentData, ResultReport } from './data';

@Injectable({ providedIn: 'root' })
export class PDFDocumentSettingsService {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly localeService: TranslocoLocaleService
  ) {}

  generateDocumentSettings(data: ResultReport): DocumentData {
    const documentSettings: DocumentData = {
      page: this.translocoService.translate('pdfReport.page'),
      reportHeading: this.translocoService.translate(
        'pdfReport.reportHeading',
        { bearingDesignation: data.designation }
      ),
      generationDate: this.localeService.localizeDate(Date.now()),
      documentDisclaimer: this.translocoService.translate(
        'pdfReport.disclaimer'
      ),
      calculationMethodsHeading: this.translocoService.translate(
        'pdfReport.selectedMethods'
      ),
      inputSectionHeading: this.translocoService.translate(
        'pdfReport.inputHeading'
      ),
      co2disclaimer: this.translocoService.translate(
        'calculationResultReport.co2Emissions.upstreamHint'
      ),
      noticeHeading: this.translocoService.translate(
        'calculationResultReport.reportSectionWarnings'
      ),
      bearingLink: {
        text: this.translocoService.translate(
          'pdfReport.mediasBearingLink.text'
        ),
        link: this.translocoService.translate(
          'pdfReport.mediasBearingLink.link',
          { bearingDesignation: data.designation }
        ),
      },
    };

    return documentSettings;
  }
}
