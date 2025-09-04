/* eslint-disable max-lines */
import { inject, Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { HashMap, TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { ImageResolverService } from '@schaeffler/pdf-generator';

import { PartnerVersion } from '@ga/shared/models';
import { QrCodeService } from '@ga/shared/services';

import { getKappaBadgeColorClass } from '../helpers/grease-helpers';
import {
  BadgeStyle,
  GreasePdfInput,
  GreasePdfInputTable,
  GreasePdfMessage,
  GreasePdfMessageItem,
  GreaseReportSubordinate,
  GreaseReportSubordinateTitle,
  GreaseResult,
  GreaseResultDataItem,
  GreaseResultItem,
  PDFGreaseReportResult,
  PDFGreaseResultSection,
  PDFGreaseResultSectionItem,
  PDFPartnerVersionHeaderInfo,
} from '../models';
import { ListItemsWrapperService } from './pdf/list-items-wrapper.service';

@Injectable({
  providedIn: 'root',
})
export class GreaseReportDataGeneratorService {
  private readonly localeService = inject(TranslocoLocaleService);
  private readonly translocoService = inject(TranslocoService);
  private readonly listItemsWrapperService = inject(ListItemsWrapperService);
  private readonly imageResolverService = inject(ImageResolverService);
  private readonly qrCodeService = inject(QrCodeService);

  public prepareReportInputData(
    greaseReportData: GreaseReportSubordinate[]
  ): GreasePdfInput {
    const greaseReportSubordinate: GreaseReportSubordinate =
      this.getInputData(greaseReportData);

    return this.mapToTableModel(greaseReportSubordinate);
  }

  public async prepareReportResultData(
    greaseResults: GreaseResult[],
    partnerVersion: `${PartnerVersion}`
  ): Promise<PDFGreaseReportResult[]> {
    const filterSectionValues = (
      section: PDFGreaseResultSection | undefined
    ): PDFGreaseResultSection | undefined => {
      if (!section) {
        return section;
      }

      return {
        ...section,
        values: Array.isArray(section.values)
          ? section.values.filter(Boolean)
          : section.values,
      };
    };

    const results = await Promise.all(
      greaseResults.map(async (greaseResult) => {
        let qrCode = '';
        try {
          qrCode = await this.qrCodeService.generateGreaseQrCode(
            greaseResult.mainTitle,
            partnerVersion as PartnerVersion
          );
        } catch (error) {
          console.error(
            `Failed to generate QR code for ${greaseResult.mainTitle}:`,
            error
          );
        }

        const partnerVersionInfo =
          await this.getPartnerVersionHeaderInfo(partnerVersion);

        return {
          sections: [
            filterSectionValues({
              sectionTitle: this.getTranslatedTitle('initialLubrication'),
              values: [
                this.getResultSectionItemWithInlineValues(
                  greaseResult.initialLubrication.initialGreaseQuantity
                ),
              ],
            }),
            filterSectionValues(this.getPerformanceSection(greaseResult)),
            filterSectionValues(
              await this.getRelubricationSection(greaseResult)
            ),
            filterSectionValues(this.getGreaseSelectionSection(greaseResult)),
          ],
          isPreferred: greaseResult.isPreferred,
          isSufficient: greaseResult.isSufficient,
          mainTitle: greaseResult.mainTitle,
          subTitle: greaseResult.subTitle ?? '',
          qrCode,
          recommended: greaseResult?.isRecommended
            ? this.getTranslatedTitle('recommendedChip')
            : undefined,
          miscible: greaseResult?.isMiscible
            ? this.getTranslatedTitle('miscibleChip')
            : undefined,
          partnerVersionInfo,
        };
      })
    );

    return results;
  }

  private async getPartnerVersionHeaderInfo(
    partnerVersion: `${PartnerVersion}`
  ): Promise<PDFPartnerVersionHeaderInfo | undefined> {
    if (partnerVersion) {
      return {
        title: this.getTranslatedTitle('poweredBy'),
        schaefflerLogo: await firstValueFrom(
          this.imageResolverService.readImageFromAssets(
            '/assets/images/schaeffler-logo.png'
          )
        ),
      };
    }

    return undefined;
  }

  private getPerformanceSection(
    greaseResult: GreaseResult
  ): PDFGreaseResultSection {
    return {
      sectionTitle: this.getTranslatedTitle('performance'),
      values: [
        this.getViscosityRatioKapa(greaseResult.performance.viscosityRatio),
        this.getStringResultSectionItem(
          greaseResult.performance.additiveRequired
        ),
        this.getStringResultSectionItem(
          greaseResult.performance.effectiveEpAdditivation
        ),
        this.getStringResultSectionItem(greaseResult.performance.lowFriction),
        this.getStringResultSectionItem(
          greaseResult.performance.suitableForVibrations
        ),
        this.getStringResultSectionItem(
          greaseResult.performance.supportForSeals
        ),
      ],
    };
  }

  private async getRelubricationSection(
    greaseResult: GreaseResult
  ): Promise<PDFGreaseResultSection> {
    return {
      sectionTitle: this.getTranslatedTitle('relubrication'),
      values: [
        this.getResultSectionItem(
          greaseResult.relubrication.relubricationQuantityPer1000OperatingHours
        ),
        this.getResultSectionItem(
          greaseResult.relubrication.relubricationPer365Days
        ),
        this.getResultSectionItem(
          greaseResult.relubrication.relubricationPer30Days
        ),
        this.getResultSectionItem(
          greaseResult.relubrication.relubricationPer7Days
        ),
        await this.getConcept1Item(greaseResult.relubrication.concept1),
        this.getResultSectionItem(
          greaseResult.relubrication.maximumManualRelubricationPerInterval
        ),
        this.getResultSectionItem(
          greaseResult.relubrication.relubricationInterval
        ),
      ],
    };
  }

  private getViscosityRatioKapa(
    item: GreaseResultItem<number>
  ): PDFGreaseResultSectionItem {
    const resultItem = this.getResultSectionItem(item);

    if (resultItem) {
      const badgeClass = getKappaBadgeColorClass(resultItem.value);
      if (badgeClass.includes('success')) {
        resultItem.badgeClass = BadgeStyle.Success;
      } else if (badgeClass.includes('error')) {
        resultItem.badgeClass = BadgeStyle.Error;
      }
    }

    return resultItem;
  }

  private async getConcept1Item(
    item: GreaseResultDataItem
  ): Promise<PDFGreaseResultSectionItem> {
    let cartridge;
    const data = item.custom?.data;
    let badgeClass: BadgeStyle = BadgeStyle.Success;
    let unloadInfo = '';
    let arrowSetting = '';
    let duration;

    const key = 'concept1settings';

    if (data.c1_60) {
      duration = data.c1_60;
      cartridge = this.getTranslatedTitle(`${key}.ml`, { ml: '60' });
    } else if (data.c1_125) {
      duration = data.c1_125;
      cartridge = this.getTranslatedTitle(`${key}.ml`, {
        ml: '125',
      });
    } else {
      cartridge = this.getTranslatedTitle(`${key}.${data.label}`);
      badgeClass = BadgeStyle.Warning;
    }

    if (duration) {
      unloadInfo = this.getTranslatedTitle(`${key}.emptyDuration`, {
        duration,
      });

      arrowSetting = this.getTranslatedTitle(`${key}.arrowSetting`, {
        setting: duration,
      });
    }

    const image = await this.getImage(duration);

    return {
      title: this.getTranslatedTitle(item.title),
      value: cartridge,
      badgeClass,
      concept1Data: {
        emptyDuration: unloadInfo,
        duration,
        arrowSetting,
        arrowImage: image,
      },
    };
  }

  private async getImage(duration: number): Promise<string> {
    const path = '/assets/images/pdf/setting_';
    const imagePath = duration
      ? `${path}${duration}.png`
      : `${path}disabled.png`;

    const image = await firstValueFrom(
      this.imageResolverService.readImageFromAssets(imagePath)
    );

    return image;
  }

  private getResultSectionItem(
    item: GreaseResultItem<number>
  ): PDFGreaseResultSectionItem {
    if (!item) {
      return undefined;
    }

    return {
      title: this.getTranslatedTitle(item.title),
      value: this.getValue(item),
      secondaryValue: item?.secondaryValue
        ? this.getSecondaryValue(item)
        : undefined,
    };
  }

  private getStringResultSectionItem(
    item: GreaseResultItem<string>
  ): PDFGreaseResultSectionItem {
    if (!item) {
      return undefined;
    }

    const value = item?.value ?? '';

    return {
      title: this.getTranslatedTitle(item.title),
      value,
    };
  }

  private getResultSectionItemWithInlineValues(
    item: GreaseResultItem<number>
  ): PDFGreaseResultSectionItem {
    if (!item) {
      return undefined;
    }

    return {
      title: this.getTranslatedTitle(item.title),
      value: `${this.getValue(item)} | ${this.getSecondaryValue(item)}`,
    };
  }

  private getGreaseSelectionSection(
    greaseResult: GreaseResult
  ): PDFGreaseResultSection {
    return {
      sectionTitle: this.getTranslatedTitle('greaseSelection'),
      values: [
        this.getResultSectionItem(
          greaseResult.greaseSelection.greaseServiceLife
        ),
        this.getResultSectionItem(
          greaseResult.greaseSelection.baseOilViscosityAt40
        ),

        this.getResultSectionItem(
          greaseResult.greaseSelection.lowerTemperatureLimit
        ),
        this.getResultSectionItem(
          greaseResult.greaseSelection.upperTemperatureLimit
        ),
        this.getResultSectionItem(greaseResult.greaseSelection.density),
        this.getStringResultSectionItem(
          greaseResult.greaseSelection.h1Registration
        ),
      ],
    };
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

  private readonly getValue = (item: GreaseResultItem<number>): string => {
    const unit = item?.unit || '';
    const value = item?.value ?? '';

    return `${this.localeService.localizeNumber(value, 'decimal')} ${unit}`;
  };

  private readonly getSecondaryValue = (
    item: GreaseResultItem<number>
  ): string => {
    const unit = item?.secondaryUnit || '';
    const value = item?.secondaryValue ?? '';

    return `${this.localeService.localizeNumber(value, 'decimal')} ${unit}`;
  };

  private getTranslatedTitle(translationKey: string, params?: HashMap): string {
    return this.translocoService.translate(
      `calculationResult.${translationKey}`,
      params
    );
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
      this.getOldWayValue(subOrdinate),
    ]);
  }

  private readonly getLabel = (subordinate?: GreaseReportSubordinate): string =>
    `${subordinate?.designation || ''} ${this.getLabelAbbreviation(
      subordinate
    )}`;

  private readonly getOldWayValue = (
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
