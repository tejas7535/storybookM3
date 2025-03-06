import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, of, switchMap, takeUntil } from 'rxjs';

import { CatalogService } from '@ea/core/services/catalog.service';
import { TrackingService } from '@ea/core/services/tracking-service/tracking.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { CatalogCalculationResultActions } from '../../actions';
import { CalculationParametersFacade } from '../../facades';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';

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
              switchMap(([calculationResult]) => {
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

                return [
                  CatalogCalculationResultActions.setCalculationResult({
                    calculationResult,
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

  public fetchBearinxVersion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CatalogCalculationResultActions.fetchBearinxVersions),
      switchMap(() =>
        this.catalogService.getBearinxVersions().pipe(
          takeUntil(
            // cancel request if action is called again
            this.actions$.pipe(
              ofType(CatalogCalculationResultActions.fetchBearinxVersions)
            )
          ),
          switchMap((versions) => [
            CatalogCalculationResultActions.setBearinxVersions({ versions }),
          ]),
          catchError(() =>
            of(CatalogCalculationResultActions.unsetBearinxVersions())
          )
        )
      )
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly catalogService: CatalogService,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly trackingService: TrackingService
  ) {}
}
