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
import { FontsLoaderService } from './fonts-loader.service';
import { ResultBlock, ResultReport } from './pdfreport/data';
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
    private readonly documentSettingsService: PDFDocumentSettingsService
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
      .replace(/[./]/g, '-');

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
    const noticesData = await firstValueFrom(
      this.resultFacade.calculationReportMessages$
    );

    const notices: ResultBlock<typeof noticesData> = {
      header: this.translocoService.translate(
        'calculationResultReport.reportSectionWarnings',
        undefined,
        languageCode
      ),
      data: noticesData,
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

    const doNotFormat = new Set([
      'Designation',
      'Bezeichnung',
      'Denominación',
      'Désignation',
      '型号',
    ]);

    return inputItems.map((items) => {
      const flatten = (nestedItem: any): typeof items => {
        if (!nestedItem.hasNestedStructure) {
          let formattedValue = doNotFormat.has(nestedItem.designation)
            ? nestedItem.value
            : this.roundPipe.transform(nestedItem.value);
          if (nestedItem.unit) {
            formattedValue = `${formattedValue} ${nestedItem.unit}`;
          }

          return { ...nestedItem, value: formattedValue };
        }

        return nestedItem.subItems.map((nest: any) => flatten(nest));
      };

      return flatten(items);
    });
  }

  private localizeNumberFormats(data: ResultBlock<ResultReportLargeItem[]>) {
    data.data = data.data.map((item) => {
      const roundedValue = this.roundPipe.transform(item.value);
      const hasLoadcase = item.loadcaseValues !== undefined;
      const loadcaseValues = !hasLoadcase
        ? undefined
        : item.loadcaseValues.map((lc) => ({
            ...lc,
            value: this.roundPipe.transform(lc.value),
          }));

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
    data.data = data.data.map((reportitem) => ({
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
