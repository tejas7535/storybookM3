// ts
import { Injectable } from '@angular/core';

import { firstValueFrom, map } from 'rxjs';

import { ResultReportLargeItem } from '@ea/calculation/calculation-result-report-large-items/result-report-large-item';
import {
  CO2Icon,
  FrictionIcon,
  GreaseIcon,
  OverrollingFrequencyIcon,
  RatingLifeIcon,
} from '@ea/shared/constants/pdf-icons';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { CalculationResultFacade, ProductSelectionFacade } from '../store';
import { CalculationResultReportInput } from '../store/models';
import { CatalogCalculationInputFormatterService } from './catalog-calculation-input-formatter.service';
import { FontsLoaderService } from './fonts-loader.service';
import { Notices, ResultBlock, ResultReport } from './pdfreport/data';
import { PDFDocumentSettingsService } from './pdfreport/pdf-document-settings.service';
import { PDFREport } from './pdfreport/pdf-report';

@Injectable({ providedIn: 'root' })
export class PDFReportService {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly localeService: TranslocoLocaleService,
    private readonly resultFacade: CalculationResultFacade,
    private readonly selectionFacade: ProductSelectionFacade,
    private readonly roundPipe: MeaningfulRoundPipe,
    private readonly fontsLoaderService: FontsLoaderService,
    private readonly documentSettingsService: PDFDocumentSettingsService,
    private readonly catalogCalculationInputFormatterService: CatalogCalculationInputFormatterService
  ) {}

  async generate() {
    const languageCode = this.translocoService.getActiveLang();

    const data = await this.fetchResultData(languageCode);

    const report = new PDFREport(
      this.documentSettingsService.generateDocumentSettings(data),
      data,
      this.fontsLoaderService
    );

    return report.generate();
  }

  async generateFilename() {
    const designation = await firstValueFrom(
      this.selectionFacade.bearingDesignation$
    );
    const date = this.localeService
      .localizeDate(Date.now())
      .replaceAll(/[./]/g, '-');

    const filename = this.translocoService.translate('pdfReport.filename', {
      designation,
      date,
    });

    return filename;
  }

  private async fetchResultData(languageCode: string) {
    const calculationMethods = await firstValueFrom(
      this.resultFacade.getSelectedCalculations$.pipe(
        map((selection) =>
          selection.filter((s) => s.selected).map((s) => s.name)
        )
      )
    );
    const designation = await firstValueFrom(
      this.selectionFacade.bearingDesignation$
    );

    const calculationInput = await this.loadInputData();
    const errors = await firstValueFrom(
      this.resultFacade.calculationReportErrors$
    );

    const warnings = await firstValueFrom(
      this.resultFacade.calculationReportWarnings$
    );

    const notes = await firstValueFrom(
      this.resultFacade.calculationReportNotes$
    );

    const combinedNotices: Notices = {
      errors: {
        header: this.translocoService.translate(
          'calculationResultReport.errors',
          undefined,
          languageCode
        ),
        data: errors,
      },

      warnings: {
        header: this.translocoService.translate(
          'calculationResultReport.warnings',
          undefined,
          languageCode
        ),
        data: warnings,
      },
      notes: {
        header: this.translocoService.translate(
          'calculationResultReport.notes',
          undefined,
          languageCode
        ),
        data: notes,
      },
    };

    const notices: ResultBlock<typeof combinedNotices> = {
      header: this.translocoService.translate(
        'calculationResultReport.reportSectionWarnings',
        undefined,
        languageCode
      ),
      data: combinedNotices,
    };
    const data: ResultReport = {
      designation,
      calculationMethods,
      calculationInput,
      notices,
    };

    for (const method of calculationMethods) {
      // eslint-disable-next-line default-case
      switch (method) {
        case 'lubrication':
          data.lubricationInfo = {
            header: this.translocoService.translate(
              'calculationResultReport.lubrication.title',
              {},
              languageCode
            ),
            icon: GreaseIcon,
            data: await firstValueFrom(
              this.resultFacade.calculationReportLubrication$
            ),
          };
          this.loadTranslationBlock(
            'lubrication',
            data.lubricationInfo,
            languageCode
          );
          this.localizeNumberFormats(data.lubricationInfo);
          break;

        case 'overrollingFrequency':
          data.overrollingFrequency = {
            header: this.translocoService.translate(
              'calculationResultReport.overrollingFrequencies.title',
              {},
              languageCode
            ),
            icon: OverrollingFrequencyIcon,
            data: await firstValueFrom(
              this.resultFacade.getOverrollingFrequencies$
            ),
          };
          this.loadTranslationBlock(
            'overrollingFrequencies',
            data.overrollingFrequency,
            languageCode
          );
          this.localizeNumberFormats(data.overrollingFrequency);
          break;

        case 'ratingLife':
          data.ratingLife = {
            header: this.translocoService.translate(
              'calculationResultReport.ratingLife.title',
              {},
              languageCode
            ),
            icon: RatingLifeIcon,
            data: await firstValueFrom(
              this.resultFacade.calculationReportRatingLife$
            ),
          };
          this.loadTranslationBlock(
            'ratingLife',
            data.ratingLife,
            languageCode
          );
          this.localizeNumberFormats(data.ratingLife);
          break;

        case 'frictionalPowerloss':
          data.frictionalPowerloss = {
            header: this.translocoService.translate(
              'calculationResultReport.frictionalPowerloss.title'
            ),
            icon: FrictionIcon,
            data: await firstValueFrom(
              this.resultFacade.calculationReportFrictionalPowerloss$
            ),
          };
          this.loadTranslationBlock(
            'frictionalPowerloss',
            data.frictionalPowerloss,
            languageCode
          );
          this.localizeNumberFormats(data.frictionalPowerloss);
          break;

        case 'emission':
          data.upstreamEmissions = {
            header: this.translocoService.translate(
              'calculationResultReport.co2Emissions.title'
            ),
            icon: CO2Icon,
            data: await firstValueFrom(
              this.resultFacade.calculationReportCO2Emission$.pipe(
                map(
                  (emissions) =>
                    ({
                      title: this.translocoService.translate(
                        'calculationResultReport.co2Emissions.upstreamTitle',
                        {},
                        languageCode
                      ),
                      value: this.roundPipe.transform(emissions.co2_upstream),
                      unit: 'kg',
                      short: 'CO2e',
                    } as ResultReportLargeItem)
                )
              )
            ),
          };
          break;
      }
    }

    data.calculationMethods = calculationMethods.map((key) =>
      this.translocoService.translate(
        `calculationSelection.calculationTypes.${
          key === 'emission' ? 'co2' : key
        }`
      )
    );

    return data;
  }

  private async loadInputData() {
    const inputItems = await firstValueFrom(
      this.resultFacade.calculationReportInput$
    );

    if (!inputItems) {
      return [];
    }

    return inputItems.map((items) => {
      const flatten = (nestedItem: any): typeof items => {
        if (!nestedItem.hasNestedStructure && nestedItem.subItems) {
          return {
            ...nestedItem,
            subItems: this.formatSubItems(nestedItem.subItems),
          };
        }

        return nestedItem.subItems.map((nest: any) => flatten(nest));
      };

      return flatten(items);
    });
  }

  private formatSubItems(
    subItems: CalculationResultReportInput[]
  ): CalculationResultReportInput[] {
    return subItems.map((subItem) => {
      const formattedValue =
        this.catalogCalculationInputFormatterService.formatInputValue(subItem);

      return { ...subItem, value: formattedValue };
    });
  }

  private localizeNumberFormats(data: ResultBlock<ResultReportLargeItem[]>) {
    data.data = data.data.map((item) => {
      const roundedValue = this.roundPipe.transform(item.value);
      const hasLoadcase = item.loadcaseValues !== undefined;
      const loadcaseValues = hasLoadcase
        ? item.loadcaseValues.map((lc) => ({
            ...lc,
            value: this.roundPipe.transform(lc.value),
          }))
        : undefined;

      return { ...item, value: roundedValue, loadcaseValues };
    });
  }

  private loadTranslationBlock(
    scope:
      | 'overrollingFrequencies'
      | 'ratingLife'
      | 'lubrication'
      | 'frictionalPowerloss',
    data: ResultBlock<ResultReportLargeItem[]>,
    languageCode: string
  ) {
    if (!data.data) {
      data.data = [];
    }

    data.data = data.data?.map((reportitem) => ({
      ...reportitem,
      title: this.translocoService.translate(
        `calculationResultReport.${scope}.${reportitem.title}`,
        {},
        languageCode
      ),
    }));

    return data;
  }
}
