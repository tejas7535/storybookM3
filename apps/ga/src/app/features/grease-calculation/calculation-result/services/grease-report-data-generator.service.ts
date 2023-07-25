import { Injectable } from '@angular/core';

import { HashMap, TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import {
  GreasePdfInput,
  GreasePdfInputTable,
  GreasePdfMessage,
  GreasePdfMessageItem,
  GreasePdfResult,
  GreasePdfResultItem,
  GreasePdfResultTable,
  GreaseReportSubordinate,
  GreaseReportSubordinateTitle,
  GreaseResultData,
} from '../models';

@Injectable()
export class GreaseReportDataGeneratorService {
  public constructor(
    private readonly localeService: TranslocoLocaleService,
    private readonly translocoService: TranslocoService
  ) {}

  public getDisclaimerTitle(): string {
    return this.translocoService.translate(`legal.disclaimer`);
  }

  public prepareReportInputData(
    greaseReportData: GreaseReportSubordinate[]
  ): GreasePdfInput {
    const greaseReportSubordinate: GreaseReportSubordinate =
      this.getInputData(greaseReportData);

    return this.mapToTableModel(greaseReportSubordinate);
  }

  public prepareReportResultData(
    greaseReportData: GreaseReportSubordinate[]
  ): GreasePdfResult {
    const greaseReportSubordinate: GreaseReportSubordinate =
      this.getResultData(greaseReportData);

    return this.mapToResultModel(greaseReportSubordinate);
  }

  public prepareReportErrorsAndWarningsData(
    greaseReportData: GreaseReportSubordinate[]
  ): GreasePdfMessage {
    const greaseReportSubordinate: GreaseReportSubordinate =
      this.getErrorsAndWarningData(greaseReportData);

    return this.mapErrorsAndWarningDataToModel(greaseReportSubordinate);
  }

  private mapErrorsAndWarningDataToModel(
    greaseReportSubordinate: GreaseReportSubordinate
  ): GreasePdfMessage {
    let messageItems: GreasePdfMessageItem[] = [];
    if (greaseReportSubordinate) {
      messageItems = greaseReportSubordinate.subordinates.map(
        (sectionItem) => ({
          title: sectionItem.title,
          items: this.extractMessagesFromData(sectionItem.subordinates),
        })
      );
    }

    return {
      sectionTitle: this.getTranslatedTitle('errorsWarningsNotes'),
      messageItems,
    };
  }

  private mapToResultModel(
    greaseReportSubordinate: GreaseReportSubordinate
  ): GreasePdfResult {
    let title = '';
    let tableItems: GreasePdfResultTable[] = [];

    if (greaseReportSubordinate) {
      tableItems = greaseReportSubordinate.subordinates.map((item) => ({
        title: item.greaseResult.mainTitle,
        subTitle: item.greaseResult?.subTitle ?? '',
        items: this.extractItemsFromGreaseResultData(
          item.greaseResult?.dataSource
        ),
      }));

      title = this.getTranslatedTitle('resultsDefault', {
        amount: tableItems.length,
        complete: tableItems.length,
      });
    }

    return {
      sectionTitle: title,
      tableItems,
    };
  }

  private extractItemsFromGreaseResultData(
    data: GreaseResultData
  ): GreasePdfResultItem[] {
    if (!data) {
      return [];
    }

    return data
      .map((dataSource) => {
        let returnItem;

        if (dataSource && 'values' in dataSource) {
          return {
            itemTitle: this.getTranslatedTitle(dataSource.title),
            items: this.encodeTextAndSplitOnNewLine(dataSource.values),
          };
        }

        // case where data contains custom value, to be extended in later stage
        return returnItem;
      })
      .filter((dataSource) => dataSource !== undefined);
  }

  private getTranslatedTitle(translationKey: string, params?: HashMap): string {
    return this.translocoService.translate(
      `calculationResult.${translationKey}`,
      params
    );
  }

  private encodeTextAndSplitOnNewLine(
    dataSourceValueWithHtml: string | undefined
  ): string[] {
    const regex = /(<([^>]+)>)/gi;
    const result: string[] = [];

    if (dataSourceValueWithHtml) {
      dataSourceValueWithHtml.split('<br>').forEach((value) => {
        result.push(value.replace(regex, ''));
      });
    }

    return result;
  }

  private extractMessagesFromData(
    subItems: GreaseReportSubordinate[]
  ): string[] {
    let result: string[] = [];

    subItems.forEach((item) => {
      if (item.identifier === 'text') {
        result = [...result, ...item.text];
      }

      if (item.identifier === 'block') {
        result = [
          ...result,
          ...this.extractMessagesFromData(item.subordinates),
        ];
      }
    });

    return result;
  }

  private mapToTableModel(
    greaseSubordinate: GreaseReportSubordinate
  ): GreasePdfInput | undefined {
    let tableItems: GreasePdfInputTable[] = [];

    if (greaseSubordinate) {
      tableItems = greaseSubordinate.subordinates.map((input) => ({
        title: input.title,
        items: this.mapInputSubordinatesToTableRow(input.subordinates),
      }));
    }

    return {
      sectionTitle: this.getTranslatedTitle('reportSectionInput'),
      tableItems,
    };
  }

  private mapInputSubordinatesToTableRow(
    subOrdinates: GreaseReportSubordinate[]
  ): string[][] {
    return subOrdinates.map((subOrdinate) => [
      this.getLabel(subOrdinate),
      this.getValue(subOrdinate),
    ]);
  }

  private readonly getLabel = (subordinate?: GreaseReportSubordinate): string =>
    `${subordinate?.designation || ''} ${this.getLabelAbbreviation(
      subordinate
    )}`;

  private readonly getValue = (
    subordinate?: GreaseReportSubordinate
  ): string => {
    const unit = this.getUnit(subordinate);

    return unit
      ? `${this.localeService.localizeNumber(
          subordinate?.value || '',
          'decimal'
        )} ${unit}`
      : subordinate?.value || '';
  };

  private readonly getUnit = (subordinate?: GreaseReportSubordinate): string =>
    subordinate?.unit || '';

  private readonly getLabelAbbreviation = (
    subordinate?: GreaseReportSubordinate
  ): string =>
    subordinate?.abbreviation ? `(${subordinate?.abbreviation})` : '';

  private getInputData(
    greaseReportData: GreaseReportSubordinate[]
  ): GreaseReportSubordinate | undefined {
    return this.findDataByTitleId(
      greaseReportData,
      GreaseReportSubordinateTitle.STRING_OUTP_INPUT
    );
  }

  private getResultData(
    greaseReportData: GreaseReportSubordinate[]
  ): GreaseReportSubordinate | undefined {
    return this.findDataByTitleId(
      greaseReportData,
      GreaseReportSubordinateTitle.STRING_OUTP_RESULTS
    );
  }

  private getErrorsAndWarningData(
    greaseReportData: GreaseReportSubordinate[]
  ): GreaseReportSubordinate | undefined {
    return this.findDataByTitleId(greaseReportData);
  }

  private findDataByTitleId(
    reportData: GreaseReportSubordinate[],
    titleId?: string | undefined
  ): GreaseReportSubordinate | undefined {
    return reportData.find((subordinate) => subordinate.titleID === titleId);
  }
}
