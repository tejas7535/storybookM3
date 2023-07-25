/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

// eslint-disable-next-line import/no-extraneous-dependencies
import jsPDF from 'jspdf';
// eslint-disable-next-line import/no-extraneous-dependencies
import autoTable, { MarginPaddingInput, RowInput } from 'jspdf-autotable';

import {
  GreasePdfMessage,
  GreasePdfReportModel,
  GreasePdfResult,
  GreasePdfResultTable,
} from '../models';
import { GreaseReportSubordinate } from '../models/grease-report-subordinate.model';
import { GreaseReportDataGeneratorService } from './grease-report-data-generator.service';

@Injectable()
export class GreaseReportPdfGeneratorService {
  public readonly fontFamily = 'Times';
  public readonly fontStyle = 'Roman';
  private readonly mainGreenColor = '#EDF7F1'; // light green
  private readonly secondaryTextColor = '#000000';
  private readonly lowEmphasisTextColor = '#7D7D7D';
  private readonly tableBorderTextColor = '#C9C5C4';

  // fonts sizes
  private readonly sectionTitleFontSize = 18;
  private readonly sectionSubTitleFontSize = 16;
  private readonly textFontSize = 12;

  // document spacing
  private readonly smallLineSpacing = 5;
  private readonly standardLineSpacing = 10;
  private readonly pageMargin = 10;
  private readonly startOfRightTable = 110;
  private readonly endOfLeftTable = 107;

  private readonly fileName = 'greaseReport.pdf';

  private currentYPosition = 0;

  public constructor(
    private readonly dataGeneratorService: GreaseReportDataGeneratorService
  ) {}

  public generateReport(report: GreasePdfReportModel): Promise<void> {
    this.setCurrentLinePosition(this.standardLineSpacing);
    const doc = new jsPDF();
    doc.setFont(this.fontFamily, this.fontStyle);
    doc.setFontSize(this.textFontSize);

    this.printSectionTitle(report.reportTitle, doc);
    this.updateCurrentLineWithCurrentYPostionAndStandardSpacing(doc);

    this.generateDisclaimerSection(doc, report.legalNote);
    this.generateInputSection(doc, report.data);
    this.generateResultSection(doc, report);
    this.generateErrorsAndWarningsSection(doc, report.data);

    return doc.save(this.fileName, { returnPromise: true });
  }

  private generateDisclaimerSection(doc: jsPDF, legalNote: string): void {
    this.printSectionTitle(this.dataGeneratorService.getDisclaimerTitle(), doc);
    this.updateCurrentLineWithCurrentYPostionAndSmallSpacing(doc);

    const dividedText = this.splitTextToPageSize(doc, legalNote);
    this.printMultipleLines(dividedText, doc);
  }

  private generateInputSection(
    doc: jsPDF,
    greaseReportData: GreaseReportSubordinate[]
  ): void {
    this.updateCurrentLineWithCurrentYPostionAndStandardSpacing(doc);
    const data =
      this.dataGeneratorService.prepareReportInputData(greaseReportData);
    this.printSectionTitle(data.sectionTitle, doc);

    data.tableItems.forEach((input, index) => {
      this.printTableLineSpacing(index, doc);
      this.printTableTitle(input.title, index, doc);
      this.printInputTable(index, doc, input.items);
    });

    this.setCurrentLinePosition(
      this.getTableLineStart(doc) + this.standardLineSpacing
    );
  }

  private generateResultSection(
    doc: jsPDF,
    report: GreasePdfReportModel
  ): void {
    this.addNewPage(doc);
    const data: GreasePdfResult =
      this.dataGeneratorService.prepareReportResultData(report.data);

    this.printSectionTitle(data.sectionTitle, doc);

    data.tableItems.forEach((result, index) => {
      if (this.isEven(index) && !this.isFirst(index)) {
        this.addNewPage(doc);
      }
      this.printTableLineSpacing(index, doc);
      const head = this.getMultiLineTableTitles(result.title, result.subTitle);
      const body = this.getMultiLinesDataRowForResult(result);

      this.printTwoColumnLayoutTable(index, doc, head, body, true);
    });

    this.setCurrentLinePosition(
      this.getTableLineStart(doc) + this.standardLineSpacing
    );
  }

  private getMultiLinesDataRowForResult(
    result: GreasePdfResultTable
  ): RowInput[] {
    const resultData: RowInput[] = [];

    result.items.forEach((item) => {
      resultData.push(...this.getMultiLineDataRowInput(item));
    });

    return resultData;
  }

  private getMultiLineDataRowInput(item: {
    itemTitle: string;
    items: string[];
  }): RowInput[] {
    if (!item.items || item.items.length > 2) {
      return [];
    }

    const result: RowInput[] = [
      [
        {
          content: item.itemTitle,
          styles: {
            fillColor: this.mainGreenColor,
            textColor: this.secondaryTextColor,
            fontStyle: 'normal',
            cellWidth: 50,
          },
          rowSpan: item.items.length,
        },
        {
          content: item.items[0],
        },
      ],
    ];

    if (item.items.length === 2) {
      result.push([
        {
          content: item.items[1],
          styles: {
            textColor: this.lowEmphasisTextColor,
          },
        },
      ]);
    }

    return result;
  }

  private getMultiLineTableTitles(title: string, subTitle: string): RowInput[] {
    return [
      [
        {
          title: 'title',
          content: title,
          colSpan: 2,
          styles: {
            fillColor: 'white',
            textColor: this.secondaryTextColor,
            fontStyle: 'normal',
            lineColor: this.tableBorderTextColor,
            lineWidth: {
              top: 0.3,
              left: 0.3,
              right: 0.3,
              bottom: 0,
            },
          },
        },
      ],
      [
        {
          content: subTitle,
          colSpan: 2,
          styles: {
            fillColor: 'white',
            textColor: this.lowEmphasisTextColor,
            fontStyle: 'normal',
            lineColor: this.tableBorderTextColor,
            lineWidth: {
              left: 0.3,
              right: 0.3,
              bottom: 0.3,
            },
          },
        },
      ],
    ];
  }

  private generateErrorsAndWarningsSection(
    doc: jsPDF,
    greaseReportData: GreaseReportSubordinate[]
  ): void {
    const data: GreasePdfMessage =
      this.dataGeneratorService.prepareReportErrorsAndWarningsData(
        greaseReportData
      );

    this.printSectionTitle(data.sectionTitle, doc);

    data.messageItems.forEach((message) => {
      this.updateCurrentLineWithCurrentYPostionAndStandardSpacing(doc);
      this.printSubTitle(message.title, doc);
      this.formatAndPrintMultipleTextLines(message.items, doc);
    });
  }

  private printSectionTitle(title: string, doc: jsPDF): void {
    if (title) {
      doc.setFontSize(this.sectionTitleFontSize);
      const finalY = this.getCurrentLinePosition(doc);

      doc.text(title, doc.internal.pageSize.getWidth() / 2, finalY, {
        align: 'center',
      });
      doc.setFontSize(this.textFontSize);
    }
  }

  private printSubTitle(subTitle: string, doc: jsPDF): void {
    doc.setFontSize(this.sectionSubTitleFontSize);
    this.printTextLine(doc, subTitle);
    doc.setFontSize(this.textFontSize);
  }

  private formatAndPrintMultipleTextLines(
    textLines: string[],
    doc: jsPDF
  ): void {
    if (textLines) {
      textLines.forEach((text) => {
        const longTextLines = this.splitTextToPageSize(doc, text);
        this.printMultipleLines(longTextLines, doc);
      });
    }
  }

  private printMultipleLines(textLines: string[], doc: jsPDF): void {
    textLines.forEach((text) => {
      this.updateCurrentLineWithCurrentYPostionAndSmallSpacing(doc);
      this.printTextLine(doc, text);
    });
  }

  private printTableLineSpacing(index: number, doc: jsPDF): void {
    if (this.isFirst(index)) {
      this.setCurrentLinePosition(
        this.getCurrentLinePosition(doc) + this.standardLineSpacing
      );
    }

    if (this.isEven(index) && !this.isFirst(index)) {
      this.setCurrentLinePosition(
        this.getTableLineStart(doc) + this.standardLineSpacing
      );
    }
  }

  private printTextLine(doc: jsPDF, text: string): void {
    doc.text(text, this.pageMargin, this.getCurrentLinePosition(doc));
  }

  private printTableTitle(title: string, index: number, doc: jsPDF): void {
    const xLinePosition = this.isEven(index)
      ? this.pageMargin + this.smallLineSpacing
      : this.startOfRightTable;

    doc.text(title, xLinePosition, this.getCurrentLinePosition(doc));
  }

  private printInputTable(
    index: number,
    doc: jsPDF,
    bodyData: string[][]
  ): void {
    this.printTwoColumnLayoutTable(
      index,
      doc,
      [
        {
          title: 'Title',
          value: 'Value',
        },
      ],
      bodyData
    );
  }

  private printTwoColumnLayoutTable(
    index: number,
    doc: jsPDF,
    head: RowInput[],
    body: RowInput[],
    showHead = false
  ): void {
    const yPosition = this.getCurrentLinePosition(doc) + this.smallLineSpacing;
    const marginValue = this.getTableMarginBasedOnIndex(index);
    this.generateTable(doc, yPosition, head, body, marginValue, showHead);
  }

  private isEven(index: number): boolean {
    return index % 2 === 0;
  }

  private isFirst(index: number): boolean {
    return index === 0;
  }

  private getTableMarginBasedOnIndex(index: number): MarginPaddingInput {
    if (this.isEven(index)) {
      return {
        right: this.endOfLeftTable,
      };
    }

    return {
      left: this.startOfRightTable,
    };
  }

  private generateTable(
    doc: jsPDF,
    yLinePosition: number,
    head: RowInput[],
    body: RowInput[],
    margin: MarginPaddingInput,
    showHead = false
  ): void {
    autoTable(doc, {
      theme: 'grid',
      startY: yLinePosition,
      styles: { overflow: 'linebreak' },
      showHead,
      head,
      body,
      columnStyles: {
        title: {
          fillColor: this.mainGreenColor,
          textColor: this.secondaryTextColor,
          fontStyle: 'normal',
        },
      },
      margin,
    });
  }

  private getTableLineStart(doc: jsPDF): number {
    return (
      (doc as any).lastAutoTable.finalY || this.getCurrentLinePosition(doc)
    );
  }

  private updateCurrentLineWithCurrentYPostionAndStandardSpacing(
    doc: jsPDF
  ): void {
    this.setCurrentLinePosition(
      this.getCurrentLinePosition(doc) + this.standardLineSpacing
    );
  }

  private updateCurrentLineWithCurrentYPostionAndSmallSpacing(
    doc: jsPDF
  ): void {
    this.setCurrentLinePosition(
      this.getCurrentLinePosition(doc) + this.smallLineSpacing
    );
  }

  private setCurrentLinePosition(yLinePosition: number): void {
    this.currentYPosition = yLinePosition;
  }

  private getCurrentLinePosition(doc: jsPDF): number {
    if (this.shouldCreateNewPage(doc)) {
      this.addNewPage(doc);
    }

    return this.currentYPosition;
  }

  private shouldCreateNewPage(doc: jsPDF): boolean {
    return (
      this.currentYPosition + this.pageMargin * 2 >=
      doc.internal.pageSize.getHeight()
    );
  }

  private addNewPage(doc: jsPDF) {
    doc.addPage();
    this.setCurrentLinePosition(this.pageMargin);
    if ((doc as any).lastAutoTable) {
      (doc as any).lastAutoTable.finalY = undefined;
    }
  }

  private splitTextToPageSize(doc: jsPDF, text: string): string[] {
    return doc.splitTextToSize(
      text,
      this.getMaximumPageWidthIncludingMargins(doc)
    );
  }

  private getMaximumPageWidthIncludingMargins(doc: jsPDF): number {
    return doc.internal.pageSize.getWidth() - 2 * this.pageMargin;
  }
}
