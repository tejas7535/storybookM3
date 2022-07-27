/* istanbul ignore file: refactoring for better testability, see UFTABI-5740 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { WARNINGSOPENED } from '../constants';
import { itemValue } from '../helpers/grease-helpers';
import {
  GreaseReport,
  GreaseReportSubordinate,
  GreaseReportSubordinateDataItem,
  GreaseReportSubordinateHint,
  GreaseReportSubordinateTitle,
  GreaseResult,
  PreferredGreaseResult,
  SubordinateDataItemField,
} from '../models';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

@Injectable()
export class GreaseReportService {
  public constructor(
    private readonly http: HttpClient,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly greaseResultDataSourceService: GreaseResultDataSourceService
  ) {}

  public async getGreaseReport(greaseReportUrl: string) {
    return lastValueFrom(this.http.get<GreaseReport>(greaseReportUrl));
  }

  public formatGreaseReport(
    subordinates: GreaseReportSubordinate[],
    preferredGreaseResult?: PreferredGreaseResult
  ): GreaseReportSubordinate[] {
    let formattedResult = subordinates || [];

    // remove unneeded sections
    formattedResult = formattedResult.filter(
      (section: GreaseReportSubordinate) =>
        section.titleID === GreaseReportSubordinateTitle.STRING_OUTP_INPUT
    );

    // compose result sections
    const resultSection = subordinates.find(
      (section: GreaseReportSubordinate) =>
        section.titleID === GreaseReportSubordinateTitle.STRING_OUTP_RESULTS
    ) as GreaseReportSubordinate;

    // get tables
    const tables = resultSection?.subordinates
      ?.filter(
        ({ titleID }: GreaseReportSubordinate) =>
          titleID ===
          GreaseReportSubordinateTitle.STRING_OUTP_RESULTS_FOR_GREASE_SELECTION
      )
      .pop();

    // get table 1
    const table1 = tables?.subordinates?.find(
      ({ titleID }: GreaseReportSubordinate) =>
        titleID ===
        GreaseReportSubordinateTitle.STRING_OUTP_RESULTS_FOR_GREASE_SERVICE_STRING_OUTP_GREASE_QUANTITY_IN_CCM
    );

    // get table 2
    const table2 = tables?.subordinates?.find(
      ({ titleID }: GreaseReportSubordinate) =>
        titleID ===
        GreaseReportSubordinateTitle.STRING_OUTP_OVERVIEW_OF_CALCULATION_DATA_FOR_GREASES
    );

    // compose compact grease table
    if (resultSection) {
      const formattedSubordinates: GreaseReportSubordinate[] = [
        ...(table2?.data?.items.map(
          (dataItems: GreaseReportSubordinateDataItem[], index: number) => {
            const mainTitle = `${itemValue(dataItems, undefined, 0)}`;
            const table1Items = table1?.data?.items[index];
            const rho = +itemValue(dataItems, SubordinateDataItemField.RHO);

            const greaseResult: GreaseResult = {
              mainTitle,
              subTitle: `${itemValue(
                dataItems,
                SubordinateDataItemField.BASEOIL
              )}, NLGI${itemValue(
                dataItems,
                SubordinateDataItemField.NLGI
              )}, ${itemValue(dataItems, SubordinateDataItemField.THICKENER)}`,
              isSufficient: this.greaseResultDataSourceService.isSufficient(
                table1Items || []
              ),
              isPreferred: mainTitle === preferredGreaseResult?.text,
              dataSource: [
                this.greaseResultDataSourceService.initialGreaseQuantity(
                  table1Items || [],
                  rho
                ),
                this.greaseResultDataSourceService.manualRelubricationQuantityInterval(
                  table1Items || [],
                  rho
                ),
                this.greaseResultDataSourceService.automaticRelubricationQuantityPerDay(
                  table1Items || [],
                  rho
                ),
                this.greaseResultDataSourceService.greaseServiceLife(
                  table1Items || []
                ),
                this.greaseResultDataSourceService.automaticRelubricationPerWeek(
                  table1Items || [],
                  rho
                ),
                this.greaseResultDataSourceService.automaticRelubricationPerMonth(
                  table1Items || [],
                  rho
                ),
                this.greaseResultDataSourceService.automaticRelubricationPerYear(
                  table1Items || [],
                  rho
                ),
                this.greaseResultDataSourceService.viscosityRatio(
                  table1Items || []
                ),
                this.greaseResultDataSourceService.baseOilViscosityAt40(
                  dataItems
                ),
                this.greaseResultDataSourceService.lowerTemperatureLimit(
                  dataItems
                ),
                this.greaseResultDataSourceService.upperTemperatureLimit(
                  dataItems
                ),
                this.greaseResultDataSourceService.additiveRequired(
                  table1Items || []
                ),
                this.greaseResultDataSourceService.effectiveEpAdditivation(
                  table1Items || []
                ),
                this.greaseResultDataSourceService.density(dataItems),
                this.greaseResultDataSourceService.lowFriction(dataItems),
                this.greaseResultDataSourceService.suitableForVibrations(
                  dataItems
                ),
                this.greaseResultDataSourceService.supportForSeals(dataItems),
                this.greaseResultDataSourceService.h1Registration(dataItems),
              ],
            };

            return {
              greaseResult,
              index,
              identifier: 'greaseResult',
            };
          }
        ) as GreaseReportSubordinate[]),
      ];

      // move preferred grease to the top
      const preferredIndex = formattedSubordinates.findIndex(
        (item) => item?.greaseResult?.isPreferred
      );

      if (preferredIndex > 0) {
        formattedSubordinates.unshift(
          formattedSubordinates.splice(preferredIndex, 1)[0]
        );
      }

      formattedResult = [
        ...formattedResult,
        {
          ...resultSection,
          defaultOpen: true,
          subordinates: formattedSubordinates,
        },
      ];
    }

    // add errors, warning, notes
    formattedResult = [
      ...formattedResult,
      {
        identifier: 'block',
        clickHandler: () => this.trackWarningsOpened(),
        defaultOpen: !resultSection,
        title: translate('calculationResult.errorsWarningsNotes'),
        subordinates: subordinates.filter(
          (subordinate: GreaseReportSubordinate) =>
            subordinate.title &&
            Object.values(GreaseReportSubordinateHint)
              .map((value) => translate(`calculationResult.${value}`))
              .includes(subordinate.title)
        ),
      },
    ];

    return formattedResult;
  }

  public getResultAmount(subordinates: GreaseReportSubordinate[]): number {
    return (
      subordinates.find(
        (subordinate) =>
          subordinate.titleID ===
          GreaseReportSubordinateTitle.STRING_OUTP_RESULTS
      )?.subordinates?.length ?? 0
    );
  }

  public trackWarningsOpened(): void {
    this.applicationInsightsService.logEvent(WARNINGSOPENED);
  }
}
