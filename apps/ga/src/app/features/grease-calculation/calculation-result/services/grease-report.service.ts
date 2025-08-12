/* eslint-disable max-lines */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { lastValueFrom, map, retry, timer } from 'rxjs';

import { translate } from '@jsverse/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { CalculationParametersFacade } from '@ga/core/store';
import { environment } from '@ga/environments/environment';
import { marketGreases } from '@ga/shared/constants';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';

import { greaseResultExceptions, WARNINGSOPENED } from '../constants';
import { itemValue, scoreGreaseEntry } from '../helpers/grease-helpers';
import {
  GreaseReport,
  GreaseReportConcept1Subordinate,
  GreaseReportSubordinate,
  GreaseReportSubordinateDataItem,
  GreaseReportSubordinateHint,
  GreaseReportSubordinateTitle,
  GreaseResult,
  GreaseResultReport,
  InitialLubricationResult,
  PerformanceResult,
  PreferredGreaseResult,
  RelubricationResult,
  SubordinateDataItemField,
  SUITABILITY_LABEL,
} from '../models';
import { GreaseMiscibilityService } from './grease-miscibility/grease-miscibility.service';
import { GreaseRecommendationService } from './grease-recommendation.service';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

@Injectable()
export class GreaseReportService {
  private readonly http = inject(HttpClient);
  private readonly applicationInsightsService = inject(
    ApplicationInsightsService
  );
  private readonly greaseResultDataSourceService = inject(
    GreaseResultDataSourceService
  );
  private readonly recommendationService = inject(GreaseRecommendationService);
  private readonly appAnalyticsService = inject(AppAnalyticsService);
  private readonly calculationParametersFacade = inject(
    CalculationParametersFacade
  );
  private readonly greaseMiscibilityService = inject(GreaseMiscibilityService);

  private readonly isVerticalAxisSelected = toSignal(
    this.calculationParametersFacade.isVerticalAxisOrientation$
  );

  private readonly _greaseResultReport = signal<
    GreaseResultReport | undefined
    // eslint-disable-next-line unicorn/no-useless-undefined
  >(undefined);
  public readonly greaseResultReport = this._greaseResultReport.asReadonly();

  private readonly _subordinates = signal<
    GreaseReportSubordinate[] | undefined
    // eslint-disable-next-line unicorn/no-useless-undefined
  >(undefined);
  public readonly subordinates = this._subordinates.asReadonly();

  public async getGreaseReport(
    greaseReportUrl: string,
    preferredGreaseResult?: PreferredGreaseResult,
    automaticLubrication?: boolean
  ): Promise<void> {
    this._greaseResultReport.set(undefined);
    this._subordinates.set(undefined);

    return lastValueFrom(
      this.http.get<GreaseReport>(greaseReportUrl).pipe(
        map(async (val) => {
          if (!val) {
            throw new Error('Empty Result');
          }

          const greaseResultReport = await this.formatGreaseReport(
            val.subordinates,
            preferredGreaseResult,
            automaticLubrication
          );

          this._greaseResultReport.set(greaseResultReport);
          this._subordinates.set(val.subordinates);
        }),
        retry({ count: 20, delay: () => timer(1000) })
      )
    );
  }

  public async formatGreaseReport(
    subordinates: GreaseReportSubordinate[],
    preferredGreaseResult?: PreferredGreaseResult,
    automaticLubrication?: boolean
  ): Promise<GreaseResultReport> {
    const inputs = this.findSubordinateByTitleId(
      subordinates,
      GreaseReportSubordinateTitle.STRING_OUTP_INPUT
    );

    const resultSection = this.findSubordinateByTitleId(
      subordinates,
      GreaseReportSubordinateTitle.STRING_OUTP_RESULTS
    );

    const legalNote = subordinates.find(
      (subordinate) => subordinate.identifier === 'legalNote'
    )?.legal;
    // add errors, warning, notes
    const hintTitles = new Set<string>(
      Object.values(GreaseReportSubordinateHint).flatMap(
        (value: GreaseReportSubordinateHint) => [
          value && value[0].toUpperCase() + value.slice(1),
          translate(`calculationResult.${value}`),
        ]
      )
    );

    const errorWarningsAndNotes: GreaseReportSubordinate = {
      identifier: 'block',
      clickHandler: () => this.trackWarningsOpened(),
      defaultOpen: !resultSection,
      title: translate('calculationResult.errorsWarningsNotes'),
      subordinates: subordinates
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
        }),
    };

    const greaseResultReport: GreaseResultReport = {
      inputs,
      errorWarningsAndNotes,
      legalNote,
    };

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

    const concept1Subordinate = this.findSubordinateByTitleId(
      resultSection?.subordinates,
      GreaseReportSubordinateTitle.STRING_OUTP_CONCEPT1
    )?.subordinates;

    // compose compact grease table
    if (resultSection) {
      let greaseResults: GreaseResult[] = [
        // eslint-disable-next-line no-unsafe-optional-chaining
        ...table2?.data?.items.map(
          (dataItems: GreaseReportSubordinateDataItem[], index: number) => {
            const mainTitle = `${itemValue(dataItems, undefined, 0)}`;
            const table1Items = table1?.data?.items[index] ?? [];
            const rho = +itemValue(dataItems, SubordinateDataItemField.RHO);

            // initialLubrication

            const initialGreaseQuantity =
              this.greaseResultDataSourceService.initialGreaseQuantity(
                table1Items,
                rho
              );

            // performance

            const viscosityRatio =
              this.greaseResultDataSourceService.viscosityRatio(table1Items);
            const additiveRequired =
              this.greaseResultDataSourceService.additiveRequired(table1Items);
            const lowFriction =
              this.greaseResultDataSourceService.lowFriction(dataItems);
            const suitableForVibrations =
              this.greaseResultDataSourceService.suitableForVibrations(
                dataItems
              );
            const supportForSeals =
              this.greaseResultDataSourceService.supportForSeals(dataItems);
            // hidden
            const effectiveEpAdditivation =
              this.greaseResultDataSourceService.effectiveEpAdditivation(
                dataItems
              );

            // relubrication

            let relubricationQuantityPer1000OperatingHours =
              this.greaseResultDataSourceService.relubricationQuantityPer1000OperatingHours(
                table1Items,
                rho
              );
            const relubricationPer365Days =
              this.greaseResultDataSourceService.relubricationPer365Days(
                table1Items,
                rho
              );
            let relubricationPer30Days =
              this.greaseResultDataSourceService.relubricationPer30Days(
                table1Items,
                rho
              );
            const concept1 =
              this.greaseResultDataSourceService.automaticLubrication(
                concept1Subordinate as GreaseReportConcept1Subordinate[],
                index
              );
            let maximumManualRelubricationPerInterval =
              this.greaseResultDataSourceService.maximumManualRelubricationInterval(
                table1Items,
                rho
              );
            let relubricationInterval =
              this.greaseResultDataSourceService.relubricationInterval(
                table1Items
              );
            let relubricationPer7Days =
              this.greaseResultDataSourceService.relubricationPer7Days(
                table1Items,
                rho
              );

            // greaseSelection

            let greaseServiceLife =
              this.greaseResultDataSourceService.greaseServiceLife(table1Items);
            const baseOilViscosityAt40 =
              this.greaseResultDataSourceService.baseOilViscosityAt40(
                dataItems
              );
            const lowerTemperatureLimit =
              this.greaseResultDataSourceService.lowerTemperatureLimit(
                dataItems
              );
            const upperTemperatureLimit =
              this.greaseResultDataSourceService.upperTemperatureLimit(
                dataItems
              );
            const density =
              this.greaseResultDataSourceService.density(dataItems);
            const h1Registration =
              this.greaseResultDataSourceService.h1Registration(dataItems);

            // adjustments for vertical axis

            if (this.isVerticalAxisSelected()) {
              greaseServiceLife = undefined;
              relubricationQuantityPer1000OperatingHours = undefined;
              relubricationPer30Days = undefined;
              relubricationInterval = undefined;
              maximumManualRelubricationPerInterval =
                this.greaseResultDataSourceService.maxManualRelubricationIntervalForVerticalAxis(
                  table1Items,
                  rho
                );

              relubricationPer7Days =
                this.greaseResultDataSourceService.getMaximumLubricationPer7Days(
                  table1Items,
                  rho
                );
            }

            const initialLubrication: InitialLubricationResult = {
              initialGreaseQuantity,
            };
            const performance: PerformanceResult = {
              viscosityRatio,
              additiveRequired,
              effectiveEpAdditivation,
              lowFriction,
              suitableForVibrations,
              supportForSeals,
            };
            const relubrication: RelubricationResult = {
              relubricationQuantityPer1000OperatingHours,
              relubricationPer365Days,
              relubricationPer30Days,
              relubricationPer7Days,
              concept1,
              maximumManualRelubricationPerInterval,
              relubricationInterval,
            };
            const greaseSelection = {
              greaseServiceLife,
              baseOilViscosityAt40,
              lowerTemperatureLimit,
              upperTemperatureLimit,
              density,
              h1Registration,
            };

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
              initialLubrication,
              performance,
              relubrication,
              greaseSelection,
            };

            return greaseResult;
          }
        ),
      ]
        // exclude grease which are available within the API, but should not be shown in the result because of certain limitations.
        // e.g. Arcanol XTRA3 is only for the Indian market
        .filter(
          (greaseResult) =>
            !greaseResultExceptions.includes(greaseResult?.mainTitle)
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

        greaseResults = [...greaseResults].sort(
          (
            { relubrication: { concept1: first } },
            { relubrication: { concept1: next } }
          ) =>
            suitabilityOrder.indexOf(first.custom.data.label) -
            suitabilityOrder.indexOf(next.custom.data.label)
        );
      }
      // Do sorting by kappa value here
      greaseResults = this.sortKappaValues(greaseResults);

      // move preferred grease to the top
      const preferredIndex = greaseResults.findIndex(
        (greaseResult) => greaseResult?.isPreferred
      );
      if (preferredIndex > 0) {
        greaseResults.unshift(greaseResults.splice(preferredIndex, 1)[0]);
      }

      // Call to highlight the recommended grease from the results
      await this.recommendationService.processGreaseRecommendation(
        greaseResults
      );

      greaseResults =
        this.greaseMiscibilityService.markMixableGreases(greaseResults);

      greaseResultReport.greaseResult = greaseResults;
    }

    return greaseResultReport;
  }

  public trackWarningsOpened(): void {
    this.appAnalyticsService.logInteractionEvent(
      InteractionEventType.ErrorsAndWarnings
    );
    this.applicationInsightsService.logEvent(WARNINGSOPENED);
  }

  private sortKappaValues(greaseResults: GreaseResult[]): GreaseResult[] {
    const sorted = greaseResults
      .map((result) => scoreGreaseEntry(result))
      .sort((a, b) => b.score - a.score);

    if (!environment.production) {
      /* eslint-disable no-console */
      console.table(
        sorted.flatMap((i) => ({
          name: i.greaseResult?.mainTitle,
          score: i.score,
          kappa: i.greaseResult?.performance?.viscosityRatio?.value,
          mass: i.greaseResult?.relubrication
            ?.relubricationQuantityPer1000OperatingHours?.value,
          volume:
            i.greaseResult?.relubrication
              ?.relubricationQuantityPer1000OperatingHours?.secondaryValue,
        }))
      );
    }

    return sorted.map((item) => item.greaseResult);
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
