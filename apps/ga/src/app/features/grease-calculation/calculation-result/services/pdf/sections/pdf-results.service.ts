import { inject, Injectable } from '@angular/core';

import {
  Colors,
  Component,
  PdfCardComponent,
  PdfComponentFactory,
  PdfLayoutService,
} from '@schaeffler/pdf-generator';

import { GreaseResultCardContent } from '@ga/shared/components/pdf/card-contents/grease-result-card-content';

import { PDFGreaseReportResult } from '../../../models';

@Injectable({ providedIn: 'root' })
export class PdfResultsService {
  private readonly layoutService = inject(PdfLayoutService);

  private readonly pdfComponentFactory = inject(PdfComponentFactory);

  generateResultsSection(results: PDFGreaseReportResult[]): Component[] {
    const greaseCards: PdfCardComponent[] = [];

    for (const greaseResult of results) {
      const cardContent = new GreaseResultCardContent(greaseResult, {
        backgroundColor: Colors.Surface,
        padding: 0,
        margin: 0,
      });

      const card = this.createCard(cardContent);
      greaseCards.push(card);
    }

    return this.layoutService.createTwoColumnLayouts(greaseCards);
  }

  private createCard(content: Component): PdfCardComponent {
    return this.pdfComponentFactory.createSingleComponentCard(content, {
      keepTogether: false,
      padding: 2,
    });
  }
}
