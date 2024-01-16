import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, of, switchMap, takeUntil } from 'rxjs';

import { CatalogService } from '@ea/core/services/catalog.service';
import { EmbeddedGoogleAnalyticsService } from '@ea/core/services/embedded-google-analytics';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

import {
  CalculationTypesActions,
  CatalogCalculationResultActions,
} from '../../actions';
import { CalculationParametersFacade } from '../../facades';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';
import { CalculationParametersCalculationTypes } from '../../models/calculation-parameters-state.model';

@Injectable()
export class CatalogCalculationResultEffects {
  public fetchBasicFrequencies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CatalogCalculationResultActions.fetchBasicFrequencies),
      concatLatestFrom(() => [this.productSelectionFacade.bearingId$]),
      switchMap(([_action, bearingId]) =>
        this.catalogService.getBasicFrequencies(bearingId).pipe(
          takeUntil(
            // cancel request if action is called again
            this.actions$.pipe(
              ofType(CatalogCalculationResultActions.fetchBasicFrequencies)
            )
          ),
          switchMap((basicFrequenciesResult) => [
            CatalogCalculationResultActions.setBasicFrequenciesResult({
              basicFrequenciesResult,
            }),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(
              CatalogCalculationResultActions.setCalculationFailure({
                error: error.message,
              })
            )
          )
        )
      )
    );
  });

  public downloadBasicFrequenciesPdf$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CatalogCalculationResultActions.downloadBasicFrequencies),
        concatLatestFrom(() => [this.productSelectionFacade.bearingId$]),
        switchMap(([_action, bearingId]) =>
          this.catalogService.downloadBasicFrequenciesPdf(bearingId).pipe(
            catchError((error: HttpErrorResponse) =>
              of(
                CatalogCalculationResultActions.setCalculationFailure({
                  error: error.message,
                })
              )
            )
          )
        )
      );
    },
    { dispatch: false }
  );

  public fetchCalculationResult$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CatalogCalculationResultActions.fetchCalculationResult),
      concatLatestFrom(() => [
        this.productSelectionFacade.bearingId$,
        this.calculationParametersFacade.operationConditions$,
        this.calculationParametersFacade.getCalculationTypes$,
        this.calculationParametersFacade.getLoadcaseCount$,
      ]),
      switchMap(
        ([
          _action,
          bearingId,
          operatingConditions,
          originalCalculationTypes,
          loadcaseCount,
        ]) =>
          this.catalogService
            .getCalculationResult(bearingId, operatingConditions)
            .pipe(
              takeUntil(
                // cancel request if action is called again
                this.actions$.pipe(
                  ofType(CatalogCalculationResultActions.fetchCalculationResult)
                )
              ),
              concatLatestFrom(() => [
                this.calculationParametersFacade.getCalculationTypes$, // fetching an up-to-date state
              ]),
              switchMap(([calculationResult, currentCalculationTypes]) => {
                if (calculationResult.calculationError) {
                  this.trackingService.logCalculation(
                    originalCalculationTypes,
                    loadcaseCount,
                    calculationResult.calculationError.error
                  );
                } else {
                  this.trackingService.logCalculation(
                    originalCalculationTypes,
                    loadcaseCount
                  );
                }

                // special case: sometimes bearings have no friction data available. In this case we need to disable the calculation option
                const isFrictionAvailable =
                  (!!calculationResult?.loadcaseFriction?.some(
                    (frictionItem) => frictionItem.totalFrictionalPowerLoss
                  ) &&
                    !!calculationResult?.loadcaseFriction?.some(
                      (frictionItem) => frictionItem.totalFrictionalTorque
                    )) ||
                  (calculationResult?.loadcaseFriction?.[0]
                    .totalFrictionalPowerLoss &&
                    calculationResult?.loadcaseFriction?.[0]
                      .totalFrictionalTorque);
                const updatedCalculationTypes: CalculationParametersCalculationTypes =
                  {
                    ...currentCalculationTypes,
                    frictionalPowerloss: {
                      ...currentCalculationTypes.frictionalPowerloss,
                      disabled: !isFrictionAvailable,
                    },
                  };

                return [
                  CatalogCalculationResultActions.setCalculationResult({
                    calculationResult,
                  }),
                  CalculationTypesActions.setCalculationTypes({
                    calculationTypes: updatedCalculationTypes,
                  }),
                ];
              }),
              catchError((error: HttpErrorResponse) => {
                this.trackingService.logCalculation(
                  originalCalculationTypes,
                  -1,
                  error.message
                );

                return of(
                  CatalogCalculationResultActions.setCalculationFailure({
                    error: error.message,
                  })
                );
              })
            )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly catalogService: CatalogService,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly trackingService: EmbeddedGoogleAnalyticsService
  ) {}
}
