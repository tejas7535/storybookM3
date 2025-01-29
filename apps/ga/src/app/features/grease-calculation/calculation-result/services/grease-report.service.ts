import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { delay, lastValueFrom, map, retryWhen, take } from 'rxjs';

import { translate } from '@jsverse/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { CalculationParametersFacade } from '@ga/core/store';
import { alternativeTable, marketGreases } from '@ga/shared/constants';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';

import { greaseResultExceptions, WARNINGSOPENED } from '../constants';
import { itemValue } from '../helpers/grease-helpers';
import {
  GreaseReport,
  GreaseReportConcept1Subordinate,
  GreaseReportSubordinate,
  GreaseReportSubordinateDataItem,
  GreaseReportSubordinateHint,
  GreaseReportSubordinateTitle,
  GreaseResult,
  PreferredGreaseResult,
  SubordinateDataItemField,
  SUITABILITY_LABEL,
} from '../models';
import { GreaseRecommendationService } from './grease-recommendation.service';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

@Injectable()
export class GreaseReportService {
  private readonly isVerticalAxisSelected = toSignal(
    this.calculationParametersFacade.isVerticalAxisOrientation$
  );

  public constructor(
    private readonly http: HttpClient,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly greaseResultDataSourceService: GreaseResultDataSourceService,
    private readonly recommendationService: GreaseRecommendationService,
    private readonly appAnalyticsService: AppAnalyticsService,
    private readonly calculationParametersFacade: CalculationParametersFacade
  ) {}

  public async getGreaseReport(greaseReportUrl: string) {
    return lastValueFrom(
      this.http.get<GreaseReport>(greaseReportUrl).pipe(
        map((val) => {
          if (!val) {
            throw new Error('Empty Result');
          }

          return val;
        }),
        retryWhen((error) => error.pipe(delay(1000), take(20)))
      )
    );
  }

  public async formatGreaseReport(
    subordinates: GreaseReportSubordinate[],
    preferredGreaseResult?: PreferredGreaseResult,
    automaticLubrication?: boolean
  ): Promise<GreaseReportSubordinate[]> {
    let formattedResult = subordinates || [];

    // remove unneeded sections
    formattedResult = formattedResult.filter(
      (section: GreaseReportSubordinate) =>
        section.titleID === GreaseReportSubordinateTitle.STRING_OUTP_INPUT
    );

    const resultSection = this.findSubordinateByTitleId(
      subordinates,
      GreaseReportSubordinateTitle.STRING_OUTP_RESULTS
    );

    const tables = resultSection?.subordinates
      ?.filter(
        ({ titleID }: GreaseReportSubordinate) =>
          titleID ===
          GreaseReportSubordinateTitle.STRING_OUTP_RESULTS_FOR_GREASE_SELECTION
      )
      .pop();

    const table1 = this.findSubordinateByTitleId(
      tables?.subordinates,
      GreaseReportSubordinateTitle.STRING_OUTP_RESULTS_FOR_GREASE_SERVICE_STRING_OUTP_GREASE_QUANTITY_IN_CCM
    );

    const table2 = this.findSubordinateByTitleId(
      tables?.subordinates,
      GreaseReportSubordinateTitle.STRING_OUTP_OVERVIEW_OF_CALCULATION_DATA_FOR_GREASES
    );

    const concept1 = this.findSubordinateByTitleId(
      resultSection?.subordinates,
      GreaseReportSubordinateTitle.STRING_OUTP_CONCEPT1
    )?.subordinates;

    // compose compact grease table
    if (resultSection) {
      let formattedSubordinates: GreaseReportSubordinate[] = [
        ...(table2?.data?.items.map(
          (dataItems: GreaseReportSubordinateDataItem[], index: number) => {
            const mainTitle = `${itemValue(dataItems, undefined, 0)}`;
            const table1Items = table1?.data?.items[index] ?? [];
            const rho = +itemValue(dataItems, SubordinateDataItemField.RHO);
            let greaseLifeService =
              this.greaseResultDataSourceService.greaseServiceLife(table1Items);

            let quantityOfRelubricationPer7Days =
              this.greaseResultDataSourceService.relubricationPer7Days(
                table1Items,
                rho
              );

            let quntityOfRelubricationPer30days =
              this.greaseResultDataSourceService.relubricationPer30Days(
                table1Items,
                rho
              );

            let maximumManualRelubricationInterval =
              this.greaseResultDataSourceService.maximumManualRelubricationInterval(
                table1Items,
                rho
              );

            let relubricationInterval =
              this.greaseResultDataSourceService.relubricationInterval(
                table1Items
              );

            let per1000OperatingHours =
              this.greaseResultDataSourceService.relubricationQuantityPer1000OperatingHours(
                table1Items,
                rho
              );

            if (this.isVerticalAxisSelected()) {
              greaseLifeService = undefined;
              quntityOfRelubricationPer30days = undefined;
              relubricationInterval = undefined;
              per1000OperatingHours = undefined;
              maximumManualRelubricationInterval =
                this.greaseResultDataSourceService.maxManualRelubricationIntervalForVerticalAxis(
                  table1Items,
                  rho
                );

              quantityOfRelubricationPer7Days =
                this.greaseResultDataSourceService.getMaximumLubricationPer7Days(
                  table1Items,
                  rho
                );
            }

            const greaseResult: GreaseResult = {
              mainTitle,
              ...(rho && {
                subTitle: `${itemValue(
                  dataItems,
                  SubordinateDataItemField.BASEOIL
                )}, NLGI${itemValue(
                  dataItems,
                  SubordinateDataItemField.NLGI
                )}, ${itemValue(
                  dataItems,
                  SubordinateDataItemField.THICKENER
                )}`,
              }),
              isSufficient:
                this.greaseResultDataSourceService.isSufficient(table1Items),
              isPreferred:
                mainTitle === preferredGreaseResult?.text ||
                marketGreases.filter(
                  ({ title, category }) =>
                    mainTitle === title &&
                    category === preferredGreaseResult?.id
                ).length === 1,
              dataSource: [
                this.greaseResultDataSourceService.automaticLubrication(
                  concept1 as GreaseReportConcept1Subordinate[],
                  index
                ),
                this.greaseResultDataSourceService.initialGreaseQuantity(
                  table1Items,
                  rho
                ),
                this.greaseResultDataSourceService.relubricationPer365Days(
                  table1Items,
                  rho
                ),
                maximumManualRelubricationInterval,
                per1000OperatingHours,
                greaseLifeService,
                relubricationInterval,
                quntityOfRelubricationPer30days,
                quantityOfRelubricationPer7Days,
                this.greaseResultDataSourceService.viscosityRatio(table1Items),
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
                  table1Items
                ),
                this.greaseResultDataSourceService.effectiveEpAdditivation(
                  table1Items
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
      ]
        // exclude grease which are available within the API, but should not be shown in the result because of certain limitations.
        // e.g. Arcanol XTRA3 is only for the Indian market
        .filter(
          (subordinate) =>
            !greaseResultExceptions.includes(
              subordinate.greaseResult?.mainTitle
            )
        );

      // fix order by index just in case
      formattedSubordinates = [...formattedSubordinates].sort(
        (firstSubordinate, secondSubordinate) =>
          +(firstSubordinate as any).index - +(secondSubordinate as any).index
      );

      // reorder for automatic lubrication
      if (automaticLubrication) {
        const suitabilityOrder = [
          SUITABILITY_LABEL.SUITED,
          SUITABILITY_LABEL.CONDITIONAL,
          SUITABILITY_LABEL.UNKNOWN,
          SUITABILITY_LABEL.NOT_SUITED,
          SUITABILITY_LABEL.UNSUITED,
        ];

        formattedSubordinates = [...formattedSubordinates].sort(
          ({ greaseResult: first }, { greaseResult: next }) =>
            suitabilityOrder.indexOf(first.dataSource[0].custom.data.label) -
            suitabilityOrder.indexOf(next.dataSource[0].custom.data.label)
        );
      }

      // move preferred grease to the top
      const preferredIndex = formattedSubordinates.findIndex(
        (item) => item?.greaseResult?.isPreferred
      );
      if (preferredIndex > 0) {
        formattedSubordinates.unshift(
          formattedSubordinates.splice(preferredIndex, 1)[0]
        );
      }

      // Call to highlight the recommended grease from the results
      await this.recommendationService.processGreaseRecommendation(
        formattedSubordinates
      );

      // display recommended alternatives only
      if (preferredGreaseResult) {
        const alternativeMatch = alternativeTable.find(
          ({ name }) => name === preferredGreaseResult.text
        );

        if (alternativeMatch) {
          const { alternatives, all } = alternativeMatch;

          const [firstEntry, ...rest] = formattedSubordinates;

          formattedSubordinates = [
            firstEntry,
            ...rest
              .filter(
                ({ greaseResult: { mainTitle } }) =>
                  all || alternatives.includes(mainTitle) || !alternatives
              )
              .sort(
                (
                  { greaseResult: { mainTitle: title1 } },
                  { greaseResult: { mainTitle: title2 } }
                ) =>
                  +alternatives.includes(title2) -
                  +alternatives.includes(title1)
              ),
          ];
        }
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
    const hintTitles = new Set<string>(
      Object.values(GreaseReportSubordinateHint).flatMap(
        (value: GreaseReportSubordinateHint) => [
          value && value[0].toUpperCase() + value.slice(1),
          translate(`calculationResult.${value}`),
        ]
      )
    );

    const errorWarningAndNotesSubordinates = subordinates
      .filter(
        (subordinate: GreaseReportSubordinate) =>
          subordinate.title && hintTitles.has(subordinate.title)
      )
      .map((subordinate: GreaseReportSubordinate) => {
        if (
          subordinate.titleID ===
            GreaseReportSubordinateTitle.STRING_NOTE_BLOCK &&
          this.isVerticalAxisSelected()
        ) {
          subordinate.subordinates.push({
            identifier: 'text',
            text: [translate('calculationResult.axisOrientation.disclaimer')],
          });

          return {
            ...subordinate,
          };
        }

        return subordinate;
      });

    formattedResult = [
      ...formattedResult,
      {
        identifier: 'block',
        clickHandler: () => this.trackWarningsOpened(),
        defaultOpen: !resultSection,
        title: translate('calculationResult.errorsWarningsNotes'),
        subordinates: errorWarningAndNotesSubordinates,
      },
    ];

    return formattedResult;
  }

  public getResultAmount(subordinates: GreaseReportSubordinate[]): number {
    return (
      this.findSubordinateByTitleId(
        subordinates,
        GreaseReportSubordinateTitle.STRING_OUTP_RESULTS
      )?.subordinates?.length ?? 0
    );
  }

  public trackWarningsOpened(): void {
    this.appAnalyticsService.logInteractionEvent(
      InteractionEventType.ErrorsAndWarnings
    );
    this.applicationInsightsService.logEvent(WARNINGSOPENED);
  }

  private findSubordinateByTitleId(
    subordinates: GreaseReportSubordinate[] | undefined,
    titleId: GreaseReportSubordinateTitle
  ): GreaseReportSubordinate {
    return subordinates?.find(
      (section: GreaseReportSubordinate) => section.titleID === titleId
    );
  }
}
