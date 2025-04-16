import { inject, Injectable } from '@angular/core';

import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap } from 'rxjs/operators';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { QuotationKpiSimulationActions } from '@gq/core/store/active-case/quotation-kpi-simulation/quotation-kpi-simulation.action';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { QuotationDetail } from '@gq/shared/models';
import { CalculationService } from '@gq/shared/services/rest/calculation/calculation.service';
import { KpiValues } from '@gq/shared/services/rest/calculation/model/quotation-detail-simulated-kpi.interface';
import {
  quotationDetailsForSimulationToRequestData,
  quotationDetailsToRequestData,
} from '@gq/shared/utils/pricing.utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

@Injectable()
export class QuotationKpiSimulationEffects {
  private readonly calculationService = inject(CalculationService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  resetSimulatedQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map((action: any) => action.payload.routerState),
      filter((routerState) =>
        routerState.url.includes(AppRoutePath.ProcessCaseViewPath)
      ),
      mergeMap(() => {
        return [QuotationKpiSimulationActions.resetSimulatedQuotation()];
      })
    );
  });

  confirmSimulatedQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuotationKpiSimulationActions.confirmSimulatedQuotation),
      concatLatestFrom(() =>
        this.store.select(activeCaseFeature.selectSimulatedItem)
      ),
      map(([_action, simulatedQuotation]) => simulatedQuotation),
      mergeMap((simulatedQuotation) => {
        const isTargetPriceSimulation =
          simulatedQuotation.simulatedField === ColumnFields.TARGET_PRICE;
        const updateQuotationDetailList = simulatedQuotation.quotationDetails
          .filter((detail) => {
            const priceToConsider = isTargetPriceSimulation
              ? detail.targetPrice
              : detail.price;

            return priceToConsider && priceToConsider > 0;
          })
          .map((detail) => ({
            gqPositionId: detail.gqPositionId,
            ...(isTargetPriceSimulation
              ? { targetPrice: detail.targetPrice }
              : { price: detail.price, priceSource: detail.priceSource }),
          }));

        return [
          ActiveCaseActions.updateQuotationDetails({
            updateQuotationDetailList,
          }),
          QuotationKpiSimulationActions.resetSimulatedQuotation(),
        ];
      })
    );
  });

  calculateSimulatedKpisForQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuotationKpiSimulationActions.calculateSimulatedKPI),
      concatMap((action) => {
        const requestBody =
          this.calculationService.createRequestForKpiSimulation(
            action.simulationData
          );

        return this.calculationService
          .getQuotationSimulationKpiCalculations(requestBody)
          .pipe(
            map((response) => {
              return QuotationKpiSimulationActions.calculateSimulatedKPISuccess(
                {
                  simulatedKpis: response,
                }
              );
            }),
            catchError((errorMessage) =>
              of(
                QuotationKpiSimulationActions.calculateSimulatedKPIFailure({
                  errorMessage,
                })
              )
            )
          );
      })
    );
  });

  calculateSimulatedSummaryKpiValues$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuotationKpiSimulationActions.calculateSimulatedKPISuccess),
      concatLatestFrom(() =>
        this.store.select(activeCaseFeature.selectSimulationData)
      ),
      map(([_action, simulationData]) => {
        const simulatedQuotationDetails =
          simulationData.selectedQuotationDetails
            .filter((detail) =>
              _action.simulatedKpis.results.find(
                (sd) => sd.gqPositionId === detail.gqPositionId
              )
            )
            .map((detail) => {
              const simulatedDetail = _action.simulatedKpis.results.find(
                (sd) => sd.gqPositionId === detail.gqPositionId
              );

              const kpis = simulatedDetail?.simulatedKpis;

              if (simulationData.simulatedField === ColumnFields.TARGET_PRICE) {
                return {
                  ...detail,
                  targetPrice: this.getAffectedKpi(
                    kpis,
                    ColumnFields.TARGET_PRICE
                  ),
                };
              }

              return {
                ...detail,
                price: simulatedDetail?.price,
                priceSource: simulatedDetail?.priceSource,
                netValue: this.getAffectedKpi(kpis, ColumnFields.NET_VALUE),
                gpi: this.getAffectedKpi(kpis, ColumnFields.GPI),
                gpm: this.getAffectedKpi(kpis, ColumnFields.GPM),
                discount: this.getAffectedKpi(kpis, ColumnFields.DISCOUNT),
                priceDiff: this.getAffectedKpi(kpis, ColumnFields.PRICE_DIFF),
                rlm: this.getAffectedKpi(kpis, ColumnFields.RLM),
              } as QuotationDetail;
            });

        return QuotationKpiSimulationActions.calculateSimulatedSummaryQuotation(
          {
            gqId: simulationData.gqId,
            simulatedQuotationDetails,
            simulatedField: simulationData.simulatedField,
            selectedQuotationDetails: simulationData.selectedQuotationDetails,
          }
        );
      })
    );
  });

  calculateSimulatedSummaryQuotation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuotationKpiSimulationActions.calculateSimulatedSummaryQuotation),
      mergeMap((action) =>
        forkJoin({
          simulatedStatusBar:
            this.calculationService.getQuotationKpiCalculation(
              quotationDetailsForSimulationToRequestData(
                action.simulatedQuotationDetails,
                action.selectedQuotationDetails
              )
            ),
          previousStatusBar: this.calculationService.getQuotationKpiCalculation(
            quotationDetailsToRequestData(action.selectedQuotationDetails)
          ),
        }).pipe(
          map(({ simulatedStatusBar, previousStatusBar }) => {
            const { gqId, simulatedField, simulatedQuotationDetails } = action;

            const simulatedQuotation = {
              gqId,
              simulatedField,
              quotationDetails: simulatedQuotationDetails,
              simulatedStatusBar,
              previousStatusBar,
            };

            return QuotationKpiSimulationActions.calculateSimulatedSummaryQuotationSuccess(
              {
                simulatedQuotation,
              }
            );
          }),
          catchError((errorMessage) =>
            of(
              QuotationKpiSimulationActions.calculateSimulatedSummaryQuotationFailure(
                {
                  errorMessage,
                }
              )
            )
          )
        )
      )
    );
  });

  private getAffectedKpi(kpis: KpiValues, field: string): number {
    return kpis[field] ?? null;
  }
}
