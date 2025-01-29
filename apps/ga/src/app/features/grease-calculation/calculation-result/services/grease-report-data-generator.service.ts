/* eslint max-lines: [1] */
import { Injectable } from '@angular/core';

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
  GreaseResultData,
} from '../models';
import { ListItemsWrapperService } from './pdf/list-items-wrapper.service';

@Injectable()
export class GreaseReportDataGeneratorService {
  public constructor(
    private readonly localeService: TranslocoLocaleService,
    private readonly translocoService: TranslocoService,
    private readonly listItemsWrapperService: ListItemsWrapperService
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
    greaseReportData: GreaseReportSubordinate[],
    automaticLubrication: boolean
  ): GreasePdfResult {
    const greaseReportSubordinate: GreaseReportSubordinate =
      this.getResultData(greaseReportData);

    return this.mapToResultModel(greaseReportSubordinate, automaticLubrication);
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
    greaseReportSubordinate: GreaseReportSubordinate,
    automaticLubrication: boolean
  ): GreasePdfResult {
    let title = '';
    let tableItems: GreasePdfResultTable[] = [];

    if (greaseReportSubordinate) {
      tableItems = greaseReportSubordinate.subordinates.map((item) => ({
        title: item.greaseResult.mainTitle,
        subTitle: item.greaseResult?.subTitle ?? '',
        isRecommended: item.greaseResult?.isRecommended,

        items: this.extractItemsFromGreaseResultData(
          item.greaseResult?.dataSource
        ),
        concept1: automaticLubrication
          ? this.extractConcept1Result(item.greaseResult?.dataSource)
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
    data: GreaseResultData
  ): GreasePdfResultItem[] {
    if (!data) {
      return [];
    }

    return data
      .map((dataSource) => {
        let returnItem;

        if (dataSource && 'values' in dataSource) {
          const title: string = dataSource.title;

          return {
            itemTitle: this.getTranslatedTitle(title),
            items: this.encodeTextAndSplitOnNewLine(dataSource.values, title),
          };
        }

        return returnItem;
      })
      .filter((dataSource) => dataSource !== undefined);
  }

  private extractConcept1Result(
    data: GreaseResultData
  ): GreasePdfConcept1Result | undefined {
    if (!data) {
      return undefined;
    }

    return data
      .filter((dataSource) => dataSource && 'custom' in dataSource)
      .map(
        (customDataSource) =>
          ({
            title: this.getTranslatedTitle('concept1'),
            concept60ml: {
              conceptTitle: this.getTranslatedTitle(
                'concept1settings.concept1Size',
                { size: 60 }
              ),
              settingArrow: customDataSource?.custom?.data?.c1_60
                ? this.getTranslatedTitle('concept1settings.setArrowSetting', {
                    setting: customDataSource.custom.data.c1_60,
                  })
                : '',
              notes: this.getNoteFor60ml(customDataSource?.custom?.data),
            },
            concept125ml: {
              conceptTitle: this.getTranslatedTitle(
                'concept1settings.concept1Size',
                { size: 125 }
              ),
              settingArrow: customDataSource?.custom?.data?.c1_125
                ? this.getTranslatedTitle('concept1settings.setArrowSetting', {
                    setting: customDataSource.custom.data.c1_125,
                  })
                : '',
              notes: this.getNoteFor125ml(customDataSource?.custom?.data),
            },
          }) as GreasePdfConcept1Result
      )
      .shift();
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
    dataSourceValueWithHtml: string | undefined,
    dataSourceTitle: string
  ): string[] {
    const regex = /(<([^>]+)>)/gi;
    let result: string[] = [];

    if (dataSourceValueWithHtml) {
      dataSourceValueWithHtml.split('<br>').forEach((value) => {
        result.push(value.replaceAll(regex, ''));
      });

      if (dataSourceTitle === 'initialGreaseQuantity') {
        result = [result.join('/')];
      }
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
