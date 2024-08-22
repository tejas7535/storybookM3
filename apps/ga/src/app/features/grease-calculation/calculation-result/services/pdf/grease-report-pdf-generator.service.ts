/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { combineLatest } from 'rxjs';
import { take } from 'rxjs/internal/operators/take';
import { map } from 'rxjs/operators';

import { ShareResult } from '@capacitor/share';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
// eslint-disable-next-line import/no-extraneous-dependencies
import jsPDF from 'jspdf';
import autoTable, {
  CellDef,
  CellHook,
  CellInput,
  LineWidths,
  MarginPaddingInput,
  RowInput,
} from 'jspdf-autotable';

import { SettingsFacade } from '@ga/core/store/facades/settings.facade';
import { PartnerVersion } from '@ga/shared/models/settings/partner-version.model';

import {
  GreasePdfConcept1Result,
  GreasePdfMessage,
  GreasePdfReportModel,
  GreasePdfResult,
  GreasePdfResultTable,
} from '../../models';
import { GreaseReportSubordinate } from '../../models/grease-report-subordinate.model';
import { GreaseReportDataGeneratorService } from '../grease-report-data-generator.service';
import { fontFamily, fontSize, fontType } from './fonts.constants';
import { FontsLoaderService } from './fonts-loader.service';
import { GreaseReportPdfFileSaveService } from './grease-report-pdf-file-save.service';
import { ImageLoaderService } from './image-loader.service';
import { getCellHook } from './partner-version-helpers';

@Injectable()
export class GreaseReportPdfGeneratorService {
  private readonly mainGreenColor = '#EDF7F1'; // light green
  private readonly mainGreyColor = '#f2f2f2';
  private readonly secondaryTextColor = '#000000';
  private readonly lowEmphasisTextColor = '#7D7D7D';
  private readonly tableBorderTextColor = '#C9C5C4';

  // document spacing
  private readonly smallLineSpacing = 5;
  private readonly standardLineSpacing = 10;
  private readonly pageMargin = 35;
  private readonly startOfRightTable = 310;
  private readonly endOfLeftTable = 300;
  private readonly tableBorderWidth = 0.3;

  private currentYPosition = 0;

  private readonly yPageContentStartPosition = 85;
  private readonly yPageRegularContentEndPosition = 710;

  private partnerVersion: `${PartnerVersion}`;
  private partnerLogo: string;
  private schaefflerLogo: string;

  private readonly schaefflerLogo$ =
    this.imageLoaderService.schaefflerLogo$.pipe(
      map((logo) => (this.schaefflerLogo = logo)),
      take(1)
    );
  private readonly partnerStaticContent$ = combineLatest([
    this.settingsFacade.partnerVersion$,
    this.imageLoaderService.partnerVersionlogo$,
  ]).pipe(
    map(([partnerVersion, logoImage]) => {
      this.partnerVersion = partnerVersion;
      this.partnerLogo = logoImage;
    }),
    take(1)
  );

  public constructor(
    private readonly dataGeneratorService: GreaseReportDataGeneratorService,
    private readonly translocoLocaleService: TranslocoLocaleService,
    private readonly greaseReportPdfFileSaveService: GreaseReportPdfFileSaveService,
    private readonly fontsLoaderService: FontsLoaderService,
    private readonly settingsFacade: SettingsFacade,
    private readonly imageLoaderService: ImageLoaderService,
    private readonly translocoService: TranslocoService
  ) {
    this.schaefflerLogo$.subscribe();
    this.partnerStaticContent$.subscribe();
  }

  public generateReport(
    report: GreasePdfReportModel
  ): Promise<ShareResult | void> {
    const currentDate = this.translocoLocaleService.localizeDate(new Date());
    const fileName = this.getFileName(report.reportTitle, currentDate);

    this.setCurrentLinePosition(this.standardLineSpacing);
    const doc = new jsPDF({
      unit: 'pt',
    });

    this.fontsLoaderService.loadFonts(doc);
    this.setRegularTextStyle(doc);

    this.setCurrentLinePosition(this.yPageContentStartPosition);

    this.generateInputSection(doc, report.data);

    this.generateResultSection(doc, report);
    this.generateErrorsAndWarningsSection(doc, report.data);

    this.generateHeaderAndFooterSectionsOnEveryPage(doc, report, currentDate);

    return this.greaseReportPdfFileSaveService.saveAndOpenFile(doc, fileName);
  }

  private getFileName(reportTitle: string, date: string): string {
    const partnerPrefix =
      this.partnerVersion === PartnerVersion.Schmeckthal
        ? 'Schmeckthal Gruppe '
        : '';

    return `${partnerPrefix}Grease App ${reportTitle} - ${date}.pdf`;
  }

  private generateHeaderAndFooterSectionsOnEveryPage(
    doc: jsPDF,
    report: GreasePdfReportModel,
    currentDate: string
  ): void {
    const filteredPages = doc.internal.pages.filter(
      (page) => page !== undefined
    ); // for some reason undefined value is returned as a first page.
    const totalPages = filteredPages.length;

    for (let currentPage = 1; currentPage <= totalPages; currentPage += 1) {
      doc.setPage(currentPage);
      this.generatePageHeaderSection(doc, report, currentDate);

      this.generatePageFooterSection(doc, report);
      this.generatePageNumber(doc, currentPage, totalPages);
    }
  }

  private generatePageNumber(
    doc: jsPDF,
    currentPage: number,
    totalPages: number
  ): void {
    const pageNumber = `${currentPage}/${totalPages}`;
    const pageNumberYPosition =
      doc.internal.pageSize.getHeight() - this.standardLineSpacing;

    doc.text(
      pageNumber,
      this.getMaximumPageWidthIncludingMargins(doc),
      pageNumberYPosition
    );
  }

  private generatePageHeaderSection(
    doc: jsPDF,
    report: GreasePdfReportModel,
    currentDate: string
  ): void {
    const width = this.partnerVersion ? 280 : 130;
    const height = this.partnerVersion ? 28 : 16;
    const logoTopMargin = this.pageMargin - this.standardLineSpacing;
    const x = this.pageMargin + 1;
    const y = logoTopMargin + 1;
    const logo = this.partnerVersion ? this.partnerLogo : this.schaefflerLogo;

    this.generateImage(doc, logo, x, y, width, height);

    const titleYPosition = 70;

    doc.setFontSize(fontSize.ReportTitle);
    doc.setFont(fontFamily, fontType.Bold);
    this.printTextLineWithYPosition(doc, report.reportTitle, titleYPosition);

    const subTitleXPosition =
      this.pageMargin +
      this.getElementWidth(doc, report.reportTitle) +
      this.standardLineSpacing;

    this.setRegularTextStyle(doc);
    const subtitleSize =
      doc.internal.pageSize.getWidth() - subTitleXPosition - this.pageMargin;
    const subTitle = this.splitTextToSize(
      doc,
      report.sectionSubTitle,
      subtitleSize
    );
    doc.text(subTitle, subTitleXPosition, titleYPosition);

    const xPositionDateOffset = 18;
    const yPostionDateOffset = 20;

    doc.text(
      currentDate,
      this.getMaximumPageWidthIncludingMargins(doc) - xPositionDateOffset,
      titleYPosition - yPostionDateOffset
    );
  }

  private generateImage(
    doc: jsPDF,
    image: string,
    xPosition: number,
    yPosition: number,
    width: number,
    height: number
  ): void {
    doc.addImage(image, 'png', xPosition, yPosition, width, height);
  }

  private getElementWidth(doc: jsPDF, text: string): number {
    return doc.getStringUnitWidth(text) * doc.getFontSize();
  }

  private generatePageFooterSection(
    doc: jsPDF,
    report: GreasePdfReportModel
  ): void {
    doc.setFontSize(fontSize.disclaimer);
    doc.setFont(fontFamily, fontType.Bold);
    this.printTextLineWithYPosition(
      doc,
      this.dataGeneratorService.getDisclaimerTitle(),
      this.yPageRegularContentEndPosition
    );

    doc.setFont(fontFamily, fontType.Normal);
    const dividedText = this.splitTextToPageSize(doc, report.legalNote);
    this.printDislaimerText(
      dividedText,
      doc,
      this.yPageRegularContentEndPosition
    );
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
      this.printInputTable(index, doc, input.items, input.title);
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
      this.dataGeneratorService.prepareReportResultData(
        report.data,
        report.automaticLubrication
      );
    this.printSectionTitle(data.sectionTitle, doc);

    data.tableItems.forEach((result, index) => {
      if (this.isEven(index) && !this.isFirst(index)) {
        this.addNewPage(doc);
      }
      this.printTableLineSpacing(index, doc);
      const head = this.getMultiLineTableTitles(result.title, result.subTitle);
      const body = this.getMultiLinesDataRowForResult(result);

      const recommendedBadgeText = this.translocoService.translate(
        'calculationResult.recommendedChip'
      );
      const recommendationHook: CellHook = this.partnerVersion
        ? getCellHook(doc, this.schaefflerLogo, true, recommendedBadgeText)
        : getCellHook(doc, undefined, true, recommendedBadgeText);

      const nonRecommendationHook: CellHook = this.partnerVersion
        ? getCellHook(doc, this.schaefflerLogo, false)
        : getCellHook(doc, undefined, false, recommendedBadgeText);

      this.printTwoColumnLayoutTable(
        index,
        doc,
        head,
        body,
        true,
        result.isRecommended ? recommendationHook : nonRecommendationHook
      );
    });

    this.setCurrentLinePosition(
      this.getTableLineStart(doc) + this.standardLineSpacing
    );
  }

  private getMultiLinesDataRowForResult(
    result: GreasePdfResultTable
  ): RowInput[] {
    const resultData: RowInput[] = [];

    if (this.partnerVersion) {
      const poweredBySection: RowInput[] = [
        [
          {
            content: 'powered by ',
            styles: {
              fillColor: this.getMainColor(),
              textColor: this.secondaryTextColor,
              fontStyle: fontType.Normal,
              cellWidth: 140,
            },
            colSpan: 2,
          } as CellDef,
        ],
      ];
      resultData.push(...poweredBySection);
    }

    if (result.concept1) {
      resultData.push(...this.getConcept1DataRow(result.concept1));
    }

    result.items.forEach((item) => {
      resultData.push(...this.getMultiLineDataRowInput(item));
    });

    return resultData;
  }

  private getConcept1DataRow(concept1: GreasePdfConcept1Result): RowInput[] {
    const result: RowInput[] = [
      [
        {
          ...(this.getTableFirstColumnCell(concept1.title) as CellDef),
          colSpan: 2,
        },
      ],
      [
        {
          content: concept1.concept60ml.conceptTitle,
          styles: {
            textColor: this.secondaryTextColor,
            lineWidth: {
              ...this.getConcept1CellBorders(),
              top: this.tableBorderWidth,
            },
          },
        },
        {
          content: concept1.concept125ml.conceptTitle,
          styles: {
            textColor: this.secondaryTextColor,
            lineWidth: {
              ...this.getConcept1CellBorders(),
              top: this.tableBorderWidth,
            },
          },
        },
      ],
      [
        {
          content: concept1.concept60ml.settingArrow,
          styles: {
            fontSize: fontSize.concept1,
            textColor: this.secondaryTextColor,
            lineWidth: this.getConcept1CellBorders(),
          },
        },
        {
          content: concept1.concept125ml.settingArrow,
          styles: {
            fontSize: fontSize.concept1,
            textColor: this.secondaryTextColor,
            lineWidth: this.getConcept1CellBorders(),
          },
        },
      ],
      [
        {
          content: concept1.concept60ml.notes,
          styles: {
            fontSize: fontSize.concept1,
            lineWidth: this.getConcept1CellBorders(),
          },
        },
        {
          content: concept1.concept125ml.notes,
          styles: {
            fontSize: fontSize.concept1,
            lineWidth: this.getConcept1CellBorders(),
          },
        },
      ],
    ];

    return result;
  }

  private getConcept1CellBorders(): Partial<LineWidths> {
    return {
      top: 0,
      bottom: 0,
      right: this.tableBorderWidth,
      left: this.tableBorderWidth,
    };
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
          rowSpan: item.items.length,
          styles: {
            ...(this.getTableFirstColumnCell(item.itemTitle) as CellDef).styles,
            textColor: this.secondaryTextColor,
            cellPadding: this.getCellPaddingForResultTable(),
          },
        },
        {
          content: item.items[0],
          styles: {
            cellPadding: this.getCellPaddingForResultTable(),
          },
        },
      ],
    ];

    if (item.items.length === 2) {
      result.push([
        {
          content: item.items[1],
          styles: {
            textColor: this.lowEmphasisTextColor,
            cellPadding: this.getCellPaddingForResultTable(),
          },
        },
      ]);
    }

    return result;
  }

  private getCellPaddingForResultTable(): MarginPaddingInput {
    return {
      horizontal: 5,
      vertical: 2.5,
    };
  }

  private getMultiLineTableTitles(title: string, subTitle: string): RowInput[] {
    return [
      [this.getTableHeaderRow(title)],
      [
        {
          content: subTitle,
          colSpan: 2,
          styles: {
            fillColor: 'white',
            textColor: this.lowEmphasisTextColor,
            fontStyle: fontType.Normal,
            lineColor: this.tableBorderTextColor,
            lineWidth: {
              left: this.tableBorderWidth,
              right: this.tableBorderWidth,
              bottom: this.tableBorderWidth,
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
    this.addNewPage(doc);
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
      doc.setFont(fontFamily, fontType.Bold);
      doc.setFontSize(fontSize.sectionTitle);

      this.printTextLine(doc, title);
      this.setRegularTextStyle(doc);
    }
  }

  private printSubTitle(subTitle: string, doc: jsPDF): void {
    doc.setFont(fontFamily, fontType.Bold);
    this.printTextLine(doc, subTitle);
    this.setRegularTextStyle(doc);
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
      this.updateCurrentLineWithCurrentYPostionAndStandardSpacing(doc);
      this.printTextLine(doc, text);
    });
  }

  private printDislaimerText(
    textLines: string[],
    doc: jsPDF,
    yLinePosition: number
  ): void {
    let yPosition = yLinePosition;
    textLines.forEach((text) => {
      this.printTextLineWithYPosition(
        doc,
        text,
        (yPosition += this.standardLineSpacing)
      );
    });
  }

  private printTableLineSpacing(index: number, doc: jsPDF): void {
    if (this.isFirst(index)) {
      this.setCurrentLinePosition(this.getCurrentLinePosition(doc));
    }

    if (this.isEven(index) && !this.isFirst(index)) {
      this.setCurrentLinePosition(this.getTableLineStart(doc));
    }
  }

  private printTextLine(doc: jsPDF, text: string): void {
    this.printTextLineWithYPosition(
      doc,
      text,
      this.getCurrentLinePosition(doc)
    );
  }

  private printTextLineWithYPosition(
    doc: jsPDF,
    text: string,
    yLinePosition: number
  ): void {
    doc.text(text, this.pageMargin, yLinePosition);
  }

  private setRegularTextStyle(doc: jsPDF): void {
    doc.setFontSize(fontSize.text);
    doc.setFont(fontFamily, fontType.Normal);
  }

  private printInputTable(
    index: number,
    doc: jsPDF,
    bodyData: string[][],
    tableTitle: string
  ): void {
    const tableRows: RowInput[] = [];

    bodyData.forEach((row) => {
      tableRows.push(...this.getInputTableDataRows(row));
    });

    const didDrawCell: CellHook = undefined;

    this.printTwoColumnLayoutTable(
      index,
      doc,
      [[this.getTableHeaderRow(tableTitle)]],
      tableRows,
      true,
      didDrawCell
    );
  }

  private getInputTableDataRows(row: string[]): RowInput[] {
    const result: RowInput[] = [
      [
        this.getTableFirstColumnCell(row[0]),
        {
          content: row[1],
        },
      ],
    ];

    return result;
  }

  private getTableFirstColumnCell(value: string): CellInput {
    return {
      content: value,
      styles: {
        fillColor: this.getMainColor(),
        textColor: this.secondaryTextColor,
        fontStyle: fontType.Normal,
        cellWidth: 140,
      },
    };
  }

  private getTableHeaderRow(tableTitle: string): CellInput {
    return {
      title: 'title',
      content: tableTitle,
      colSpan: 2,
      styles: {
        fillColor: 'white',
        textColor: this.secondaryTextColor,
        fontStyle: fontType.Bold,
        lineColor: this.tableBorderTextColor,
        lineWidth: {
          top: this.tableBorderWidth,
          left: this.tableBorderWidth,
          right: this.tableBorderWidth,
          bottom: 0,
        },
      },
    };
  }

  private printTwoColumnLayoutTable(
    index: number,
    doc: jsPDF,
    head: RowInput[],
    body: RowInput[],
    showHead = false,
    didDrawCell: CellHook
  ): void {
    const yPosition =
      this.getCurrentLinePosition(doc) + this.standardLineSpacing;
    const marginValue = this.getTableMarginBasedOnIndex(index);
    this.generateTable(
      doc,
      yPosition,
      head,
      body,
      marginValue,
      showHead,
      didDrawCell
    );
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
        right: this.startOfRightTable,
      };
    }

    return {
      left: this.endOfLeftTable,
    };
  }

  private generateTable(
    doc: jsPDF,
    yLinePosition: number,
    head: RowInput[],
    body: RowInput[],
    margin: MarginPaddingInput,
    showHead = false,
    didDrawCell: CellHook
  ): void {
    autoTable(doc, {
      theme: 'grid',
      startY: yLinePosition,
      styles: {
        overflow: 'linebreak',
        fontSize: fontSize.text,
        font: fontFamily,
      },
      showHead,
      head,
      body,
      margin,
      didDrawCell,
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

  private setCurrentLinePosition(yLinePosition: number): void {
    this.currentYPosition = yLinePosition;
  }

  private getCurrentLinePosition(doc: jsPDF): number {
    if (this.shouldCreateNewPage()) {
      this.addNewPage(doc);
    }

    return this.currentYPosition;
  }

  private shouldCreateNewPage(): boolean {
    return (
      this.currentYPosition + this.smallLineSpacing * 2 >=
      this.yPageRegularContentEndPosition
    );
  }

  private addNewPage(doc: jsPDF) {
    doc.addPage();
    this.setCurrentLinePosition(this.yPageContentStartPosition);
    if ((doc as any).lastAutoTable) {
      (doc as any).lastAutoTable.finalY = undefined;
    }
  }

  private splitTextToPageSize(doc: jsPDF, text: string): string[] {
    return this.splitTextToSize(
      doc,
      text,
      this.getMaximumPageWidthIncludingMargins(doc)
    );
  }

  private splitTextToSize(doc: jsPDF, text: string, size: number): string[] {
    return doc.splitTextToSize(text, size);
  }

  private getMaximumPageWidthIncludingMargins(doc: jsPDF): number {
    return doc.internal.pageSize.getWidth() - 2 * this.pageMargin;
  }

  private getMainColor(): string {
    return this.partnerVersion === PartnerVersion.Schmeckthal
      ? this.mainGreyColor
      : this.mainGreenColor;
  }
}
