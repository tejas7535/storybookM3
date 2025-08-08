/* eslint-disable max-lines */
import { inject, Injectable } from '@angular/core';

import { HashMap, TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import {
  GreasePdfConcept1Result,
  GreasePdfInput,
  GreasePdfInputTable,
  GreasePdfMessage,
  GreasePdfMessageItem,
  GreasePdfResult,
  GreasePdfResultItem,
  GreasePdfResultTable,
  GreaseReportSubordinate,
  GreaseReportSubordinateTitle,
  GreaseResult,
  GreaseResultDataItem,
  GreaseResultItem,
} from '../models';
import { ListItemsWrapperService } from './pdf/list-items-wrapper.service';

@Injectable()
export class GreaseReportDataGeneratorService {
  private readonly localeService = inject(TranslocoLocaleService);
  private readonly translocoService = inject(TranslocoService);
  private readonly listItemsWrapperService = inject(ListItemsWrapperService);

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
    greaseResults: GreaseResult[],
    automaticLubrication: boolean
  ): GreasePdfResult {
    const result = this.mapToResultModel(greaseResults, automaticLubrication);

    return result;
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
      const minimumNumberOfItemsToBeWrapped = 4;
      messageItems = greaseReportSubordinate.subordinates.map(
        (sectionItem) => ({
          title: sectionItem.title,
          items: this.listItemsWrapperService.wrapListItems(
            this.extractMessagesFromData(sectionItem.subordinates),
            minimumNumberOfItemsToBeWrapped
          ),
        })
      );
    }

    return {
      sectionTitle: this.getTranslatedTitle('errorsWarningsNotes'),
      messageItems,
    };
  }

  private mapToResultModel(
    greaseResults: GreaseResult[],
    automaticLubrication: boolean
  ): GreasePdfResult {
    let title = '';
    let tableItems: GreasePdfResultTable[] = [];

    if (greaseResults) {
      tableItems = greaseResults.map((result) => ({
        title: result.mainTitle,
        subTitle: result.subTitle ?? '',
        isRecommended: result.isRecommended,

        items: this.extractItemsFromGreaseResultData(result),
        concept1: automaticLubrication
          ? this.extractConcept1Result(result.relubrication.concept1)
          : undefined,
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
    result: GreaseResult
  ): GreasePdfResultItem[] {
    if (!result) {
      return [];
    }

    return [
      ...Object.values(result.initialLubrication),
      ...Object.values(result.performance),
      ...Object.values(result.relubrication).filter(
        (item) => item.title !== 'concept1'
      ),
      ...Object.values(result.greaseSelection),
    ]
      .filter(Boolean)
      .map((item: GreaseResultItem) => {
        const title: string = item.title;

        return {
          itemTitle: this.getTranslatedTitle(title),
          items: this.encodeTextAndSplitOnNewLine(item, title),
        };
      })
      .filter((dataSource) => dataSource !== undefined);
  }

  private extractConcept1Result(
    item: GreaseResultDataItem
  ): GreasePdfConcept1Result | undefined {
    if (!item) {
      return undefined;
    }

    return {
      title: this.getTranslatedTitle('concept1'),
      concept60ml: {
        conceptTitle: this.getTranslatedTitle('concept1settings.concept1Size', {
          size: 60,
        }),
        settingArrow: item.custom?.data?.c1_60
          ? this.getTranslatedTitle('concept1settings.setArrowSetting', {
              setting: item.custom.data.c1_60,
            })
          : '',
        notes: this.getNoteFor60ml(item.custom?.data),
      },
      concept125ml: {
        conceptTitle: this.getTranslatedTitle('concept1settings.concept1Size', {
          size: 125,
        }),
        settingArrow: item.custom?.data?.c1_125
          ? this.getTranslatedTitle('concept1settings.setArrowSetting', {
              setting: item.custom.data.c1_125,
            })
          : '',
        notes: this.getNoteFor125ml(item.custom?.data),
      },
    };
  }

  private getNoteFor60ml(data: any): string {
    if (this.isGreasingSettingNotAvailable(data)) {
      return data.hint;
    }

    return data?.hint_60 ?? '';
  }

  private getNoteFor125ml(data: any): string {
    if (this.isGreasingSettingNotAvailable(data)) {
      return data.hint;
    }

    return data?.hint_125 ?? '';
  }

  private isGreasingSettingNotAvailable(data: any): boolean {
    return !data?.c1_60 && !data?.c1_125;
  }

  private getTranslatedTitle(translationKey: string, params?: HashMap): string {
    return this.translocoService.translate(
      `calculationResult.${translationKey}`,
      params
    );
  }

  private encodeTextAndSplitOnNewLine(
    item: GreaseResultItem,
    dataSourceTitle: string
  ): string[] {
    let result: string[] = [];

    result.push(`${item.prefix || ''} ${item.value} ${item.unit || ''}`.trim());

    if (item.secondaryValue) {
      result.push(
        `${item.secondaryPrefix || ''} ${item.secondaryValue} ${item.secondaryUnit || ''}`.trim()
      );
    }

    if (dataSourceTitle === 'initialGreaseQuantity') {
      result = [result.join('/')];
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
