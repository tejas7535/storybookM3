import { CalculationResultReportInput } from '@ea/core/store/models';
import jsPDF from 'jspdf';

import { renderCalculationMethods } from './components/calculation-methods';
import { renderNotices } from './components/calculation-notices';
import { generateFooter } from './components/footer';
import { generateHeader } from './components/header';
import { renderInputTable } from './components/input-table';
import { renderResultGrid } from './components/result-grid';
import { renderUpstreamResult } from './components/upstream-result';
import {
  DefaultComponentRenderProps,
  DocumentData,
  GeneratedDocument,
  ResultReport,
} from './data';
import { loadNotoSansFonts, resetFontStyle } from './util';
export class PDFREport {
  private readonly blockSpacing =
    DefaultComponentRenderProps.dimensions.blockSpacing;
  private yPosition = DefaultComponentRenderProps.dimensions.pageMargin;
  private currentPage = 1;
  private readonly originalYPosition = this.yPosition;

  constructor(
    private readonly docSettings: DocumentData,
    private readonly data: ResultReport
  ) {}

  async generate(): Promise<GeneratedDocument> {
    const doc = new jsPDF({ unit: 'pt' });
    loadNotoSansFonts(doc);
    resetFontStyle(doc);
    const footerHeight = generateFooter(
      doc,
      this.currentPage,
      this.docSettings
    );

    this.yPosition += generateHeader(doc, this.docSettings) + this.blockSpacing;
    this.yPosition +=
      renderCalculationMethods(
        doc,
        this.data.calculationMethods,
        this.yPosition,
        this.docSettings
      ) + this.blockSpacing;

    if (this.data.calculationInput) {
      this.renderInputTables(doc, this.data.calculationInput);
      this.addPage(doc);
    }

    const resultGridKeys = new Set([
      'lubricationInfo',
      'upstreamEmissions',
      'frictionalPowerloss',
      'overrollingFrequency',
      'ratingLife',
    ]);

    Object.entries(this.data)
      .filter(([key]) => resultGridKeys.has(key))
      .forEach(([key, value]) => {
        let shift = 0;
        shift =
          key !== 'upstreamEmissions'
            ? renderResultGrid(
                doc,
                value,
                DefaultComponentRenderProps.dimensions.pageMargin,
                this.yPosition
              ) + this.blockSpacing
            : renderUpstreamResult(
                doc,
                value,
                DefaultComponentRenderProps.dimensions.pageMargin,
                this.yPosition,
                this.docSettings
              ) + this.blockSpacing;
        this.yPosition += shift;

        if (this.yPosition > doc.internal.pageSize.getHeight() / 2) {
          this.addPage(doc);
        }
      });

    this.yPosition += this.blockSpacing;
    if (this.data.notices) {
      const estimatedNoticeHeight = renderNotices(
        doc,
        this.data.notices,
        this.yPosition,
        true,
        this.docSettings
      );

      if (
        doc.internal.pageSize.getHeight() - this.yPosition - footerHeight <
        estimatedNoticeHeight + this.blockSpacing
      ) {
        this.addPage(doc);
      }
      renderNotices(
        doc,
        this.data.notices,
        this.yPosition,
        false,
        this.docSettings
      );
    }

    return {
      designation: this.data.designation,
      document: doc,
    };
  }

  private addPage(doc: jsPDF) {
    doc.addPage();
    this.currentPage += 1;
    this.yPosition = this.originalYPosition;
    generateFooter(doc, this.currentPage, this.docSettings);
    this.yPosition += generateHeader(doc, this.docSettings) + this.blockSpacing;
  }

  private renderInputTables(doc: jsPDF, input: CalculationResultReportInput[]) {
    let y = this.yPosition;
    let heights: number[] = [];
    const width = doc.internal.pageSize.getWidth() / 2 - 2 * this.blockSpacing;
    const leftX = DefaultComponentRenderProps.dimensions.pageMargin;
    const rightX = leftX + width + this.blockSpacing;
    input.forEach((item, i) => {
      const x = i % 2 !== 0 ? rightX : leftX;
      const height = renderInputTable(doc, item.subItems, y, x, width, {
        header: item.title,
      });
      heights.push(height);
      if (heights.length === 2) {
        y = y + Math.max(...heights) + 0.7 * this.blockSpacing;
        heights = [];
      }
    });
  }
}
