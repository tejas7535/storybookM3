/* istanbul ignore file: refactoring for better testability, see UFTABI-5740 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  Field,
  Hint,
  Report,
  Subordinate,
  TableItem,
  TitleId,
  WARNINGSOPENED,
} from '../../models';
import {
  GreaseResult,
  GreaseResultDataSourceItem,
  PreferredGreaseResult,
} from '../../models/grease-result.model';
import { itemValue } from '../helpers/grease-helpers';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

@Injectable()
export class GreaseReportService {
  public constructor(
    private readonly http: HttpClient,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly greaseResultDataSourceService: GreaseResultDataSourceService
  ) {}

  public async getGreaseReport(greaseReportUrl: string) {
    return lastValueFrom(this.http.get<Report>(greaseReportUrl));
  }

  public formatGreaseReport(
    subordinates: Subordinate[],
    preferredGreaseResult?: PreferredGreaseResult
  ): Subordinate[] {
    let formattedResult = subordinates || [];

    // remove unneeded sections
    formattedResult = formattedResult.filter(
      (section: Subordinate) => section.titleID === TitleId.STRING_OUTP_INPUT
    );

    // compose result sections
    const resultSection = subordinates.find(
      (section: Subordinate) => section.titleID === TitleId.STRING_OUTP_RESULTS
    ) as Subordinate;

    // get tables
    const tables = resultSection?.subordinates
      ?.filter(
        ({ titleID }: Subordinate) =>
          titleID === TitleId.STRING_OUTP_RESULTS_FOR_GREASE_SELECTION
      )
      .pop();

    // get table 1
    const table1 = tables?.subordinates?.find(
      ({ titleID }: Subordinate) =>
        titleID ===
        TitleId.STRING_OUTP_RESULTS_FOR_GREASE_SERVICE_STRING_OUTP_GREASE_QUANTITY_IN_CCM
    );

    // get table 2
    const table2 = tables?.subordinates?.find(
      ({ titleID }: Subordinate) =>
        titleID === TitleId.STRING_OUTP_OVERVIEW_OF_CALCULATION_DATA_FOR_GREASES
    );

    // compose compact grease table
    if (resultSection) {
      const formattedSubordinates: Subordinate[] = [
        ...(table2?.data?.items.map(
          (tableItems: TableItem[], index: number) => {
            const mainTitle = `${itemValue(tableItems, undefined, 0)}`;
            const table1Items = table1?.data?.items[index];
            const rho = +itemValue(tableItems, Field.RHO);
            const initialGreaseQuantity: GreaseResultDataSourceItem =
              this.greaseResultDataSourceService.initialGreaseQuantity(
                table1Items || [],
                rho
              );

            const greaseResult: GreaseResult = {
              mainTitle,
              subTitle: `${itemValue(
                tableItems,
                Field.BASEOIL
              )}, NLGI${itemValue(tableItems, Field.NLGI)}, ${itemValue(
                tableItems,
                Field.THICKENER
              )}`,
              // mark as insufficient if there is no initial grease quantity available
              isSufficient: !!initialGreaseQuantity,
              isPreferred: mainTitle === preferredGreaseResult?.text,
              dataSource: [
                initialGreaseQuantity,
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
                  tableItems
                ),
                this.greaseResultDataSourceService.lowerTemperatureLimit(
                  tableItems
                ),
                this.greaseResultDataSourceService.upperTemperatureLimit(
                  tableItems
                ),
                this.greaseResultDataSourceService.additiveRequired(
                  table1Items || []
                ),
                this.greaseResultDataSourceService.effectiveEpAdditivation(
                  table1Items || []
                ),
                this.greaseResultDataSourceService.density(tableItems),
                this.greaseResultDataSourceService.lowFriction(tableItems),
                this.greaseResultDataSourceService.suitableForVibrations(
                  tableItems
                ),
                this.greaseResultDataSourceService.supportForSeals(tableItems),
                this.greaseResultDataSourceService.h1Registration(tableItems),
              ],
            };

            return {
              greaseResult,
              index,
              identifier: 'greaseResult',
            };
          }
        ) as Subordinate[]),
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
        title: translate('errorsWarningsNotes'),
        subordinates: subordinates.filter(
          (subordinate: Subordinate) =>
            subordinate.title &&
            Object.values(Hint)
              .map((value) => translate(value))
              .includes(subordinate.title)
        ),
      },
    ];

    return formattedResult;
  }

  public getResultAmount(subordinates: Subordinate[]): number {
    return (
      subordinates.find(
        (subordinate) => subordinate.titleID === TitleId.STRING_OUTP_RESULTS
      )?.subordinates?.length ?? 0
    );
  }

  public trackWarningsOpened(): void {
    this.applicationInsightsService.logEvent(WARNINGSOPENED);
  }
}
