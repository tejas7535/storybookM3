import { inject, Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import {
  Colors,
  Component,
  HeadingFonts,
  PdfCardComponent,
  PdfComponentFactory,
  PdfLayoutService,
  SectionHeading,
} from '@schaeffler/pdf-generator';

import { GreaseResultCardContent } from '@ga/shared/components/pdf/card-contents/grease-result-card-content';

import { PDFGreaseReportResult } from '../../../models';

@Injectable({ providedIn: 'root' })
export class PdfResultsService {
  private readonly layoutService = inject(PdfLayoutService);
  private readonly pdfComponentFactory = inject(PdfComponentFactory);
  private readonly translocoService = inject(TranslocoService);

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

    const layouts = this.layoutService.createTwoColumnLayouts(greaseCards);

    const heading = new SectionHeading({
      font: HeadingFonts['medium'],
      text: this.getSubheadingText(results),
      underline: false,
      spacing: {
        left: 2,
        top: 1.15,
        right: 2,
        bottom: 0.6,
      },
    });

    return [heading, ...layouts];
  }

  private createCard(content: Component): PdfCardComponent {
    return this.pdfComponentFactory.createSingleComponentCard(content, {
      keepTogether: false,
      padding: 2,
    });
  }

  private getSubheadingText(result: PDFGreaseReportResult[]): string {
    if (this.hasRecommendedValue(result)) {
      return this.translate('resultsWithRecommendation');
    }

    if (this.hasMiscibleOrPreferredValue(result)) {
      return this.translate('resultsWithPreferred');
    }

    return this.translate('resultsDefault');
  }

  private translate(key: string): string {
    return this.translocoService.translate(`calculationResult.${key}`);
  }

  private hasRecommendedValue(results: PDFGreaseReportResult[]): boolean {
    return results.some((item) => item.recommended);
  }

  private hasMiscibleOrPreferredValue(
    results: PDFGreaseReportResult[]
  ): boolean {
    return results.some((item) => item.miscible || item.preferred);
  }
}
